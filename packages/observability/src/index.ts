import { randomUUID } from "node:crypto";

const correlationIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createCorrelationId(): string {
  return randomUUID();
}

export function normalizeCorrelationId(candidate?: string): string {
  return candidate !== undefined && correlationIdPattern.test(candidate)
    ? candidate
    : createCorrelationId();
}

export interface Telemetry {
  increment(name: string, attributes?: Readonly<Record<string, boolean | number | string>>): void;
  recordDuration(name: string, milliseconds: number): void;
}

export const noOpTelemetry: Telemetry = {
  increment() {},
  recordDuration() {},
};
