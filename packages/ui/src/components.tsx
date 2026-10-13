import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => (
    <button
      {...props}
      className={["hg-button", `hg-button--${variant}`, className].filter(Boolean).join(" ")}
      ref={ref}
      type={type}
    />
  ),
);
Button.displayName = "Button";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, error, hint, id, label, ...props }, ref) => {
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="hg-field">
        <label className="hg-field__label" htmlFor={id}>
          {label}
        </label>
        <input
          {...props}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={["hg-input", error && "hg-input--error", className].filter(Boolean).join(" ")}
          id={id}
          ref={ref}
        />
        {hint ? (
          <span className="hg-field__hint" id={hintId}>
            {hint}
          </span>
        ) : null}
        {error ? (
          <span className="hg-field__error" id={errorId} role="alert">
            {error}
          </span>
        ) : null}
      </div>
    );
  },
);
TextInput.displayName = "TextInput";

export type AlertTone = "information" | "success" | "warning" | "danger";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
}

export function Alert({ children, className, title, tone = "information", ...props }: AlertProps) {
  return (
    <div
      {...props}
      className={["hg-alert", `hg-alert--${tone}`, className].filter(Boolean).join(" ")}
      role="status"
    >
      {title ? <strong className="hg-alert__title">{title}</strong> : null}
      <span>{children}</span>
    </div>
  );
}

export interface CardProps extends HTMLAttributes<HTMLElement> {
  title?: string;
}

export function Card({ children, className, title, ...props }: CardProps) {
  return (
    <section {...props} className={["hg-card", className].filter(Boolean).join(" ")}>
      {title ? <h2 className="hg-card__title">{title}</h2> : null}
      {children}
    </section>
  );
}

export type StatusTone = "neutral" | "success" | "warning" | "danger";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
  children: ReactNode;
}

export function StatusBadge({ children, className, tone = "neutral", ...props }: StatusBadgeProps) {
  return (
    <span
      {...props}
      className={["hg-status-badge", `hg-status-badge--${tone}`, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
