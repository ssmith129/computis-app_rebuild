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
import {
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface RuleEngineTableProps {
  activeTab: string;
}

const initialRules = [
  {
    id: "1",
    name: "BTC Mining Income",
    type: "Income",
    created: "2023-10-15",
    lastRun: "2023-10-24",
    affectedTransactions: 23,
    status: "Active",
    typeColor: "bg-success-bg text-success-text",
  },
  {
    id: "2",
    name: "ETH-BTC Swaps",
    type: "Trade",
    created: "2023-09-28",
    lastRun: "2023-10-24",
    affectedTransactions: 8,
    status: "Active",
    typeColor: "bg-info-bg text-info-text",
  },
  {
    id: "3",
    name: "Merge Internal Transfers",
    type: "Merge",
    created: "2023-09-14",
    lastRun: "2023-10-24",
    affectedTransactions: 42,
    status: "Active",
    typeColor: "bg-purple-100 text-purple-800",
  },
  {
    id: "4",
    name: "Exchange Fees",
    type: "Expense",
    created: "2023-08-22",
    lastRun: "2023-10-24",
    affectedTransactions: 16,
    status: "Paused",
    typeColor: "bg-error-bg text-error-text",
  },
  {
    id: "5",
    name: "Split Staking Rewards",
    type: "Split",
    created: "2023-07-05",
    lastRun: "2023-10-24",
    affectedTransactions: 7,
    status: "Active",
    typeColor: "bg-warning-bg text-warning-text",
  },
];

const getStatusVariant = (
  status: string,
): "success" | "warning" | "error" | "pending" => {
  switch (status) {
    case "Active":
      return "success";
    case "Paused":
      return "warning";
    case "Error":
      return "error";
    default:
      return "pending";
  }
};

export function RuleEngineTable({ activeTab }: RuleEngineTableProps) {
  const [rules, setRules] = useState(initialRules);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredRules = rules.filter((rule) => {
    if (activeTab === "All") return true;
    return rule.type === activeTab;
  });

  const totalPages = Math.ceil(filteredRules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedRules = filteredRules.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRules(displayedRules.map((r) => r.id));
    } else {
      setSelectedRules([]);
    }
  };

  const handleSelectRule = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRules((prev) => [...prev, id]);
    } else {
      setSelectedRules((prev) => prev.filter((r) => r !== id));
    }
  };

  const openEdit = (id: string) => {
    const rule = rules.find((r) => r.id === id);
    if (rule) {
      setEditingRule({ id: rule.id, name: rule.name });
      setEditOpen(true);
    }
  };

  const saveEdit = () => {
    if (!editingRule) return;
    setRules((prev) =>
      prev.map((r) =>
        r.id === editingRule.id ? { ...r, name: editingRule.name } : r,
      ),
    );
    setEditOpen(false);
    toast({ title: "Rule updated" });
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const doDelete = () => {
    if (!deleteId) return;
    setRules((prev) => prev.filter((r) => r.id !== deleteId));
    setSelectedRules((prev) => prev.filter((id) => id !== deleteId));
    setDeleteOpen(false);
    toast({ title: "Rule deleted" });
  };

  const toggleStatus = (id: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "Active" ? "Paused" : "Active" }
          : r,
      ),
    );
    const next =
      rules.find((r) => r.id === id)?.status === "Active" ? "Paused" : "Active";
    toast({ title: `Rule ${next === "Active" ? "resumed" : "paused"}` });
  };

  const runNow = (id: string) => {
    toast({ title: "Rule run started" });
    setTimeout(() => toast({ title: "Rule run complete" }), 800);
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedRules.length === displayedRules.length &&
                    displayedRules.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto font-medium"
                >
                  Rule Name
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>Affected Transactions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRules.includes(rule.id)}
                    onCheckedChange={(checked) =>
                      handleSelectRule(rule.id, !!checked)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>
                  <Badge className={rule.typeColor}>{rule.type}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {rule.created}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {rule.lastRun}
                </TableCell>
                <TableCell className="font-medium">
                  {rule.affectedTransactions}
                </TableCell>
                <TableCell>
                  <StatusBadge variant={getStatusVariant(rule.status)}>
                    {rule.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleStatus(rule.id)}
                      aria-label={rule.status === "Active" ? "Pause" : "Resume"}
                    >
                      {rule.status === "Active" ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
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
                        <DropdownMenuItem onClick={() => openEdit(rule.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Rule
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => runNow(rule.id)}>
                          <Play className="mr-2 h-4 w-4" />
                          Run Now
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-error"
                          onClick={() => confirmDelete(rule.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 py-2 border-t">
        <div className="text-body-md text-muted-foreground">
          Showing {Math.min(displayedRules.length, itemsPerPage)} of{" "}
          {filteredRules.length} rules
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
            <span className="text-body-md text-muted-foreground ml-2">
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
      {/* Edit Rule Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <label htmlFor="rule-name" className="text-body-md">
              Rule Name
            </label>
            <Input
              id="rule-name"
              value={editingRule?.name || ""}
              onChange={(e) =>
                setEditingRule((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev,
                )
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete rule?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-body-md text-muted-foreground">
            This action cannot be undone.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
