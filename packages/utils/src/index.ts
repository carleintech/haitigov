export function assertNever(value: never, context = "Unexpected value"): never {
  throw new Error(`${context}: ${String(value)}`);
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
