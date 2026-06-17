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
      <h2 className="text-heading-lg font-bold text-gray-900">
        Recent Uploads
      </h2>

      <Card className="overflow-hidden rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50">
              <TableHead className="font-medium text-gray-500">
                File Name
              </TableHead>
              <TableHead className="font-medium text-gray-500">
                Exchange/Wallet
              </TableHead>
              <TableHead className="font-medium text-gray-500">
                Uploaded
              </TableHead>
              <TableHead className="font-medium text-gray-500">
                Status
              </TableHead>
              <TableHead className="font-medium text-gray-500">
                Transactions
              </TableHead>
              <TableHead className="font-medium text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploadsData.map((upload, index) => (
              <TableRow
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {upload.fileName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-gray-900">{upload.exchange}</span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-gray-900">{upload.uploaded}</span>
                </TableCell>
                <TableCell className="py-3">
                  <StatusBadge variant={upload.status}>
                    {upload.statusText}
                  </StatusBadge>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-gray-900">{upload.transactions}</span>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="touch-target size-11"
                      aria-label="Preview upload"
                      {...previewLongPress}
                    >
                      <Eye className="size-4 text-gray-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="touch-target size-11"
                      aria-label="Download upload"
                    >
                      <Download className="size-4 text-gray-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="touch-target size-11"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="size-4 text-gray-400" />
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
