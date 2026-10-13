"use client";

import type { ChangeEvent, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";

export interface GovernmentHeaderProps extends HTMLAttributes<HTMLElement> {
  siteName?: string;
  homeHref?: string;
  navigationLabel?: string;
  children?: ReactNode;
}

export function GovernmentHeader({
  children,
  className,
  homeHref = "/",
  navigationLabel = "Navigasyon prensipal",
  siteName = "HaitiGov",
  ...props
}: GovernmentHeaderProps) {
  return (
    <header {...props} className={["hg-government-header", className].filter(Boolean).join(" ")}>
      <div className="hg-container hg-government-header__inner">
        <a className="hg-government-header__brand" href={homeHref}>
          <span aria-hidden="true" className="hg-government-header__mark">
            HG
          </span>
          <span>{siteName}</span>
        </a>
        {children ? <nav aria-label={navigationLabel}>{children}</nav> : null}
      </div>
    </header>
  );
}

export interface GovernmentFooterProps extends HTMLAttributes<HTMLElement> {
  siteName?: string;
  navigationLabel?: string;
  children?: ReactNode;
}

export function GovernmentFooter({
  children,
  className,
  navigationLabel = "Navigasyon anba paj",
  siteName = "HaitiGov",
  ...props
}: GovernmentFooterProps) {
  return (
    <footer {...props} className={["hg-government-footer", className].filter(Boolean).join(" ")}>
      <div className="hg-container hg-government-footer__inner">
        <p>
          © {new Date().getFullYear()} {siteName}. Platfòm pwopoze a.
        </p>
        {children ? <nav aria-label={navigationLabel}>{children}</nav> : null}
      </div>
    </footer>
  );
}

export interface LanguageOption {
  code: string;
  label: string;
}

export interface LanguageSelectorProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  value: string;
  options: readonly LanguageOption[];
  onChange: (code: string) => void;
}

export function LanguageSelector({
  className,
  label = "Lang",
  onChange,
  options,
  value,
  ...props
}: LanguageSelectorProps) {
  const id = useId();
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div {...props} className={["hg-language-selector", className].filter(Boolean).join(" ")}>
      <label htmlFor={id}>{label}</label>
      <select id={id} onChange={handleChange} value={value}>
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export interface ServiceCardProps extends HTMLAttributes<HTMLElement> {
  title: string;
  description: string;
  href: string;
  institution?: string;
  children?: ReactNode;
}

export function ServiceCard({
  children,
  className,
  description,
  href,
  institution,
  title,
  ...props
}: ServiceCardProps) {
  return (
    <article {...props} className={["hg-service-card", className].filter(Boolean).join(" ")}>
      {institution ? <p className="hg-service-card__institution">{institution}</p> : null}
      <h3>
        <a href={href}>{title}</a>
      </h3>
      <p>{description}</p>
      {children ? <div className="hg-service-card__meta">{children}</div> : null}
    </article>
  );
}

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  action?: string;
  buttonLabel?: string;
  label: string;
  onSearch?: () => void;
}

export function SearchField({
  action = "/search",
  buttonLabel = "Chèche",
  className,
  label,
  onSearch,
  name = "q",
  ...props
}: SearchFieldProps) {
  const id = useId();
  return (
    <search className="hg-search">
      <form
        action={action}
        method="get"
        onSubmit={(event) => {
          if (onSearch) {
            event.preventDefault();
            onSearch();
          }
        }}
      >
        <label className="hg-search__label" htmlFor={id}>
          {label}
        </label>
        <div className="hg-search__controls">
          <input
            {...props}
            className={["hg-input", className].filter(Boolean).join(" ")}
            id={id}
            name={name}
            type="search"
          />
          <button className="hg-button hg-button--primary" type="submit">
            {buttonLabel}
          </button>
        </div>
      </form>
    </search>
  );
}

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  className,
  currentPage,
  onPageChange,
  totalPages,
  ...props
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <nav
      {...props}
      aria-label="Paj rezilta"
      className={["hg-pagination", className].filter(Boolean).join(" ")}
    >
      {pages.map((page) => (
        <button
          aria-current={page === currentPage ? "page" : undefined}
          className={
            page === currentPage
              ? "hg-pagination__page hg-pagination__page--current"
              : "hg-pagination__page"
          }
          key={page}
          onClick={() => onPageChange?.(page)}
          type="button"
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
