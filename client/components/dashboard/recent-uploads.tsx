import { FileText, Eye, Download, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { useLongPress } from "@/hooks/use-long-press";
import { toast } from "@/hooks/use-toast";

interface Upload {
  fileName: string;
  exchange: string;
  uploaded: string;
  status: "success" | "warning" | "error";
  statusText: string;
  transactions: number;
}

const uploadsData: Upload[] = [
  {
    fileName: "coinbase_transactions_2022.csv",
    exchange: "Coinbase",
    uploaded: "2023-10-24",
    status: "success",
    statusText: "Imported",
    transactions: 124,
  },
  {
    fileName: "binance_export_q3.csv",
    exchange: "Binance",
    uploaded: "2023-10-15",
    status: "warning",
    statusText: "Mapping Required",
    transactions: 87,
  },
  {
    fileName: "kraken_history_2022.csv",
    exchange: "Kraken",
    uploaded: "2023-09-30",
    status: "error",
    statusText: "Validation Failed",
    transactions: 63,
  },
];

export function RecentUploads() {
  const previewLongPress = useLongPress({
    delay: 500,
    onLongPress: () =>
      toast({ title: "Preview", description: "Long-press detected" }),
  });
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Recent Uploads</h2>

      <Card className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted border-b border-border">
              <TableHead className="text-muted-foreground font-medium">
                File Name
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Exchange/Wallet
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Uploaded
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Status
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Transactions
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploadsData.map((upload, index) => (
              <TableRow
                key={index}
                className="border-b border-border hover:bg-muted"
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {upload.fileName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-foreground">{upload.exchange}</span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-foreground">{upload.uploaded}</span>
                </TableCell>
                <TableCell className="py-3">
                  <StatusBadge variant={upload.status}>
                    {upload.statusText}
                  </StatusBadge>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-foreground">{upload.transactions}</span>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 touch-target"
                      aria-label="Preview upload"
                      {...previewLongPress}
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 touch-target"
                      aria-label="Download upload"
                    >
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 touch-target"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
