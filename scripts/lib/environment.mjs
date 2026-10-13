const environmentNames = new Set(["development", "test", "staging", "production"]);
const logLevels = new Set(["trace", "debug", "info", "warn", "error", "fatal"]);
const nodeEnvironments = new Set(["development", "test", "production"]);

export function parseEnvironmentFile(contents) {
  const entries = [];

  for (const [index, sourceLine] of contents.split(/\r?\n/u).entries()) {
    const line = sourceLine.trim();

    if (line.length === 0 || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) {
      throw new Error(`Invalid environment assignment on line ${index + 1}.`);
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!/^[A-Z][A-Z0-9_]*$/u.test(key)) {
      throw new Error(`Invalid environment variable name on line ${index + 1}.`);
    }

    entries.push([key, value]);
  }

  return Object.fromEntries(entries);
}

export function validateEnvironment(values) {
  const errors = [];
  const environment = values.HAITIGOV_ENVIRONMENT;
  const nodeEnvironment = values.NODE_ENV;
  const logLevel = values.LOG_LEVEL;

  if (!environment || !environmentNames.has(environment)) {
    errors.push("HAITIGOV_ENVIRONMENT must be development, test, staging, or production.");
  }

  if (!nodeEnvironment || !nodeEnvironments.has(nodeEnvironment)) {
    errors.push("NODE_ENV must be development, test, or production.");
  }

  if (!logLevel || !logLevels.has(logLevel)) {
    errors.push("LOG_LEVEL must be trace, debug, info, warn, error, or fatal.");
  }

  if (
    (environment === "staging" || environment === "production") &&
    nodeEnvironment !== "production"
  ) {
    errors.push("Staging and production require NODE_ENV=production.");
  }

  return errors;
}
