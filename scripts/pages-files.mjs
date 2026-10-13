import { readFileSync, statSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES, JOURNEYS } from "../routes-data.js";

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Keep the release tied to the active site, rather than the research folders.
export function collectPagesFiles() {
  const files = new Set();
  function add(name) {
    const absolute = resolve(projectRoot, name);
    const local = relative(projectRoot, absolute).replaceAll("\\", "/");
    if (!local || local.startsWith("../") || local.startsWith("/") || /(^|\/)\.(?:env|git)(?:\/|$)/.test(local)) {
      throw new Error(`Invalid release path: ${name}`);
    }
    if (files.has(local)) return;
    if (!statSync(absolute).isFile()) throw new Error(`Release asset is not a file: ${local}`);
    files.add(local);
    if (!/\.(?:html|css|js)$/.test(local)) return;

    const text = readFileSync(absolute, "utf8");
    const expressions = local.endsWith(".html")
      ? [/(?:src|href)=["'](\.\/[^"']+)["']/g]
      : local.endsWith(".css")
        ? [/url\(["']?(\.\.?\/[^\s)'";]+)["']?\)/g]
        : [/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*|\bnew\s+URL\s*\(\s*)["'](\.\.?\/[^"']+)["']/g];
    for (const expression of expressions) {
      for (const match of text.matchAll(expression)) {
        add(relative(projectRoot, resolve(dirname(absolute), match[1])));
      }
    }
  }

  function collectAssets(value) {
    if (typeof value === "string" && /^\.\/assets\/.+\.(?:png|webp|jpe?g|svg|gif|avif)$/i.test(value)) add(value);
    else if (Array.isArray(value)) value.forEach(collectAssets);
    else if (value && typeof value === "object") Object.values(value).forEach(collectAssets);
  }

  add("index.html");
  collectAssets(ROUTES);
  collectAssets(JOURNEYS);
  return [...files].sort();
}
