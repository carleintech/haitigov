import { redactSensitiveFields } from "@haitigov/security";

export type LogLevel = "debug" | "error" | "info" | "warn";

export interface LogEvent {
  readonly correlationId?: string;
  readonly fields?: Readonly<Record<string, unknown>>;
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: string;
}

export interface Logger {
  log(level: LogLevel, message: string, fields?: Readonly<Record<string, unknown>>): void;
}

export function createJsonLogger(write: (line: string) => void, correlationId?: string): Logger {
  return {
    log(level, message, fields = {}) {
      const event: LogEvent = {
        ...(correlationId === undefined ? {} : { correlationId }),
        fields: redactSensitiveFields(fields),
        level,
        message,
        timestamp: new Date().toISOString(),
      };
      write(JSON.stringify(event));
    },
  };
}
