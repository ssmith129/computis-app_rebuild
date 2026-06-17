import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Download, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const recentExports = [
  {
    id: "1",
    date: "Oct 24, 2023",
    exportType: "CSV",
    taxYear: "2022",
    transactions: 124,
    status: "Complete",
    user: "John Smith",
    icon: FileText,
  },
  {
    id: "2",
    date: "Oct 20, 2023",
    exportType: "IRS 8949",
    taxYear: "2022",
    transactions: 120,
    status: "Complete",
    user: "John Smith",
    icon: FileText,
  },
  {
    id: "3",
    date: "Oct 15, 2023",
    exportType: "QBO",
    taxYear: "2022",
    transactions: 118,
    status: "Complete",
    user: "John Smith",
    icon: FileText,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Complete":
      return (
        <Badge className="bg-success-bg text-success-text">{status}</Badge>
      );
    case "Processing":
      return <Badge className="bg-info-bg text-info-text">{status}</Badge>;
    case "Failed":
      return <Badge className="bg-error-bg text-error-text">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getExportTypeBadge = (type: string) => {
  switch (type) {
    case "CSV":
      return (
        <Badge className="bg-category-purple-bg text-category-purple-fg">
          {type}
        </Badge>
      );
    case "IRS 8949":
      return <Badge className="bg-info-bg text-info-text">{type}</Badge>;
    case "QBO":
      return <Badge className="bg-success-bg text-success-text">{type}</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

interface RecentExportsProps {
  onRowClick?: (id: string) => void;
}

export function RecentExports({ onRowClick }: RecentExportsProps = {}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Recent Exports</h3>
          <p className="text-sm text-muted-foreground">
            Download and manage your export history
          </p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Export Type</TableHead>
              <TableHead>Tax Year</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentExports.map((exportItem) => {
              const IconComponent = exportItem.icon;
              return (
                <TableRow
                  key={exportItem.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => onRowClick?.(exportItem.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRowClick?.(exportItem.id);
                    }
                  }}
                  aria-label={`View audit trail for ${exportItem.exportType} export`}
                >
                  <TableCell className="font-medium">
                    {exportItem.date}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      {getExportTypeBadge(exportItem.exportType)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {exportItem.taxYear}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {exportItem.transactions}
                  </TableCell>
                  <TableCell>{getStatusBadge(exportItem.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {exportItem.user}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={exportItem.status !== "Complete"}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {recentExports.length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Recent Exports</h3>
          <p className="text-sm text-muted-foreground">
            Your export history will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
