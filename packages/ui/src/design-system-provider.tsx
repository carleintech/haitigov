import type { HTMLAttributes, ReactNode } from "react";

export interface DesignSystemProviderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "lang"> {
  readonly children: ReactNode;
  readonly language?: "en" | "es" | "fr" | "ht";
}

export function DesignSystemProvider({
  children,
  language = "ht",
  ...properties
}: DesignSystemProviderProps) {
  return (
    <div data-hg-theme="light" lang={language} {...properties}>
      {children}
    </div>
  );
}
