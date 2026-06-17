import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, MoreHorizontal, FileText } from "lucide-react";

const mockUploads = [
  {
    id: "1",
    fileName: "coinbase_transactions_2022.csv",
    exchange: "Coinbase",
    uploaded: "2023-10-24",
    status: "Imported",
    statusColor: "bg-success-bg text-success-text",
    transactions: 124,
  },
  {
    id: "2",
    fileName: "binance_export_q3.csv",
    exchange: "Binance",
    uploaded: "2023-10-15",
    status: "Mapping Required",
    statusColor: "bg-warning-bg text-warning-text",
    transactions: 87,
  },
  {
    id: "3",
    fileName: "kraken_history_2022.csv",
    exchange: "Kraken",
    uploaded: "2023-09-30",
    status: "Validation Failed",
    statusColor: "bg-error-bg text-error-text",
    transactions: 63,
  },
];

export function RecentUploads() {
  return (
    <div className="space-y-4">
      <h3 className="text-heading-lg font-bold text-foreground">
        Recent Uploads
      </h3>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>File Name</TableHead>
                <TableHead>Exchange/Wallet</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUploads.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground" />
                      <span className="font-medium">{upload.fileName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{upload.exchange}</TableCell>
                  <TableCell>{upload.uploaded}</TableCell>
                  <TableCell>
                    <Badge className={upload.statusColor}>
                      {upload.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{upload.transactions}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="size-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="size-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
