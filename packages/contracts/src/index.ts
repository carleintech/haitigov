export type ErrorCode =
  | "AUTHENTICATION_REQUIRED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "VALIDATION_FAILED";

export interface PlatformError {
  readonly code: ErrorCode;
  readonly correlationId: string;
  readonly details?: Readonly<Record<string, unknown>>;
  readonly message: string;
}

export interface ApiSuccess<T> {
  readonly correlationId: string;
  readonly data: T;
  readonly ok: true;
}

export interface ApiFailure {
  readonly error: PlatformError;
  readonly ok: false;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export type HealthStatus = "degraded" | "healthy" | "unhealthy";

export interface HealthCheck {
  readonly checkedAt: string;
  readonly checks: Readonly<Record<string, HealthStatus>>;
  readonly service: string;
  readonly status: HealthStatus;
  readonly version: string;
}

export * from "./institutions.js";
export * from "./services.js";
