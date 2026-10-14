#!/usr/bin/env python3
"""Create reproducible WebP display variants for images used by Routeo runtime data.

Run from any working directory with:
    py -3.11 scripts/optimize-images.py

Source artwork and photos are never modified. The generated manifest maps exact
runtime source paths to safe project-relative paths and pixel dimensions.
"""

from __future__ import annotations

import hashlib
import io
import json
import subprocess
import sys
from collections import Counter, defaultdict
from pathlib import Path, PurePosixPath
from typing import Any

from PIL import Image, ImageOps


PROJECT = Path(__file__).resolve().parents[1]
OUTPUT_ROOT = PROJECT / "assets" / "optimized"
MANIFEST_PATH = PROJECT / "assets" / "image-variants.json"
SUMMARY_PATH = OUTPUT_ROOT / "summary.json"

NODE_COLLECTOR = r"""
import { ROUTES, JOURNEYS } from './routes-data.js';

const maps = new Set();
const photos = new Set();
const add = (set, value) => {
  if (typeof value === 'string' && value.startsWith('./assets/')) set.add(value);
};

for (const route of ROUTES) add(maps, route.storyArtwork?.image || route.image);
for (const journey of Object.values(JOURNEYS)) {
  for (const image of journey.previewImages || []) add(photos, image);
  for (const candidates of Object.values(journey.photoCandidates || {})) {
    for (const photo of candidates || []) add(photos, photo?.image);
  }
  for (const restaurant of journey.dining || []) {
    for (const photo of restaurant.photos || []) add(photos, photo?.image);
  }
}

console.log(JSON.stringify({ maps: [...maps].sort(), photos: [...photos].sort() }));
"""


def collect_runtime_images() -> dict[str, list[str]]:
    result = subprocess.run(
        ["node", "--input-type=module", "--eval", NODE_COLLECTOR],
        cwd=PROJECT,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def source_file(project_path: str) -> Path:
    if not project_path.startswith("./assets/"):
        raise ValueError("image path must begin with ./assets/")
    posix_path = PurePosixPath(project_path)
    if ".." in posix_path.parts:
        raise ValueError("image path escapes the project assets directory")
    source = (PROJECT / Path(*posix_path.parts)).resolve()
    if not source.is_relative_to(PROJECT / "assets"):
        raise ValueError("image path resolves outside the project assets directory")
    return source


def public_path(path: Path) -> str:
    return "./" + path.relative_to(PROJECT).as_posix()


def normalized_image(path: Path) -> tuple[Image.Image, bytes | None, str]:
    with Image.open(path) as original:
        if getattr(original, "n_frames", 1) != 1:
            raise ValueError("animated image is outside the optimization scope")
        profile = original.info.get("icc_profile")
        oriented = ImageOps.exif_transpose(original)
        oriented.load()
        if oriented.mode not in {"RGB", "RGBA", "L", "LA"}:
            has_alpha = "A" in oriented.getbands() or "transparency" in original.info
            oriented = oriented.convert("RGBA" if has_alpha else "RGB")
        return oriented.copy(), profile, original.format or path.suffix.lstrip(".").upper()


def fit_long_edge(image: Image.Image, max_edge: int) -> Image.Image:
    width, height = image.size
    long_edge = max(width, height)
    if long_edge <= max_edge:
        return image.copy()
    ratio = max_edge / long_edge
    size = (max(1, round(width * ratio)), max(1, round(height * ratio)))
    return image.resize(size, Image.Resampling.LANCZOS)


def webp_bytes(image: Image.Image, quality: int, profile: bytes | None) -> bytes:
    buffer = io.BytesIO()
    options: dict[str, Any] = {
        "format": "WEBP",
        "quality": quality,
        "method": 6,
        "alpha_quality": 100,
        "exact": True,
    }
    if profile:
        options["icc_profile"] = profile
    image.save(buffer, **options)
    return buffer.getvalue()


def save_content_hashed(data: bytes, category: str) -> Path:
    digest = hashlib.sha256(data).hexdigest()
    relative = Path("assets") / "optimized" / category / f"{digest}.webp"
    target = PROJECT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() and target.read_bytes() != data:
        raise RuntimeError(f"content hash collision at {target}")
    if not target.exists():
        target.write_bytes(data)
    return target


def entry(image: str, dimensions: tuple[int, int]) -> dict[str, Any]:
    return {"image": image, "width": dimensions[0], "height": dimensions[1]}


def make_variant(
    source_path: Path,
    source_project_path: str,
    source_image: Image.Image,
    profile: bytes | None,
    *,
    max_edge: int | None,
    quality: int,
    category: str,
    reuse_if_source_already_fits: bool = False,
    retain_smaller_same_size_webp: bool = False,
) -> tuple[dict[str, Any], bool, int]:
    if reuse_if_source_already_fits and max_edge is not None and max(source_image.size) <= max_edge:
        return entry(source_project_path, source_image.size), True, source_path.stat().st_size

    target_image = fit_long_edge(source_image, max_edge) if max_edge is not None else source_image.copy()
    encoded = webp_bytes(target_image, quality, profile)

    if (
        retain_smaller_same_size_webp
        and max_edge is None
        and source_path.suffix.lower() == ".webp"
        and len(encoded) >= source_path.stat().st_size
    ):
        return entry(source_project_path, source_image.size), True, source_path.stat().st_size

    output = save_content_hashed(encoded, category)
    return entry(public_path(output), target_image.size), False, len(encoded)


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def main() -> int:
    runtime = collect_runtime_images()
    variants: dict[str, dict[str, dict[str, Any]]] = {}
    errors: list[dict[str, str]] = []
    native_bytes_by_kind: dict[str, int] = defaultdict(int)
    native_seen: dict[str, set[str]] = {"map": set(), "photo": set()}
    output_bytes_by_variant: Counter[str] = Counter()
    output_files_by_variant: Counter[str] = Counter()
    reused_by_variant: Counter[str] = Counter()
    referenced_variant_paths: set[str] = set()

    jobs: list[tuple[str, str]] = []
    for kind, paths in (("map", runtime["maps"]), ("photo", runtime["photos"])):
        jobs.extend((kind, value) for value in paths)

    for kind, original in jobs:
        try:
            path = source_file(original)
            if not path.is_file():
                raise FileNotFoundError(path)
            image, profile, _format = normalized_image(path)
            native_size = path.stat().st_size
            if original not in native_seen[kind]:
                native_seen[kind].add(original)
                native_bytes_by_kind[kind] += native_size
            source_dims = image.size
            image_variants: dict[str, dict[str, Any]] = {}

            if kind == "map":
                specs = (
                    ("cardSmall", 960, 78, "maps", False, False),
                    ("card", 1440, 78, "maps", False, False),
                    ("map", None, 90, "maps", False, True),
                )
            else:
                specs = (
                    ("preview", 1280, 86, "photos", True, False),
                    ("thumbnail", 320, 80, "photos", True, False),
                )

            for name, edge, quality, category, reuse_fit, retain_smaller in specs:
                spec_key = f"{kind}.{name}"
                variant, reused, size = make_variant(
                    path,
                    original,
                    image,
                    profile,
                    max_edge=edge,
                    quality=quality,
                    category=category,
                    reuse_if_source_already_fits=reuse_fit,
                    retain_smaller_same_size_webp=retain_smaller,
                )
                image_variants[name] = variant
                output_bytes_by_variant[spec_key] += size
                if reused:
                    reused_by_variant[spec_key] += 1
                else:
                    output_files_by_variant[spec_key] += 1
                    referenced_variant_paths.add(variant["image"])

            variants[original] = image_variants
        except Exception as error:  # Record a failed source and continue the batch.
            errors.append({"source": original, "error": f"{type(error).__name__}: {error}"})

    write_json(MANIFEST_PATH, dict(sorted(variants.items())))

    unique_output_bytes = 0
    for output in referenced_variant_paths:
        try:
            unique_output_bytes += source_file(output).stat().st_size
        except ValueError:
            local = (PROJECT / output.removeprefix("./")).resolve()
            unique_output_bytes += local.stat().st_size

    summary = {
        "sourceCounts": {
            "maps": len(native_seen["map"]),
            "photos": len(native_seen["photo"]),
            "total": len(native_seen["map"]) + len(native_seen["photo"]),
        },
        "nativeBytes": {
            "maps": native_bytes_by_kind["map"],
            "photos": native_bytes_by_kind["photo"],
            "total": native_bytes_by_kind["map"] + native_bytes_by_kind["photo"],
        },
        "variants": {
            key: {
                "referencedSources": sum(1 for source in variants.values() if key.split(".", 1)[1] in source),
                "generatedReferences": output_files_by_variant[key],
                "reusedOriginalReferences": reused_by_variant[key],
                "referencedBytes": output_bytes_by_variant[key],
            }
            for key in ("map.cardSmall", "map.card", "map.map", "photo.preview", "photo.thumbnail")
        },
        "uniqueGeneratedVariantFiles": len(referenced_variant_paths),
        "uniqueGeneratedVariantBytes": unique_output_bytes,
        "manifestPath": public_path(MANIFEST_PATH),
        "errors": errors,
    }
    write_json(SUMMARY_PATH, summary)

    print(f"Native originals: {summary['sourceCounts']['maps']} maps + {summary['sourceCounts']['photos']} photos; {summary['nativeBytes']['total']:,} bytes")
    for name, details in summary["variants"].items():
        print(
            f"{name}: {details['referencedSources']} references, "
            f"{details['generatedReferences']} generated, "
            f"{details['reusedOriginalReferences']} reused originals, "
            f"{details['referencedBytes']:,} referenced bytes"
        )
    print(f"Unique generated files: {summary['uniqueGeneratedVariantFiles']}; {summary['uniqueGeneratedVariantBytes']:,} bytes")
    print(f"Manifest: {public_path(MANIFEST_PATH)}")
    print(f"Errors: {len(errors)}")
    for error in errors:
        print(f"  {error['source']}: {error['error']}", file=sys.stderr)
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
