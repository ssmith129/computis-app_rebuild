import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  FileText,
  Calendar,
  Filter,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  DollarSign,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

type Form8949Transaction = {
  id: string;
  description: string;
  dateAcquired: string;
  dateSold: string;
  proceeds: number;
  costBasis: number;
  adjustments: number;
  gainLoss: number;
  type: string;
  status: string;
  category: string;
  date?: string;
  asset?: string;
};

const initialForm8949Data: Form8949Transaction[] = [
  {
    id: "1",
    description: "Bitcoin Purchase - Coinbase",
    dateAcquired: "03/15/2022",
    dateSold: "08/20/2023",
    proceeds: 15750.0,
    costBasis: 12000.0,
    adjustments: 0,
    gainLoss: 3750.0,
    type: "Short-term",
    status: "Verified",
    category: "A",
  },
  {
    id: "2",
    description: "Ethereum Sale - Binance",
    dateAcquired: "01/10/2021",
    dateSold: "12/05/2023",
    proceeds: 8500.0,
    costBasis: 3200.0,
    adjustments: 0,
    gainLoss: 5300.0,
    type: "Long-term",
    status: "Verified",
    category: "A",
  },
  {
    id: "3",
    description: "Dogecoin Trade - Robinhood",
    dateAcquired: "09/22/2022",
    dateSold: "11/15/2023",
    proceeds: 2100.0,
    costBasis: 2800.0,
    adjustments: 0,
    gainLoss: -700.0,
    type: "Long-term",
    status: "Pending Review",
    category: "A",
  },
  {
    id: "4",
    description: "Litecoin Exchange - Kraken",
    dateAcquired: "06/08/2023",
    dateSold: "10/30/2023",
    proceeds: 4200.0,
    costBasis: 4100.0,
    adjustments: 0,
    gainLoss: 100.0,
    type: "Short-term",
    status: "Verified",
    category: "A",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Verified":
      return (
        <Badge className="border-0 bg-success-bg text-success-text">
          {status}
        </Badge>
      );
    case "Pending Review":
      return (
        <Badge className="border-0 bg-warning-bg text-warning-text">
          {status}
        </Badge>
      );
    case "Error":
      return (
        <Badge className="border-0 bg-error-bg text-error-text">{status}</Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getGainLossColor = (amount: number) => {
  return amount >= 0 ? "text-success" : "text-error";
};

export function Irs8949Content() {
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    [],
  );
  const [filterType, setFilterType] = useState("All");
  const [activeTab, setActiveTab] = useState("part-i");

  const [data, setData] = useState(initialForm8949Data);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewTxn, setViewTxn] = useState<Form8949Transaction | null>(null);
  const [editTxn, setEditTxn] = useState<Form8949Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredData = data.filter(
    (item) => filterType === "All" || item.type === filterType,
  );

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId],
    );
  };

  const handleSelectAll = () => {
    setSelectedTransactions(
      selectedTransactions.length === filteredData.length
        ? []
        : filteredData.map((t) => t.id),
    );
  };

  const totalGainLoss = filteredData.reduce(
    (sum, item) => sum + item.gainLoss,
    0,
  );
  const totalProceeds = filteredData.reduce(
    (sum, item) => sum + item.proceeds,
    0,
  );
  const totalCostBasis = filteredData.reduce(
    (sum, item) => sum + item.costBasis,
    0,
  );

  return (
    <div className="app-content">
      {/* Header */}
      <div className="page-titlebar">
        <div className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <h1 className="text-display-lg font-bold text-foreground">
              IRS Form 8949
            </h1>
            <p className="text-muted-foreground">
              Sales and Other Dispositions of Capital Assets
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(true)}
            >
              <Filter className="mr-2 size-4" />
              Filters
            </Button>
            <Button onClick={() => toast({ title: "Form 8949 exported" })}>
              <Download className="mr-2 size-4" />
              Export Form
            </Button>
          </div>
        </div>

        {/* Form Parts Tabs */}
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
              <TabsTrigger value="part-i">Part I - Short-term</TabsTrigger>
              <TabsTrigger value="part-ii">Part II - Long-term</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 p-4 sm:p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="size-4 text-info" />
                <div>
                  <div className="font-mono text-display-lg font-bold tabular-nums">
                    ${totalProceeds.toLocaleString()}
                  </div>
                  <p className="text-body-md text-muted-foreground">
                    Total Proceeds
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="size-4 text-warning" />
                <div>
                  <div className="font-mono text-display-lg font-bold tabular-nums">
                    ${totalCostBasis.toLocaleString()}
                  </div>
                  <p className="text-body-md text-muted-foreground">
                    Total Cost Basis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign
                  className={`size-4 ${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                />
                <div>
                  <div
                    className={`font-mono text-display-lg font-bold tabular-nums ${getGainLossColor(totalGainLoss)}`}
                  >
                    ${totalGainLoss.toLocaleString()}
                  </div>
                  <p className="text-body-md text-muted-foreground">
                    Net Gain/Loss
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-purple-600" />
                <div>
                  <div className="font-mono text-display-lg font-bold tabular-nums">
                    {filteredData.length}
                  </div>
                  <p className="text-body-md text-muted-foreground">
                    Transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-body-md text-muted-foreground">Type:</span>
            <Button
              variant={filterType === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("All")}
            >
              All
            </Button>
            <Button
              variant={filterType === "Short-term" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("Short-term")}
            >
              Short-term
            </Button>
            <Button
              variant={filterType === "Long-term" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("Long-term")}
            >
              Long-term
            </Button>
          </div>
          {selectedTransactions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-body-md text-muted-foreground">
                {selectedTransactions.length} selected
              </span>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 size-4" />
                Generate Forms
              </Button>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="part-i" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  Part I - Short-term Capital Gains and Losses
                </CardTitle>
                <p className="text-body-md text-muted-foreground">
                  Assets held one year or less
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedTransactions.length ===
                            filteredData.filter((t) => t.type === "Short-term")
                              .length
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date Acquired</TableHead>
                      <TableHead>Date Sold</TableHead>
                      <TableHead>Proceeds</TableHead>
                      <TableHead>Cost Basis</TableHead>
                      <TableHead>Adjustments</TableHead>
                      <TableHead>Gain/Loss</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData
                      .filter((t) => t.type === "Short-term")
                      .map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedTransactions.includes(
                                transaction.id,
                              )}
                              onCheckedChange={() =>
                                handleSelectTransaction(transaction.id)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {transaction.description}
                          </TableCell>
                          <TableCell>{transaction.dateAcquired}</TableCell>
                          <TableCell>{transaction.dateSold}</TableCell>
                          <TableCell>
                            ${transaction.proceeds.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ${transaction.costBasis.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ${transaction.adjustments.toLocaleString()}
                          </TableCell>
                          <TableCell
                            className={getGainLossColor(transaction.gainLoss)}
                          >
                            ${transaction.gainLoss.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-8 p-0"
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setViewTxn(transaction)}
                                >
                                  <Eye className="mr-2 size-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setEditTxn(transaction)}
                                >
                                  <Edit2 className="mr-2 size-4" />
                                  Edit Transaction
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-error"
                                  onClick={() => setDeleteId(transaction.id)}
                                >
                                  <Trash2 className="mr-2 size-4" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="part-ii" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  Part II - Long-term Capital Gains and Losses
                </CardTitle>
                <p className="text-body-md text-muted-foreground">
                  Assets held more than one year
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedTransactions.length ===
                            filteredData.filter((t) => t.type === "Long-term")
                              .length
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date Acquired</TableHead>
                      <TableHead>Date Sold</TableHead>
                      <TableHead>Proceeds</TableHead>
                      <TableHead>Cost Basis</TableHead>
                      <TableHead>Adjustments</TableHead>
                      <TableHead>Gain/Loss</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData
                      .filter((t) => t.type === "Long-term")
                      .map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedTransactions.includes(
                                transaction.id,
                              )}
                              onCheckedChange={() =>
                                handleSelectTransaction(transaction.id)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {transaction.description}
                          </TableCell>
                          <TableCell>{transaction.dateAcquired}</TableCell>
                          <TableCell>{transaction.dateSold}</TableCell>
                          <TableCell>
                            ${transaction.proceeds.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ${transaction.costBasis.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ${transaction.adjustments.toLocaleString()}
                          </TableCell>
                          <TableCell
                            className={getGainLossColor(transaction.gainLoss)}
                          >
                            ${transaction.gainLoss.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-8 p-0"
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setViewTxn(transaction)}
                                >
                                  <Eye className="mr-2 size-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setEditTxn(transaction)}
                                >
                                  <Edit2 className="mr-2 size-4" />
                                  Edit Transaction
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-error"
                                  onClick={() => setDeleteId(transaction.id)}
                                >
                                  <Trash2 className="mr-2 size-4" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Generation Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Form Generation</CardTitle>
            <p className="text-body-md text-muted-foreground">
              Generate IRS Form 8949 for tax filing
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => toast({ title: "Form 8949 exported" })}>
                <Download className="mr-2 size-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => toast({ title: "Form 8949 exported" })}
              >
                <FileText className="mr-2 size-4" />
                Download CSV
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 size-4" />
                Schedule E-filing
              </Button>
            </div>
            <div className="rounded-lg border border-info/30 bg-info-bg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 size-5 text-info" />
                <div>
                  <h4 className="font-medium text-info-text">
                    Ready for Filing
                  </h4>
                  <p className="text-body-md text-info-text">
                    All transactions have been verified and are ready for tax
                    filing. Total net gain: ${totalGainLoss.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Filters Sheet */}
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-2">
                {(["All", "Short-term", "Long-term"] as const).map((t) => (
                  <Button
                    key={t}
                    variant={filterType === t ? "default" : "outline"}
                    onClick={() => setFilterType(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setFilterType("All")}>
                Reset
              </Button>
              <Button
                onClick={() => {
                  setFiltersOpen(false);
                  toast({ title: "Filters applied" });
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* View Details Dialog */}
      <Dialog open={!!viewTxn} onOpenChange={(o) => !o && setViewTxn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {viewTxn && (
            <div className="space-y-2 text-body-md">
              <div>
                <span className="text-muted-foreground">Date:</span>{" "}
                {viewTxn.date}
              </div>
              <div>
                <span className="text-muted-foreground">Asset:</span>{" "}
                {viewTxn.asset}
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>{" "}
                {viewTxn.type}
              </div>
              <div>
                <span className="text-muted-foreground">Proceeds:</span> $
                {viewTxn.proceeds.toLocaleString()}
              </div>
              <div>
                <span className="text-muted-foreground">Cost Basis:</span> $
                {viewTxn.costBasis.toLocaleString()}
              </div>
              <div>
                <span className="text-muted-foreground">Gain/Loss:</span> $
                {viewTxn.gainLoss.toLocaleString()}
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>{" "}
                {viewTxn.status}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewTxn(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={!!editTxn} onOpenChange={(o) => !o && setEditTxn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {editTxn && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="edit-asset">Asset</Label>
                <Input
                  id="edit-asset"
                  value={editTxn.asset}
                  onChange={(e) =>
                    setEditTxn({ ...editTxn, asset: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Input
                  id="edit-type"
                  value={editTxn.type}
                  onChange={(e) =>
                    setEditTxn({ ...editTxn, type: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTxn(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editTxn) {
                  setData((prev) =>
                    prev.map((t) =>
                      t.id === editTxn.id
                        ? { ...t, asset: editTxn.asset, type: editTxn.type }
                        : t,
                    ),
                  );
                  toast({ title: "Transaction updated" });
                  setEditTxn(null);
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove transaction?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-body-md text-muted-foreground">
            This action cannot be undone.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  setData((prev) => prev.filter((t) => t.id !== deleteId));
                  setSelectedTransactions((prev) =>
                    prev.filter((id) => id !== deleteId),
                  );
                  setDeleteId(null);
                  toast({ title: "Transaction removed" });
                }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
