import type { ReactNode } from "react";

export function DataTable({
  children,
  footer,
  minWidth = 860,
}: {
  children: ReactNode;
  /** Rendered below the table, inside the same bordered/rounded container (e.g. a Pagination footer). */
  footer?: ReactNode;
  minWidth?: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-mist">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" style={{ minWidth }}>
          {children}
        </table>
      </div>
      {footer}
    </div>
  );
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-navy text-[11px] font-semibold uppercase tracking-wide text-white/80">
      <tr>{children}</tr>
    </thead>
  );
}

export function DataTableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-mist bg-white dark:bg-offwhite">{children}</tbody>;
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center text-sm text-slate">
        {children}
      </td>
    </tr>
  );
}
