import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Copy,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type AnomalyIssue = {
  id: string;
  type: string;
  icon: any;
  iconColor: string;
  description: string;
  dateDetected: string;
  affectedTransactions: number;
  priority: "High" | "Medium" | "Low";
  priorityColor: string;
  status: "Open" | "In Progress" | "Resolved";
  statusColor: string;
};

interface AnomalyIssuesTableProps {
  issues: AnomalyIssue[];
  onSelectIssue: (issueId: string) => void;
  onUpdateIssue: (issueId: string, updates: Partial<AnomalyIssue>) => void;
}

export function AnomalyIssuesTable({
  issues,
  onSelectIssue,
  onUpdateIssue,
}: AnomalyIssuesTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleSelectRow = (issueId: string) => {
    setSelectedRows((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId],
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === issues.length
        ? []
        : issues.map((issue) => issue.id),
    );
  };

  const handleRowClick = (issueId: string) => {
    onSelectIssue(issueId);
  };

  const handleMarkResolved = (issueId: string) => {
    onUpdateIssue(issueId, {
      status: "Resolved",
      statusColor: "bg-success-bg text-success-text",
    });
  };

  const handleIgnore = (issueId: string) => {
    onUpdateIssue(issueId, {
      status: "Ignored" as any,
      statusColor: "bg-muted text-muted-foreground",
    });
  };

  return (
    <div className="space-y-4">
      {/* Table Header with Search */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-heading-lg font-semibold">Detected Issues</h3>
          <div className="flex items-center gap-2">
            <span className="text-body-md text-muted-foreground">
              Search Issues...
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    issues.length > 0 && selectedRows.length === issues.length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all issues"
                />
              </TableHead>
              <TableHead>Issue Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date Detected</TableHead>
              <TableHead>Affected Transactions</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => {
              const IconComponent = issue.icon || TrendingUp;
              return (
                <TableRow
                  key={issue.id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleRowClick(issue.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedRows.includes(issue.id)}
                      onCheckedChange={() => handleSelectRow(issue.id)}
                      aria-label={`Select ${issue.type}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 ${issue.iconColor}`} />
                      <span className="font-medium">{issue.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">{issue.description}</div>
                  </TableCell>
                  <TableCell>{issue.dateDetected}</TableCell>
                  <TableCell>{issue.affectedTransactions}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${issue.priorityColor} border-0`}
                    >
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${issue.statusColor} border-0`}
                    >
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectIssue(issue.id)}
                        className="h-8 w-8 p-0"
                        aria-label="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            aria-label="More actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onSelectIssue(issue.id)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleMarkResolved(issue.id)}
                          >
                            Mark as Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleIgnore(issue.id)}
                          >
                            Ignore Issue
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

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 pb-4">
        <div className="text-body-md text-muted-foreground">
          Showing {issues.length > 0 ? `1-${Math.min(5, issues.length)}` : 0} of{" "}
          {issues.length} issues
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <div className="flex gap-1">
            <Button variant="default" size="sm" className="h-8 w-8 p-0">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              3
            </Button>
            <span className="flex items-center px-2">...</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              6
            </Button>
          </div>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
