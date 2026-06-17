import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Transaction {
  id: string;
  date: string;
  type: string;
  asset: string;
  amount: string;
  fmvUsd: string;
  aiClassification: string;
  confidence: number;
  status: string;
  icon: string;
}

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
      return "bg-success-bg text-success-text border-success/30";
    case "Trade":
      return "bg-info-bg text-info-text border-info/30";
    case "Expense":
      return "bg-error-bg text-error-text border-error/30";
    case "Transfer":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Unclassified":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getTransactionTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "receive":
      return <ArrowDownLeft className="size-5 text-success" />;
    case "send":
      return <ArrowUpRight className="size-5 text-error" />;
    case "swap":
    case "merge":
      return <RefreshCw className="size-5 text-info" />;
    default:
      return <RefreshCw className="size-5 text-gray-600" />;
  }
};

const isDebit = (type: string) => {
  return type.toLowerCase() === "send";
};

export function TransactionDetailsModal({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsModalProps) {
  if (!transaction) return null;

  const txIsDebit = isDebit(transaction.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-y-auto"
        aria-describedby="transaction-details-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getTransactionTypeIcon(transaction.type)}
            <span>Transaction Details</span>
          </DialogTitle>
        </DialogHeader>

        <div id="transaction-details-description" className="sr-only">
          Detailed information about transaction {transaction.id} including
          classification, amount, and status
        </div>

        <div className="space-y-6 py-4">
          {/* Transaction Summary Card */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-body-md text-muted-foreground">
                  Transaction ID
                </p>
                <p className="font-mono text-body-md font-medium">
                  {transaction.id}
                </p>
              </div>
              <div>
                <p className="mb-1 text-body-md text-muted-foreground">Date</p>
                <p className="font-medium">{transaction.date}</p>
              </div>
              <div>
                <p className="mb-1 text-body-md text-muted-foreground">Type</p>
                <div className="flex items-center gap-2">
                  {getTransactionTypeIcon(transaction.type)}
                  <p className="font-medium">{transaction.type}</p>
                </div>
              </div>
              <div>
                <p className="mb-1 text-body-md text-muted-foreground">
                  Status
                </p>
                <StatusBadge variant={getStatusVariant(transaction.status)}>
                  {transaction.status}
                </StatusBadge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Asset & Amount Information */}
          <div>
            <h3 className="mb-4 text-heading-lg font-semibold">
              Asset Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start justify-between rounded-lg border bg-card p-4">
                <div className="space-y-1">
                  <p className="text-body-md text-muted-foreground">Asset</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-display-lg text-orange-500">
                      {transaction.icon}
                    </span>
                    <span className="text-heading-lg font-semibold">
                      {transaction.asset}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-body-md text-muted-foreground">Amount</p>
                  <p
                    className={cn(
                      "font-mono text-heading-lg font-bold",
                      txIsDebit ? "text-error" : "text-success",
                    )}
                  >
                    {txIsDebit ? "-" : "+"} {transaction.amount}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border bg-card p-4">
                  <p className="mb-1 text-body-md text-muted-foreground">
                    Fair Market Value (USD)
                  </p>
                  <p
                    className={cn(
                      "font-mono text-display-sm font-bold",
                      txIsDebit ? "text-error" : "text-success",
                    )}
                  >
                    {txIsDebit ? "-" : "+"} {transaction.fmvUsd}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="mb-1 text-body-md text-muted-foreground">
                    Transaction Hash
                  </p>
                  <p className="break-all font-mono text-caption text-muted-foreground">
                    0x{transaction.id}abc...def{transaction.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* AI Classification */}
          <div>
            <h3 className="mb-4 text-heading-lg font-semibold">
              AI Classification
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                <div>
                  <p className="mb-2 text-body-md text-muted-foreground">
                    Classification
                  </p>
                  <Badge
                    className={cn(
                      "text-body-md px-3 py-1 border",
                      getClassificationBadgeColor(transaction.aiClassification),
                    )}
                  >
                    {transaction.aiClassification}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="mb-2 text-body-md text-muted-foreground">
                    Confidence Score
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-display-lg font-bold",
                        getConfidenceColor(transaction.confidence),
                      )}
                    >
                      {transaction.confidence}%
                    </span>
                    {transaction.confidence < 40 && (
                      <AlertTriangle className="size-5 text-error" />
                    )}
                  </div>
                </div>
              </div>

              {/* Confidence Indicator Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-caption text-muted-foreground">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      transaction.confidence >= 70
                        ? "bg-success"
                        : transaction.confidence >= 40
                          ? "bg-warning"
                          : "bg-error",
                    )}
                    style={{ width: `${transaction.confidence}%` }}
                    role="progressbar"
                    aria-valuenow={transaction.confidence}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Confidence score: ${transaction.confidence}%`}
                  />
                </div>
              </div>

              {transaction.confidence < 70 && (
                <div className="rounded-lg border border-warning/30 bg-warning-bg p-3">
                  <div className="flex gap-2">
                    <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
                    <div>
                      <p className="text-body-md font-medium text-warning-text">
                        {transaction.confidence < 40
                          ? "Low Confidence Detection"
                          : "Medium Confidence Detection"}
                      </p>
                      <p className="mt-1 text-caption text-warning-text">
                        This transaction may require manual review to ensure
                        accurate classification.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Additional Details */}
          <div>
            <h3 className="mb-4 text-heading-lg font-semibold">
              Additional Details
            </h3>
            <div className="space-y-3 text-body-md">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium">
                  {transaction.asset.includes("BTC")
                    ? "Bitcoin"
                    : transaction.asset.includes("ETH")
                      ? "Ethereum"
                      : transaction.asset.includes("SOL")
                        ? "Solana"
                        : "ERC-20"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Gas Fee</span>
                <span className="font-mono font-medium">$2.45</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Block Number</span>
                <span className="font-mono font-medium">
                  {15000000 + parseInt(transaction.id) * 1000}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Confirmations</span>
                <span className="font-medium">12,543</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
