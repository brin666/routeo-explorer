import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)));
const HOST = "127.0.0.1";
const PORT = Number.parseInt(process.env.PORT || "8000", 10);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function safeStaticPath(pathname) {
  if (pathname.split("/").some((part) => part.startsWith("."))) return null;
  const requested = resolve(ROOT, "." + (pathname === "/" ? "/index.html" : pathname));
  if (requested !== ROOT && !requested.startsWith(ROOT + sep)) return null;
  return requested;
}

const server = createServer((request, response) => {
  if (!request.url || !["GET", "HEAD"].includes(request.method || "")) {
    response.writeHead(405, { allow: "GET, HEAD" });
    response.end();
    return;
  }

  let parsed;
  try { parsed = new URL(request.url, "http://" + HOST + ":" + PORT); }
  catch {
    response.writeHead(400);
    response.end();
    return;
  }

  let pathname;
  try { pathname = decodeURIComponent(parsed.pathname); }
  catch {
    response.writeHead(400);
    response.end();
    return;
  }
  const file = safeStaticPath(pathname);
  if (!file || !existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const extension = extname(file).toLowerCase();
  const headers = {
    "content-type": mimeTypes[extension] || "application/octet-stream",
    "cache-control": [".html", ".css", ".js", ".mjs"].includes(extension) ? "no-cache" : "public, max-age=3600",
    "x-content-type-options": "nosniff"
  };
  response.writeHead(200, headers);
  if (request.method === "HEAD") response.end();
  else createReadStream(file).pipe(response);
});

server.listen(PORT, HOST, () => {
  console.log("Routeo local server: http://" + HOST + ":" + PORT);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
