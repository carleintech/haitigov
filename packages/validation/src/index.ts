export interface ValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly path: readonly (number | string)[];
}

export class InputValidationError extends Error {
  public readonly issues: readonly ValidationIssue[];

  public constructor(issues: readonly ValidationIssue[]) {
    super("Input validation failed.");
    this.name = "InputValidationError";
    this.issues = issues;
  }
}

export function requireNonEmpty(value: string, path: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new InputValidationError([
      { code: "required", message: "Value is required.", path: [path] },
    ]);
  }
  return normalized;
}
