import { readdir, readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import process from "node:process";

import { parse as parseYaml } from "yaml";

const root = process.cwd();
const jsonFiles = [
  ".changeset/config.json",
  ".secretlintrc.json",
  "biome.json",
  "package.json",
  "tsconfig.json",
  "turbo.json",
];
const yamlFiles = ["compose.yaml", "pnpm-workspace.yaml"];
const workflowDirectory = resolve(root, ".github/workflows");
const actionReferencePattern = /uses:\s*[^\s@]+@([^\s#]+)/gu;
const fullCommitPattern = /^[0-9a-f]{40}$/u;

for (const relativePath of jsonFiles) {
  // The path comes from the closed, repository-owned list above.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
}

// The workflow directory is fixed relative to the current repository root.
// eslint-disable-next-line security/detect-non-literal-fs-filename
for (const entry of await readdir(workflowDirectory, { withFileTypes: true })) {
  if (entry.isFile() && [".yaml", ".yml"].includes(extname(entry.name))) {
    yamlFiles.push(join(".github/workflows", entry.name));
  }
}

for (const relativePath of yamlFiles) {
  // The paths are either closed constants or entries discovered in the fixed workflow directory.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const contents = await readFile(resolve(root, relativePath), "utf8");
  parseYaml(contents);

  if (relativePath.startsWith(".github/workflows/")) {
    for (const match of contents.matchAll(actionReferencePattern)) {
      const reference = match[1];
      if (!reference || !fullCommitPattern.test(reference)) {
        throw new Error(
          `${relativePath} contains a GitHub Action that is not pinned to a commit SHA.`,
        );
      }
    }
  }
}

console.log(`Validated ${jsonFiles.length} JSON and ${yamlFiles.length} YAML configuration files.`);
