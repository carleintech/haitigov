export type DataClassification = "confidential" | "internal" | "public" | "restricted";

const sensitiveKeyPattern = /authorization|cookie|credential|password|secret|token/i;

export function redactSensitiveFields(
  fields: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      sensitiveKeyPattern.test(key) ? "[REDACTED]" : value,
    ]),
  );
}
