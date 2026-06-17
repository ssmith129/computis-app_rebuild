import { describe, it, expect } from "vitest";
import { sortTransactions, paginationRange } from "./table-utils";
import type { Transaction } from "./transaction-details-modal";

const tx = (over: Partial<Transaction>): Transaction => ({
  id: "1",
  date: "2022-01-01",
  type: "Receive",
  asset: "Bitcoin (BTC)",
  amount: "1 BTC",
  fmvUsd: "$1.00",
  aiClassification: "Income",
  confidence: 50,
  status: "Confirmed",
  icon: "₿",
  ...over,
});

describe("sortTransactions", () => {
  it("sorts by confidence ascending and descending", () => {
    const list = [
      tx({ id: "a", confidence: 90 }),
      tx({ id: "b", confidence: 20 }),
      tx({ id: "c", confidence: 55 }),
    ];
    expect(
      sortTransactions(list, "confidence", "asc").map((t) => t.id),
    ).toEqual(["b", "c", "a"]);
    expect(
      sortTransactions(list, "confidence", "desc").map((t) => t.id),
    ).toEqual(["a", "c", "b"]);
  });

  it("sorts amount numerically, not lexicographically", () => {
    const list = [
      tx({ id: "a", amount: "0.25 BTC" }),
      tx({ id: "b", amount: "10 BTC" }),
      tx({ id: "c", amount: "2 BTC" }),
    ];
    // lexicographic would give 0.25, 10, 2; numeric must give 0.25, 2, 10
    expect(sortTransactions(list, "amount", "asc").map((t) => t.id)).toEqual([
      "a",
      "c",
      "b",
    ]);
  });

  it("sorts date chronologically", () => {
    const list = [
      tx({ id: "a", date: "2022-12-01" }),
      tx({ id: "b", date: "2022-01-15" }),
      tx({ id: "c", date: "2022-06-30" }),
    ];
    expect(sortTransactions(list, "date", "asc").map((t) => t.id)).toEqual([
      "b",
      "c",
      "a",
    ]);
  });

  it("sorts string columns case-insensitively and does not mutate input", () => {
    const list = [
      tx({ id: "a", status: "Suggested" }),
      tx({ id: "b", status: "Confirmed" }),
      tx({ id: "c", status: "Flagged" }),
    ];
    const original = list.map((t) => t.id);
    expect(sortTransactions(list, "status", "asc").map((t) => t.id)).toEqual([
      "b",
      "c",
      "a",
    ]);
    expect(list.map((t) => t.id)).toEqual(original); // input untouched
  });
});

describe("paginationRange", () => {
  it("computes the visible 1-based range for a middle page", () => {
    expect(paginationRange(2, 25, 60)).toEqual({ start: 26, end: 50 });
  });

  it("clamps the end to the total on the last page", () => {
    expect(paginationRange(3, 25, 60)).toEqual({ start: 51, end: 60 });
  });

  it("handles the first page", () => {
    expect(paginationRange(1, 25, 7)).toEqual({ start: 1, end: 7 });
  });

  it("returns a zero range when there are no items", () => {
    expect(paginationRange(1, 25, 0)).toEqual({ start: 0, end: 0 });
  });
});
