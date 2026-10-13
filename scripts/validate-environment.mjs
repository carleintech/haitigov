import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import process from "node:process";

import { parseEnvironmentFile, validateEnvironment } from "./lib/environment.mjs";

const fileFlagIndex = process.argv.indexOf("--file");
const root = process.cwd();
let values = process.env;
let source = "process environment";

if (fileFlagIndex >= 0) {
  const path = process.argv[fileFlagIndex + 1];
  if (!path) {
    throw new Error("--file requires a path.");
  }

  source = resolve(root, path);
  const relativePath = relative(root, source);
  if (relativePath.startsWith("..") || resolve(root, relativePath) !== source) {
    throw new Error("Environment files must be inside the repository.");
  }

  // The path was normalized and verified to remain within the repository root.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  values = parseEnvironmentFile(await readFile(source, "utf8"));
}

const errors = validateEnvironment(values);
if (errors.length > 0) {
  for (const error of errors) {
    console.error(`Environment error: ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Environment validation passed for ${source}.`);
}
