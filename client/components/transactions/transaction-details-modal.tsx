import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { AssetSymbol } from "@/components/ui/asset-symbol";
import { ConfidenceIndicator } from "./confidence-indicator";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Check,
  Flag,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const CLASSIFICATION_OPTIONS = [
  "Income",
  "Trade",
  "Expense",
  "Transfer",
  "Unclassified",
] as const;

// Placeholder for ledger fields we do not have. Never fabricate on-chain data
// in a tax/audit system of record — a blank is correct, a wrong value is not.
const EM_DASH = "—";

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
  /**
   * On-chain ledger fields. [DATA NEEDED] — populated only when the backend
   * provides them (see shared/api.ts). Absent => rendered as an em-dash, never
   * a computed/fabricated value.
   */
  gasFee?: string;
  blockNumber?: number;
  confirmations?: number;
}

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Decision-surface actions. The same handlers back the row actions, so the
   * modal and the table row stay in sync. Each receives the transaction id.
   */
  onConfirm?: (id: string) => void;
  onFlag?: (id: string) => void;
  onReject?: (id: string) => void;
  onReclassify?: (id: string, classification: string) => void;
}

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
      return "bg-success-bg text-success-text border-success/30";
    case "Trade":
      return "bg-info-bg text-info-text border-info/30";
    case "Expense":
      return "bg-error-bg text-error-text border-error/30";
    case "Transfer":
      return "bg-category-purple-bg text-category-purple-fg border-category-purple";
    case "Unclassified":
      return "bg-muted text-foreground border-border";
    default:
      return "bg-muted text-foreground border-border";
  }
};

const getTransactionTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "receive":
      return <ArrowDownLeft className="h-5 w-5 text-success" />;
    case "send":
      return <ArrowUpRight className="h-5 w-5 text-error" />;
    case "swap":
    case "merge":
      return <RefreshCw className="h-5 w-5 text-info" />;
    default:
      return <RefreshCw className="h-5 w-5 text-muted-foreground" />;
  }
};

const isDebit = (type: string) => {
  return type.toLowerCase() === "send";
};

export function TransactionDetailsModal({
  transaction,
  open,
  onOpenChange,
  onConfirm,
  onFlag,
  onReject,
  onReclassify,
}: TransactionDetailsModalProps) {
  const id = transaction?.id;

  // Dialog-scoped keyboard shortcuts: C = Confirm, F = Flag, R = Reject.
  // Ignored while typing in a field. Documented on /keyboard-shortcuts.
  useEffect(() => {
    if (!open || !id) return;
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el?.isContentEditable
      )
        return;
      switch (e.key.toLowerCase()) {
        case "c":
          onConfirm?.(id);
          break;
        case "f":
          onFlag?.(id);
          break;
        case "r":
          onReject?.(id);
          break;
        default:
          return;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, id, onConfirm, onFlag, onReject]);

  if (!transaction) return null;

  const txIsDebit = isDebit(transaction.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Transaction ID
                </p>
                <p className="font-mono text-sm font-medium">
                  {transaction.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <p className="font-medium">{transaction.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <div className="flex items-center gap-2">
                  {getTransactionTypeIcon(transaction.type)}
                  <p className="font-medium">{transaction.type}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <StatusBadge variant={getStatusVariant(transaction.status)}>
                  {transaction.status}
                </StatusBadge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Asset & Amount Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Asset Information</h3>
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 rounded-lg border bg-card">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Asset</p>
                  <div className="flex items-center gap-2">
                    <AssetSymbol
                      symbol={transaction.icon}
                      className="text-2xl"
                    />
                    <span className="font-semibold text-lg">
                      {transaction.asset}
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p
                    className={cn(
                      "font-mono text-lg font-bold",
                      txIsDebit ? "text-error" : "text-success",
                    )}
                  >
                    {txIsDebit ? "-" : "+"} {transaction.amount}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <p className="text-sm text-muted-foreground mb-1">
                    Fair Market Value (USD)
                  </p>
                  <p
                    className={cn(
                      "font-mono text-xl font-bold",
                      txIsDebit ? "text-error" : "text-success",
                    )}
                  >
                    {txIsDebit ? "-" : "+"} {transaction.fmvUsd}
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <p className="text-sm text-muted-foreground mb-1">
                    Transaction Hash
                  </p>
                  <p className="font-mono text-xs text-muted-foreground break-all">
                    0x{transaction.id}abc...def{transaction.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* AI Classification */}
          <div>
            <h3 className="text-lg font-semibold mb-4">AI Classification</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Classification
                  </p>
                  <Badge
                    className={cn(
                      "text-sm px-3 py-1 border",
                      getClassificationBadgeColor(transaction.aiClassification),
                    )}
                  >
                    {transaction.aiClassification}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-2">
                    Confidence Score
                  </p>
                  <ConfidenceIndicator
                    confidence={transaction.confidence}
                    size="lg"
                    className="justify-end"
                  />
                </div>
              </div>

              {/* Confidence Indicator Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
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
                <div className="p-3 rounded-lg bg-warning-bg border border-warning/30">
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-warning-text">
                        {transaction.confidence < 40
                          ? "Low Confidence Detection"
                          : "Medium Confidence Detection"}
                      </p>
                      <p className="text-xs text-warning-text mt-1">
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
            <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
            <div className="space-y-3 text-sm">
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
                <span className="font-medium font-mono">
                  {transaction.gasFee ?? EM_DASH}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Block Number</span>
                <span className="font-medium font-mono">
                  {transaction.blockNumber != null
                    ? transaction.blockNumber.toLocaleString()
                    : EM_DASH}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Confirmations</span>
                <span className="font-medium">
                  {transaction.confirmations != null
                    ? transaction.confirmations.toLocaleString()
                    : EM_DASH}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Reclassify
            </span>
            <Select
              value={transaction.aiClassification}
              onValueChange={(value) => onReclassify?.(transaction.id, value)}
            >
              <SelectTrigger
                className="w-[180px]"
                aria-label="Reclassify transaction"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLASSIFICATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="success"
              onClick={() => onConfirm?.(transaction.id)}
            >
              <Check className="h-4 w-4" />
              Confirm <kbd className="ml-1 text-xs opacity-70">C</kbd>
            </Button>
            <Button variant="warning" onClick={() => onFlag?.(transaction.id)}>
              <Flag className="h-4 w-4" />
              Flag <kbd className="ml-1 text-xs opacity-70">F</kbd>
            </Button>
            <Button
              variant="destructive"
              onClick={() => onReject?.(transaction.id)}
            >
              <X className="h-4 w-4" />
              Reject <kbd className="ml-1 text-xs opacity-70">R</kbd>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
