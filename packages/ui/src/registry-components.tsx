import type { HTMLAttributes, ReactNode } from "react";

function formatCell(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  return "—";
}

export interface DataTableColumn<Row> {
  key: string;
  label: string;
  render?: (row: Row) => ReactNode;
}

export interface DataTableProps<Row> extends HTMLAttributes<HTMLTableElement> {
  columns: readonly DataTableColumn<Row>[];
  rows: readonly Row[];
  getRowKey: (row: Row, index: number) => string;
  caption: string;
}

export function DataTable<Row extends Record<string, unknown>>({
  caption,
  className,
  columns,
  getRowKey,
  rows,
  ...props
}: DataTableProps<Row>) {
  return (
    <div className="hg-table-wrap">
      <table {...props} className={["hg-table", className].filter(Boolean).join(" ")}>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={getRowKey(row, index)}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row) : formatCell(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface InstitutionHeaderProps extends HTMLAttributes<HTMLElement> {
  institutionId: string;
  name: string;
  acronym?: string;
  type?: string;
  verificationLabel?: string;
  children?: ReactNode;
}

export function InstitutionHeader({
  acronym,
  children,
  className,
  institutionId,
  name,
  type,
  verificationLabel = "Estati verifikasyon pa espesifye",
  ...props
}: InstitutionHeaderProps) {
  return (
    <header {...props} className={["hg-institution-header", className].filter(Boolean).join(" ")}>
      <div>
        <p className="hg-institution-header__id">{institutionId}</p>
        <h2>
          {name}
          {acronym ? ` (${acronym})` : ""}
        </h2>
        {type ? <p>{type}</p> : null}
      </div>
      <div className="hg-institution-header__verification">
        <span>{verificationLabel}</span>
        {children}
      </div>
    </header>
  );
}

export interface PublicInformationBannerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
}

export function PublicInformationBanner({
  children,
  className,
  title = "Enfòmasyon piblik",
  ...props
}: PublicInformationBannerProps) {
  return (
    <div
      {...props}
      className={["hg-public-banner", className].filter(Boolean).join(" ")}
      role="note"
    >
      <strong>{title}</strong>
      <span>{children}</span>
    </div>
  );
}

export interface EmergencyAlertProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title: string;
}

export function EmergencyAlert({ children, className, title, ...props }: EmergencyAlertProps) {
  return (
    <div
      {...props}
      className={["hg-emergency-alert", className].filter(Boolean).join(" ")}
      role="alert"
    >
      <strong>{title}</strong>
      <span>{children}</span>
    </div>
  );
}
