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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
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
import {
  TransactionDetailsModal,
  type Transaction,
} from "./transaction-details-modal";

interface TransactionsTableProps {
  filters: {
    confidence: string;
    status: string;
  };
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

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 70) return "text-success";
  if (confidence >= 40) return "text-warning";
  return "text-error";
};

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

export function TransactionsTable({ filters }: TransactionsTableProps) {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 25;

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const filteredTransactions = mockTransactions.filter((transaction) => {
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

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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
              <TableHead className="date-column">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto font-medium text-xs"
                  aria-label="Sort by date"
                >
                  Date
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="type-column">Type</TableHead>
              <TableHead className="asset-column">Asset</TableHead>
              <TableHead className="amount-column">Amount</TableHead>
              <TableHead className="fmv-column">FMV (USD)</TableHead>
              <TableHead className="classification-column">
                AI Classification
              </TableHead>
              <TableHead className="confidence-column">Confidence</TableHead>
              <TableHead className="status-column">Status</TableHead>
              <TableHead className="actions-column">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="table-row-responsive">
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
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-medium text-sm ${getConfidenceColor(transaction.confidence)}`}
                    >
                      {transaction.confidence}%
                    </span>
                    {transaction.confidence < 40 && (
                      <AlertTriangle
                        className="h-3 w-3 text-error"
                        aria-label="Low confidence"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="status-column">
                  <StatusBadge variant={getStatusVariant(transaction.status)}>
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
                            onClick={() =>
                              toast({ title: "Transaction confirmed" })
                            }
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
                            onClick={() =>
                              toast({ title: "Transaction flagged" })
                            }
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
                            onClick={() =>
                              toast({ title: "Transaction rejected" })
                            }
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
          Showing {startIndex + 1} of {filteredTransactions.length} transactions
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Bulk Actions:
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={selectedTransactions.length === 0}
            onClick={() => toast({ title: "Accepted selected" })}
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

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
