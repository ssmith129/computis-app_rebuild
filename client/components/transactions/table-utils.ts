import type { Transaction } from "./transaction-details-modal";

export type SortKey =
  | "date"
  | "type"
  | "asset"
  | "amount"
  | "status"
  | "confidence";
export type SortDir = "asc" | "desc";

/** Normalize a transaction field to a comparable value for the given column. */
export function getSortValue(t: Transaction, key: SortKey): string | number {
  switch (key) {
    case "amount": {
      // "0.25 BTC" -> 0.25
      const n = parseFloat(t.amount);
      return Number.isNaN(n) ? 0 : n;
    }
    case "confidence":
      return t.confidence;
    case "date":
      return t.date; // ISO "YYYY-MM-DD" sorts lexicographically
    default:
      return String(t[key] ?? "").toLowerCase();
  }
}

/** Pure, stable-enough sort used by the table and unit tests. */
export function sortTransactions(
  list: Transaction[],
  key: SortKey,
  dir: SortDir,
): Transaction[] {
  return [...list].sort((a, b) => {
    const av = getSortValue(a, key);
    const bv = getSortValue(b, key);
    let cmp: number;
    if (typeof av === "number" && typeof bv === "number") {
      cmp = av - bv;
    } else {
      cmp = String(av).localeCompare(String(bv));
    }
    return dir === "asc" ? cmp : -cmp;
  });
}

export type TableViewState = "loading" | "error" | "empty" | "data";

/**
 * Decide which surface the table should show. Precedence: loading > error >
 * empty (zero rows) > data. Extracted so the zero-row branch is unit-testable
 * without rendering the whole table.
 */
export function getTableViewState(opts: {
  isLoading?: boolean;
  isError?: boolean;
  rowCount: number;
}): TableViewState {
  if (opts.isLoading) return "loading";
  if (opts.isError) return "error";
  if (opts.rowCount === 0) return "empty";
  return "data";
}

/**
 * 1-based inclusive range of items shown on the current page.
 * e.g. page 2 of 25-per-page over 60 items -> { start: 26, end: 50 }.
 */
export function paginationRange(
  currentPage: number,
  itemsPerPage: number,
  total: number,
): { start: number; end: number } {
  if (total === 0) return { start: 0, end: 0 };
  const startIndex = (currentPage - 1) * itemsPerPage;
  return {
    start: startIndex + 1,
    end: Math.min(startIndex + itemsPerPage, total),
  };
}
