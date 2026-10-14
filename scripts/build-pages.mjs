import { copyFileSync, mkdirSync, rmSync, statSync, writeFileSync, readFileSync, lstatSync, readdirSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { createHash } from "node:crypto";
import { collectPagesFiles, projectRoot } from "./pages-files.mjs";
import { build } from "vite";
import "./build-runtime-data.mjs";

const output = resolve(projectRoot, "dist/pages");
if (relative(projectRoot, output).replaceAll("\\", "/") !== "dist/pages") {
  throw new Error("Unexpected Pages output directory");
}
// Validate all inputs before replacing the generated release.
const files = collectPagesFiles();
files.forEach((path) => {
  const source = resolve(projectRoot, path);
  if (lstatSync(source).isSymbolicLink()) throw new Error(`Symlink is not a release asset: ${path}`);
});
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
await build({
  configFile: false,
  root: projectRoot,
  base: "./",
  publicDir: false,
  build: { outDir: output, emptyOutDir: false, sourcemap: false, minify: true, cssMinify: true }
});
// Vite emits hashed, minified scripts and lazy route chunks. Copy only image
// assets referenced by route data; those URLs keep their original source paths.
for (const path of files.filter((name) => /\.(?:png|webp|jpe?g|svg|gif|avif)$/i.test(name))) {
  const target = resolve(output, path);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(resolve(projectRoot, path), target);
}
const manifest = [];
function recordFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) recordFiles(path);
    else manifest.push({ path: relative(output, path).replaceAll("\\", "/"), bytes: statSync(path).size, sha256: createHash("sha256").update(readFileSync(path)).digest("hex") });
  }
}
recordFiles(output);
writeFileSync(resolve(output, ".nojekyll"), "");
writeFileSync(resolve(output, "release-manifest.json"), JSON.stringify({ files: manifest }, null, 2) + "\n");
const megabytes = manifest.reduce((sum, file) => sum + file.bytes, 0) / 1024 / 1024;
console.log(`Packaged ${manifest.length} runtime files (${megabytes.toFixed(1)} MiB) into dist/pages.`);
