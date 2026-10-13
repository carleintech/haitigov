import { spawnSync } from "node:child_process";
import process from "node:process";

import { isVersionAtLeast } from "./lib/version.mjs";

const minimumNodeVersion = "24.18.1";
const isSupportedNodeVersion = isVersionAtLeast(process.versions.node, minimumNodeVersion);

if (!isSupportedNodeVersion) {
  console.error(`Node.js ${minimumNodeVersion} or newer is required.`);
  process.exit(1);
}

const executableSuffix = process.platform === "win32" ? ".cmd" : "";
const requiredCommands = ["corepack", "git"];

for (const command of requiredCommands) {
  const result = spawnSync(`${command}${executableSuffix}`, ["--version"], { stdio: "ignore" });
  if (result.status !== 0) {
    console.error(`${command} is required but was not found.`);
    process.exit(1);
  }
}

const install = spawnSync(`corepack${executableSuffix}`, ["pnpm", "install", "--frozen-lockfile"], {
  stdio: "inherit",
});

if (install.status !== 0) {
  process.exit(install.status ?? 1);
}

const check = spawnSync(`corepack${executableSuffix}`, ["pnpm", "run", "check"], {
  stdio: "inherit",
});
process.exit(check.status ?? 1);
