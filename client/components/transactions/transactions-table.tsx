import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { AssetSymbol } from "@/components/ui/asset-symbol";
import { Link } from "react-router-dom";
import { ConfidenceIndicator } from "./confidence-indicator";
import {
  sortTransactions,
  paginationRange,
  getTableViewState,
  type SortKey,
  type SortDir,
} from "./table-utils";
import {
  TableLoadingSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/loading-states";
import { Inbox } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Flag,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  TransactionDetailsModal,
  type Transaction,
} from "./transaction-details-modal";

const REVIEWED_STATUSES = ["Confirmed", "Flagged", "Rejected"];

interface TransactionsTableProps {
  filters: {
    confidence: string;
    status: string;
  };
  /**
   * Async surface hooks. Data is currently mock/synchronous [ASSUMED]; these
   * are wired so a real TanStack Query layer can drive loading/error without
   * further surgery. The empty state is reachable today (filtered to zero).
   */
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2022-06-15",
    type: "Receive",
    asset: "Bitcoin (BTC)",
    amount: "0.25 BTC",
    fmvUsd: "$5,250.00",
    aiClassification: "Income",
    confidence: 65,
    status: "Confirmed",
    icon: "₿",
  },
  {
    id: "2",
    date: "2022-07-02",
    type: "Swap",
    asset: "Ethereum (ETH)",
    amount: "1.5 ETH",
    fmvUsd: "$2,850.00",
    aiClassification: "Trade",
    confidence: 78,
    status: "Suggested",
    icon: "Ξ",
  },
  {
    id: "3",
    date: "2022-08-14",
    type: "Send",
    asset: "Bitcoin (BTC)",
    amount: "0.15 BTC",
    fmvUsd: "$3,750.00",
    aiClassification: "Expense",
    confidence: 45,
    status: "Flagged",
    icon: "₿",
  },
  {
    id: "4",
    date: "2022-09-05",
    type: "Receive",
    asset: "USD Coin (USDC)",
    amount: "500 USDC",
    fmvUsd: "$500.00",
    aiClassification: "Unclassified",
    confidence: 0,
    status: "Pending",
    icon: "$",
  },
  {
    id: "5",
    date: "2022-10-22",
    type: "Merge",
    asset: "Ethereum (ETH)",
    amount: "0.75 ETH",
    fmvUsd: "$1,125.00",
    aiClassification: "Transfer",
    confidence: 92,
    status: "Confirmed",
    icon: "Ξ",
  },
  {
    id: "6",
    date: "2022-11-08",
    type: "Swap",
    asset: "Bitcoin (BTC)",
    amount: "0.08 BTC",
    fmvUsd: "$1,050.00",
    aiClassification: "Trade",
    confidence: 82,
    status: "Suggested",
    icon: "₿",
  },
  {
    id: "7",
    date: "2022-12-01",
    type: "Receive",
    asset: "Solana (SOL)",
    amount: "10 SOL",
    fmvUsd: "$350.00",
    aiClassification: "Income",
    confidence: 55,
    status: "Flagged",
    icon: "◎",
  },
];

const getStatusVariant = (
  status: string,
): "success" | "warning" | "error" | "pending" => {
  switch (status) {
    case "Confirmed":
      return "success";
    case "Suggested":
      return "warning";
    case "Flagged":
      return "error";
    case "Rejected":
      return "error";
    case "Pending":
      return "pending";
    default:
      return "pending";
  }
};

const getClassificationBadgeColor = (classification: string) => {
  switch (classification) {
    case "Income":
      return "bg-success-bg text-success-text";
    case "Trade":
      return "bg-info-bg text-info-text";
    case "Expense":
      return "bg-error-bg text-error-text";
    case "Transfer":
      return "bg-category-purple-bg text-category-purple-fg";
    case "Unclassified":
      return "bg-muted text-foreground";
    default:
      return "bg-muted text-foreground";
  }
};

export function TransactionsTable({
  filters,
  isLoading,
  isError,
  onRetry,
}: TransactionsTableProps) {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const itemsPerPage = 25;

  // Apply a patch to a set of transactions and surface a count + working Undo
  // toast. The snapshot makes the mutation reversible.
  const applyAction = (
    ids: string[],
    patch: Partial<Transaction>,
    verb: string,
  ) => {
    if (ids.length === 0) return;
    const snapshot = transactions;
    setTransactions((prev) =>
      prev.map((t) => (ids.includes(t.id) ? { ...t, ...patch } : t)),
    );
    const n = ids.length;
    toast({
      title: `${n} transaction${n === 1 ? "" : "s"} ${verb}`,
      action: (
        <ToastAction
          altText="Undo last action"
          onClick={() => setTransactions(snapshot)}
        >
          Undo
        </ToastAction>
      ),
    });
  };

  const confirmTx = (id: string) =>
    applyAction([id], { status: "Confirmed" }, "confirmed");
  const flagTx = (id: string) =>
    applyAction([id], { status: "Flagged" }, "flagged");
  const rejectTx = (id: string) =>
    applyAction([id], { status: "Rejected" }, "rejected");
  const reclassifyTx = (id: string, classification: string) =>
    applyAction(
      [id],
      { aiClassification: classification },
      `reclassified to ${classification}`,
    );

  // Cycle a column through asc -> desc -> unsorted.
  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const ariaSortFor = (key: SortKey): "ascending" | "descending" | "none" =>
    sortKey === key ? (sortDir === "asc" ? "ascending" : "descending") : "none";

  const renderSortButton = (key: SortKey, label: string) => {
    const active = sortKey === key;
    const Caret = active
      ? sortDir === "asc"
        ? ArrowUp
        : ArrowDown
      : ArrowUpDown;
    const stateLabel = active
      ? sortDir === "asc"
        ? "sorted ascending"
        : "sorted descending"
      : "not sorted";
    return (
      <Button
        variant="ghost"
        size="sm"
        className="p-0 h-auto font-medium text-xs"
        onClick={() => handleSort(key)}
        aria-label={`Sort by ${label}, ${stateLabel}`}
      >
        {label}
        <Caret
          className={`ml-1 h-3 w-3 ${active ? "text-primary" : ""}`}
          aria-hidden="true"
        />
      </Button>
    );
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const confidenceMatch =
      filters.confidence === "All" ||
      (filters.confidence === "High" && transaction.confidence >= 70) ||
      (filters.confidence === "Medium" &&
        transaction.confidence >= 40 &&
        transaction.confidence < 70) ||
      (filters.confidence === "Low" && transaction.confidence < 40);

    const statusMatch =
      filters.status === "All" || transaction.status === filters.status;

    return confidenceMatch && statusMatch;
  });

  // Sort the full filtered set BEFORE paginating so sorting spans all pages.
  const sortedTransactions = sortKey
    ? sortTransactions(filteredTransactions, sortKey, sortDir)
    : filteredTransactions;

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const range = paginationRange(
    currentPage,
    itemsPerPage,
    filteredTransactions.length,
  );

  const viewState = getTableViewState({
    isLoading,
    isError,
    rowCount: filteredTransactions.length,
  });

  // After acting from the modal, advance to the next unreviewed transaction
  // (in current sort order) or close if none remain.
  const advanceOrClose = (currentId: string) => {
    const idx = sortedTransactions.findIndex((t) => t.id === currentId);
    const next = sortedTransactions
      .slice(idx + 1)
      .find((t) => !REVIEWED_STATUSES.includes(t.status));
    if (next) {
      setSelectedTransaction(next);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleModalConfirm = (id: string) => {
    confirmTx(id);
    advanceOrClose(id);
  };
  const handleModalFlag = (id: string) => {
    flagTx(id);
    advanceOrClose(id);
  };
  const handleModalReject = (id: string) => {
    rejectTx(id);
    advanceOrClose(id);
  };

  const handleBulkConfirm = () => {
    applyAction(
      [...selectedTransactions],
      { status: "Confirmed" },
      "confirmed",
    );
    setSelectedTransactions([]);
  };

  // Keep the modal's content in sync with the latest state.
  const modalTransaction =
    transactions.find((t) => t.id === selectedTransaction?.id) ??
    selectedTransaction;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(displayedTransactions.map((t) => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions((prev) => [...prev, id]);
    } else {
      setSelectedTransactions((prev) => prev.filter((t) => t !== id));
    }
  };

  return (
    <div className="space-y-4">
      {viewState === "loading" && (
        <div className="responsive-table-container">
          <TableLoadingSkeleton rows={8} columns={11} />
        </div>
      )}

      {viewState === "error" && (
        <ErrorState
          title="Couldn't load transactions"
          description="There was a problem loading your transactions. Please try again."
          onRetry={onRetry}
        />
      )}

      {viewState === "empty" && (
        <EmptyState
          icon={Inbox}
          title="No transactions yet"
          description="No transactions yet — import a wallet to begin."
          action={
            <Button asChild>
              <Link to="/wallet-ingestion">Import a wallet</Link>
            </Button>
          }
        />
      )}

      {viewState === "data" && (
        <>
          {/* Table */}
          <div className="responsive-table-container">
            <Table className="responsive-transactions-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="checkbox-column">
                    <Checkbox
                      checked={
                        selectedTransactions.length ===
                          displayedTransactions.length &&
                        displayedTransactions.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all transactions"
                    />
                  </TableHead>
                  <TableHead className="view-column">View</TableHead>
                  <TableHead
                    className="date-column"
                    aria-sort={ariaSortFor("date")}
                  >
                    {renderSortButton("date", "Date")}
                  </TableHead>
                  <TableHead
                    className="type-column"
                    aria-sort={ariaSortFor("type")}
                  >
                    {renderSortButton("type", "Type")}
                  </TableHead>
                  <TableHead
                    className="asset-column"
                    aria-sort={ariaSortFor("asset")}
                  >
                    {renderSortButton("asset", "Asset")}
                  </TableHead>
                  <TableHead
                    className="amount-column"
                    aria-sort={ariaSortFor("amount")}
                  >
                    {renderSortButton("amount", "Amount")}
                  </TableHead>
                  <TableHead className="fmv-column">FMV (USD)</TableHead>
                  <TableHead className="classification-column">
                    AI Classification
                  </TableHead>
                  <TableHead
                    className="confidence-column"
                    aria-sort={ariaSortFor("confidence")}
                  >
                    {renderSortButton("confidence", "Confidence")}
                  </TableHead>
                  <TableHead
                    className="status-column"
                    aria-sort={ariaSortFor("status")}
                  >
                    {renderSortButton("status", "Status")}
                  </TableHead>
                  <TableHead className="actions-column">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="table-row-responsive"
                  >
                    <TableCell className="checkbox-column">
                      <Checkbox
                        checked={selectedTransactions.includes(transaction.id)}
                        onCheckedChange={(checked) =>
                          handleSelectTransaction(transaction.id, !!checked)
                        }
                        aria-label={`Select transaction ${transaction.id}`}
                      />
                    </TableCell>
                    <TableCell className="view-column">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="touch-target h-9 w-9 md:h-7 md:w-7 p-0"
                        onClick={() => handleViewDetails(transaction)}
                        aria-label={`View details for transaction ${transaction.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="date-column">
                      {transaction.date}
                    </TableCell>
                    <TableCell className="type-column">
                      {transaction.type}
                    </TableCell>
                    <TableCell className="asset-column">
                      <div className="flex items-center gap-1.5">
                        <AssetSymbol
                          symbol={transaction.icon}
                          className="text-sm"
                        />
                        <span className="text-sm truncate max-w-[120px] md:max-w-[160px]">
                          {transaction.asset}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="amount-column">
                      {transaction.amount}
                    </TableCell>
                    <TableCell className="fmv-column">
                      {transaction.fmvUsd}
                    </TableCell>
                    <TableCell className="classification-column">
                      <Badge
                        className={`${getClassificationBadgeColor(
                          transaction.aiClassification,
                        )} text-xs px-2 py-0.5 whitespace-nowrap`}
                      >
                        {transaction.aiClassification}
                      </Badge>
                    </TableCell>
                    <TableCell className="confidence-column">
                      <ConfidenceIndicator
                        confidence={transaction.confidence}
                      />
                    </TableCell>
                    <TableCell className="status-column">
                      <StatusBadge
                        variant={getStatusVariant(transaction.status)}
                      >
                        {transaction.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="actions-column">
                      <TooltipProvider>
                        <div className="flex items-center gap-0.5 md:gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="touch-target h-9 w-9 md:h-7 md:w-7 p-0 hover:bg-success-bg hover:text-success"
                                onClick={() => confirmTx(transaction.id)}
                                aria-label={`Confirm transaction ${transaction.id}`}
                              >
                                <Check className="h-4 w-4 md:h-3.5 md:w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Confirm</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="touch-target h-9 w-9 md:h-7 md:w-7 p-0 hover:bg-warning-bg hover:text-warning"
                                onClick={() => flagTx(transaction.id)}
                                aria-label={`Flag transaction ${transaction.id}`}
                              >
                                <Flag className="h-4 w-4 md:h-3.5 md:w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Flag</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="touch-target h-9 w-9 md:h-7 md:w-7 p-0 hover:bg-error-bg hover:text-error"
                                onClick={() => rejectTx(transaction.id)}
                                aria-label={`Reject transaction ${transaction.id}`}
                              >
                                <X className="h-4 w-4 md:h-3.5 md:w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Reject</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-2 py-2 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {range.start}–{range.end} of {filteredTransactions.length}{" "}
              transactions
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Bulk Actions:
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedTransactions.length === 0}
                onClick={handleBulkConfirm}
              >
                Accept All
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedTransactions.length === 0}
                onClick={() => toast({ title: "Apply tags coming soon" })}
              >
                Tag
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedTransactions.length === 0}
                onClick={() => toast({ title: "Export started" })}
              >
                Export
              </Button>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <span className="text-muted-foreground">...</span>
                )}
                <span className="text-sm text-muted-foreground ml-2">
                  {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={modalTransaction}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleModalConfirm}
        onFlag={handleModalFlag}
        onReject={handleModalReject}
        onReclassify={reclassifyTx}
      />
    </div>
  );
}
