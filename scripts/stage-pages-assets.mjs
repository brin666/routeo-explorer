import { execFileSync } from "node:child_process";
import { collectPagesFiles, projectRoot } from "./pages-files.mjs";

// Photo research folders stay ignored. Stage only files the active site uses.
const files = collectPagesFiles().filter((path) => path.startsWith("assets/") && !path.startsWith("assets/runtime/"));
for (let index = 0; index < files.length; index += 50) {
  execFileSync("git", ["add", "--force", "--", ...files.slice(index, index + 50)], { cwd: projectRoot, stdio: "inherit" });
}
console.log(`Staged ${files.length} selected runtime assets.`);
