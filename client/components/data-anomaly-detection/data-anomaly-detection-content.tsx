import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnomalyOverviewCards } from "./anomaly-overview-cards";
import { AnomalyIssuesTable, type AnomalyIssue } from "./anomaly-issues-table";
import { AnomalyIssueDetails } from "./anomaly-issue-details";
import {
  Filter,
  Settings,
  CheckCircle,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Copy,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const initialIssues: AnomalyIssue[] = [
  {
    id: "volume-spike-1",
    type: "Volume Spike",
    icon: TrendingUp,
    iconColor: "text-error",
    description: "450% increase in Bitcoin transactions on Aug 14, 2022",
    dateDetected: "Oct 25, 2023",
    affectedTransactions: 15,
    priority: "High",
    priorityColor: "bg-error-bg text-error-text",
    status: "Open",
    statusColor: "bg-warning-bg text-warning-text",
  },
  {
    id: "missing-fmv-1",
    type: "Missing FMV",
    icon: DollarSign,
    iconColor: "text-warning",
    description: "Multiple Ethereum transactions missing accurate price data",
    dateDetected: "Oct 24, 2023",
    affectedTransactions: 7,
    priority: "Medium",
    priorityColor: "bg-warning-bg text-warning-text",
    status: "In Progress",
    statusColor: "bg-info-bg text-info-text",
  },
  {
    id: "classification-conflict-1",
    type: "Classification Conflict",
    icon: AlertTriangle,
    iconColor: "text-info",
    description: "Income vs. Transfer rule conflict for Coinbase transactions",
    dateDetected: "Oct 23, 2023",
    affectedTransactions: 3,
    priority: "High",
    priorityColor: "bg-error-bg text-error-text",
    status: "Open",
    statusColor: "bg-warning-bg text-warning-text",
  },
  {
    id: "potential-duplicate-1",
    type: "Potential Duplicate",
    icon: Copy,
    iconColor: "text-purple-500",
    description: "Same amount BTC transactions within 30 seconds",
    dateDetected: "Oct 22, 2023",
    affectedTransactions: 2,
    priority: "Medium",
    priorityColor: "bg-warning-bg text-warning-text",
    status: "Resolved",
    statusColor: "bg-success-bg text-success-text",
  },
  {
    id: "volume-spike-2",
    type: "Volume Spike",
    icon: TrendingUp,
    iconColor: "text-error",
    description: "Unusual USDC transaction pattern on Oct 20, 2023",
    dateDetected: "Oct 21, 2023",
    affectedTransactions: 5,
    priority: "Low",
    priorityColor: "bg-info-bg text-info-text",
    status: "Open",
    statusColor: "bg-warning-bg text-warning-text",
  },
];

export function DataAnomalyDetectionContent() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [issues, setIssues] = useState<AnomalyIssue[]>(initialIssues);

  // Header controls state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [confirmResolveOpen, setConfirmResolveOpen] = useState(false);

  // Quick filter chips
  const [viewFilter, setViewFilter] = useState<
    "All Issues" | "High Priority" | "Resolved"
  >("All Issues");
  const [timePeriod, setTimePeriod] = useState<
    "This Week" | "This Month" | "All Time"
  >("This Week");

  // Advanced filters (Sheet)
  const [priority, setPriority] = useState<"All" | "High" | "Medium" | "Low">(
    "All",
  );
  const [status, setStatus] = useState<
    "All" | "Open" | "In Progress" | "Resolved"
  >("All");
  const [issueType, setIssueType] = useState<
    | "All"
    | "Volume Spike"
    | "Missing FMV"
    | "Classification Conflict"
    | "Potential Duplicate"
  >("All");

  const allIssueTypes = useMemo(
    () =>
      Array.from(new Set(issues.map((i) => i.type))) as Array<
        AnomalyIssue["type"]
      >,
    [issues],
  );

  const filteredIssues = useMemo(() => {
    return issues.filter((i) => {
      if (viewFilter === "High Priority" && i.priority !== "High") return false;
      if (viewFilter === "Resolved" && i.status !== "Resolved") return false;
      if (priority !== "All" && i.priority !== priority) return false;
      if (status !== "All" && i.status !== status) return false;
      if (issueType !== "All" && i.type !== issueType) return false;
      return true;
    });
  }, [issues, viewFilter, priority, status, issueType]);

  const handleUpdateIssue = (
    issueId: string,
    updates: Partial<AnomalyIssue>,
  ) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, ...updates } : i)),
    );
  };

  const handleResolveAll = () => {
    setIssues((prev) =>
      prev.map((i) => ({
        ...i,
        status: "Resolved",
        statusColor: "bg-success-bg text-success-text",
      })),
    );
    toast({ title: "All issues resolved" });
  };

  if (selectedIssue) {
    return (
      <AnomalyIssueDetails
        issueId={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />
    );
  }

  return (
    <div className="app-content">
      {/* Header */}
      <div className="page-titlebar">
        <div className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">
              Data Anomaly Detection
            </h1>
            <p className="text-muted-foreground">
              Insights on detected issues requiring your attention
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAlertsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Alert Settings
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
              onClick={() => setConfirmResolveOpen(true)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve All
            </Button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-6 pb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <div className="flex gap-1">
                {(["All Issues", "High Priority", "Resolved"] as const).map(
                  (filter) => (
                    <Button
                      key={filter}
                      variant={viewFilter === filter ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewFilter(filter)}
                      className="h-8 text-xs"
                    >
                      {filter}
                    </Button>
                  ),
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Time Period:
              </span>
              <div className="flex gap-1">
                {(["This Week", "This Month", "All Time"] as const).map(
                  (tp) => (
                    <Button
                      key={tp}
                      variant={timePeriod === tp ? "default" : "ghost"}
                      size="sm"
                      onClick={() => {
                        setTimePeriod(tp);
                        toast({ title: `Filter applied: ${tp}` });
                      }}
                      className="h-8 text-xs"
                    >
                      {tp}
                    </Button>
                  ),
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="link"
                size="sm"
                className="h-8 text-xs text-blue-600 hover:text-blue-700 p-0"
                onClick={() => toast({ title: "Audit trail coming soon" })}
              >
                View Audit Trail
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Overview Cards */}
        <AnomalyOverviewCards />

        {/* Issues Table */}
        <Card>
          <CardContent className="p-0">
            <AnomalyIssuesTable
              issues={filteredIssues}
              onSelectIssue={setSelectedIssue}
              onUpdateIssue={handleUpdateIssue}
            />
          </CardContent>
        </Card>
      </div>

      {/* Filters Sheet */}
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(v: any) => setPriority(v)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueType">Issue Type</Label>
              <Select
                value={issueType}
                onValueChange={(v: any) => setIssueType(v)}
              >
                <SelectTrigger id="issueType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {allIssueTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  setPriority("All");
                  setStatus("All");
                  setIssueType("All");
                  toast({ title: "Filters reset" });
                }}
                variant="outline"
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  setFiltersOpen(false);
                  toast({ title: "Filters applied" });
                }}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Alert Settings Dialog */}
      <Dialog open={alertsOpen} onOpenChange={setAlertsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anomaly Alerts</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-alerts">Email Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Receive email notifications for new anomalies
                </p>
              </div>
              <Switch id="email-alerts" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold (%)</Label>
              <Input
                id="threshold"
                type="number"
                min={0}
                max={100}
                defaultValue={50}
              />
              <p className="text-xs text-muted-foreground">
                Minimum change required to trigger an alert
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAlertsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setAlertsOpen(false);
                toast({ title: "Alert settings saved" });
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve All Confirmation */}
      <AlertDialog
        open={confirmResolveOpen}
        onOpenChange={setConfirmResolveOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resolve all issues?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            This will mark all detected issues as resolved. You can undo
            individually later.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleResolveAll();
                setConfirmResolveOpen(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
