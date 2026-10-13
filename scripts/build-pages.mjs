import { copyFileSync, mkdirSync, rmSync, statSync, writeFileSync, readFileSync, lstatSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { createHash } from "node:crypto";
import { collectPagesFiles, projectRoot } from "./pages-files.mjs";

const output = resolve(projectRoot, "dist/pages");
if (relative(projectRoot, output).replaceAll("\\", "/") !== "dist/pages") {
  throw new Error("Unexpected Pages output directory");
}
// Validate all inputs before replacing the generated release.
const files = collectPagesFiles();
const manifest = files.map((path) => {
  const source = resolve(projectRoot, path);
  if (lstatSync(source).isSymbolicLink()) throw new Error(`Symlink is not a release asset: ${path}`);
  return { path, bytes: statSync(source).size, sha256: createHash("sha256").update(readFileSync(source)).digest("hex") };
});
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const path of files) {
  const target = resolve(output, path);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(resolve(projectRoot, path), target);
}
writeFileSync(resolve(output, ".nojekyll"), "");
writeFileSync(resolve(output, "release-manifest.json"), JSON.stringify({ files: manifest }, null, 2) + "\n");
const megabytes = manifest.reduce((sum, file) => sum + file.bytes, 0) / 1024 / 1024;
console.log(`Packaged ${files.length} runtime files (${megabytes.toFixed(1)} MiB) into dist/pages.`);
