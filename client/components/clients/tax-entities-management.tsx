import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  Building2,
  MoreHorizontal,
  Edit2,
  Trash2,
  Archive,
  Eye,
  Download,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Wallet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaxEntity {
  id: string;
  entityName: string;
  taxId: string;
  entityType: string;
  jurisdiction: string;
  status: "Active" | "Inactive" | "Archived" | "In Progress";
  client: string;
  taxYear: string;
  walletCount: number;
  transactionCount: number;
  createdDate: string;
  lastModified: string;
  parentEntity?: string;
}

const mockTaxEntities: TaxEntity[] = [
  {
    id: "1",
    entityName: "Blockchain Advisors LLC 2023",
    taxId: "45-1234567",
    entityType: "LLC",
    jurisdiction: "Delaware",
    status: "Active",
    client: "Blockchain Advisors LLC",
    taxYear: "2023",
    walletCount: 12,
    transactionCount: 1547,
    createdDate: "Jan 15, 2023",
    lastModified: "2 hours ago",
  },
  {
    id: "2",
    entityName: "Crypto Tax Experts Corp 2023",
    taxId: "98-7654321",
    entityType: "Corporation",
    jurisdiction: "California",
    status: "Active",
    client: "Crypto Tax Experts Inc.",
    taxYear: "2023",
    walletCount: 24,
    transactionCount: 3892,
    createdDate: "Feb 1, 2023",
    lastModified: "1 day ago",
  },
  {
    id: "3",
    entityName: "Sarah Johnson Individual 2023",
    taxId: "XXX-XX-1234",
    entityType: "Individual",
    jurisdiction: "New York",
    status: "Active",
    client: "Sarah Johnson",
    taxYear: "2023",
    walletCount: 5,
    transactionCount: 234,
    createdDate: "Mar 10, 2023",
    lastModified: "3 days ago",
  },
  {
    id: "4",
    entityName: "Blockchain Capital Partners 2023",
    taxId: "12-9876543",
    entityType: "Partnership",
    jurisdiction: "Nevada",
    status: "In Progress",
    client: "Blockchain Capital Partners",
    taxYear: "2023",
    walletCount: 8,
    transactionCount: 0,
    createdDate: "Apr 5, 2023",
    lastModified: "1 week ago",
  },
  {
    id: "5",
    entityName: "Blockchain Advisors LLC 2022",
    taxId: "45-1234567",
    entityType: "LLC",
    jurisdiction: "Delaware",
    status: "Archived",
    client: "Blockchain Advisors LLC",
    taxYear: "2022",
    walletCount: 10,
    transactionCount: 2145,
    createdDate: "Jan 1, 2022",
    lastModified: "6 months ago",
  },
  {
    id: "6",
    entityName: "Michael Chen Individual 2023",
    taxId: "XXX-XX-5678",
    entityType: "Individual",
    jurisdiction: "Texas",
    status: "Active",
    client: "Michael Chen",
    taxYear: "2023",
    walletCount: 3,
    transactionCount: 156,
    createdDate: "May 12, 2023",
    lastModified: "5 hours ago",
  },
];

const entityTypes = [
  "LLC",
  "Corporation",
  "Partnership",
  "Individual",
  "Trust",
  "S-Corp",
  "C-Corp",
];
const jurisdictions = [
  "Delaware",
  "California",
  "New York",
  "Texas",
  "Nevada",
  "Florida",
  "Wyoming",
  "Other",
];

const getStatusBadge = (status: TaxEntity["status"]) => {
  const variants = {
    Active: "bg-success-bg text-success-text border-0",
    Inactive: "bg-gray-100 text-gray-700 border-0",
    Archived: "bg-warning-bg text-warning-text border-0",
    "In Progress": "bg-info-bg text-info-text border-0",
  };
  const icons = {
    Active: <CheckCircle2 className="h-3 w-3 mr-1" />,
    Inactive: <AlertCircle className="h-3 w-3 mr-1" />,
    Archived: <Archive className="h-3 w-3 mr-1" />,
    "In Progress": <TrendingUp className="h-3 w-3 mr-1" />,
  };
  return (
    <Badge className={variants[status]}>
      <span className="flex items-center">
        {icons[status]}
        {status}
      </span>
    </Badge>
  );
};

const getEntityTypeBadge = (type: string) => {
  const color =
    type === "Individual"
      ? "bg-cyan-100 text-cyan-700"
      : "bg-purple-100 text-purple-700";
  return <Badge className={`${color} border-0`}>{type}</Badge>;
};

export function TaxEntitiesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);

  // Dialog states
  const [addEntityOpen, setAddEntityOpen] = useState(false);
  const [editEntityOpen, setEditEntityOpen] = useState(false);
  const [viewEntityOpen, setViewEntityOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<TaxEntity | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    entityName: "",
    taxId: "",
    entityType: "LLC",
    jurisdiction: "Delaware",
    client: "",
    taxYear: new Date().getFullYear().toString(),
  });

  // Validation states
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const filteredEntities = useMemo(() => {
    return mockTaxEntities.filter((entity) => {
      const matchesSearch =
        entity.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.client.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" || entity.entityType === filterType;
      const matchesStatus =
        filterStatus === "all" || entity.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, filterType, filterStatus]);

  const handleSelectEntity = (entityId: string) => {
    setSelectedEntities((prev) =>
      prev.includes(entityId)
        ? prev.filter((id) => id !== entityId)
        : [...prev, entityId],
    );
  };

  const handleSelectAll = () => {
    setSelectedEntities(
      selectedEntities.length === filteredEntities.length
        ? []
        : filteredEntities.map((e) => e.id),
    );
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.entityName.trim())
      errors.entityName = "Entity name is required";
    if (!formData.taxId.trim()) errors.taxId = "Tax ID is required";
    if (!formData.client.trim()) errors.client = "Client is required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEntity = () => {
    if (!validateForm()) {
      toast({ title: "Please fix validation errors", variant: "destructive" });
      return;
    }
    toast({
      title: "Tax entity created",
      description: `${formData.entityName} has been created successfully`,
    });
    setAddEntityOpen(false);
    setFormData({
      entityName: "",
      taxId: "",
      entityType: "LLC",
      jurisdiction: "Delaware",
      client: "",
      taxYear: new Date().getFullYear().toString(),
    });
    setValidationErrors({});
  };

  const handleViewEntity = (entity: TaxEntity) => {
    setSelectedEntity(entity);
    setViewEntityOpen(true);
  };

  const handleEditEntity = (entity: TaxEntity) => {
    setSelectedEntity(entity);
    setFormData({
      entityName: entity.entityName,
      taxId: entity.taxId,
      entityType: entity.entityType,
      jurisdiction: entity.jurisdiction,
      client: entity.client,
      taxYear: entity.taxYear,
    });
    setEditEntityOpen(true);
  };

  const handleSaveEdit = () => {
    if (!validateForm()) {
      toast({ title: "Please fix validation errors", variant: "destructive" });
      return;
    }
    toast({ title: "Tax entity updated successfully" });
    setEditEntityOpen(false);
    setValidationErrors({});
  };

  const handleDeleteEntities = () => {
    toast({
      title: "Entities deleted",
      description: `${selectedEntities.length} tax ${selectedEntities.length > 1 ? "entities" : "entity"} deleted`,
    });
    setSelectedEntities([]);
    setDeleteDialogOpen(false);
  };

  const activeCount = mockTaxEntities.filter(
    (e) => e.status === "Active",
  ).length;
  const inProgressCount = mockTaxEntities.filter(
    (e) => e.status === "In Progress",
  ).length;
  const archivedCount = mockTaxEntities.filter(
    (e) => e.status === "Archived",
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-md font-medium text-muted-foreground">
                  Total Entities
                </p>
                <p className="text-display-xl font-bold text-info">
                  {mockTaxEntities.length}
                </p>
              </div>
              <div className="p-3 bg-info-bg rounded-lg">
                <Building2 className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-md font-medium text-muted-foreground">
                  Active
                </p>
                <p className="text-display-xl font-bold text-success">
                  {activeCount}
                </p>
              </div>
              <div className="p-3 bg-success-bg rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-md font-medium text-muted-foreground">
                  In Progress
                </p>
                <p className="text-display-xl font-bold text-info">
                  {inProgressCount}
                </p>
              </div>
              <div className="p-3 bg-info-bg rounded-lg">
                <TrendingUp className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-md font-medium text-muted-foreground">
                  Archived
                </p>
                <p className="text-display-xl font-bold text-warning">
                  {archivedCount}
                </p>
              </div>
              <div className="p-3 bg-warning-bg rounded-lg">
                <Archive className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by entity name, tax ID, or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-select-default">
              <SelectValue placeholder="Entity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {entityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-select-default">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => toast({ title: "Export started" })}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setAddEntityOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Entity
          </Button>
        </div>
      </div>

      {/* Tax Entities Table */}
      <Card>
        <CardContent className="p-0">
          {selectedEntities.length > 0 && (
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
              <div className="text-body-md font-medium">
                {selectedEntities.length}{" "}
                {selectedEntities.length > 1 ? "entities" : "entity"} selected
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Archive
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedEntities.length === filteredEntities.length &&
                      filteredEntities.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Entity Name</TableHead>
                <TableHead>Tax ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Jurisdiction</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Tax Year</TableHead>
                <TableHead>Wallets</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntities.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No tax entities found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntities.map((entity) => (
                  <TableRow key={entity.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEntities.includes(entity.id)}
                        onCheckedChange={() => handleSelectEntity(entity.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-info-bg rounded-lg">
                          <Building2 className="h-4 w-4 text-info" />
                        </div>
                        <div>
                          <div className="font-medium">{entity.entityName}</div>
                          <div className="text-body-md text-muted-foreground">
                            Last modified: {entity.lastModified}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-body-md">
                      {entity.taxId}
                    </TableCell>
                    <TableCell>
                      {getEntityTypeBadge(entity.entityType)}
                    </TableCell>
                    <TableCell>{entity.jurisdiction}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {entity.client}
                    </TableCell>
                    <TableCell>{entity.taxYear}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <span>{entity.walletCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(entity.status)}</TableCell>
                    <TableCell className="text-right">
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
                          <DropdownMenuItem
                            onClick={() => handleViewEntity(entity)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditEntity(entity)}
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Entity
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Wallet className="mr-2 h-4 w-4" />
                            Manage Wallets
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View Reports
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-error">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Entity Dialog */}
      <Dialog open={addEntityOpen} onOpenChange={setAddEntityOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Tax Entity</DialogTitle>
            <DialogDescription>
              Add a new tax entity for a client. All fields marked with * are
              required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entityName">
                  Entity Name <span className="text-error">*</span>
                </Label>
                <Input
                  id="entityName"
                  value={formData.entityName}
                  onChange={(e) =>
                    setFormData({ ...formData, entityName: e.target.value })
                  }
                  placeholder="Acme Corp 2023"
                  className={
                    validationErrors.entityName ? "border-red-500" : ""
                  }
                />
                {validationErrors.entityName && (
                  <p className="text-body-md text-error">
                    {validationErrors.entityName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">
                  Tax ID <span className="text-error">*</span>
                </Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) =>
                    setFormData({ ...formData, taxId: e.target.value })
                  }
                  placeholder="XX-XXXXXXX"
                  className={validationErrors.taxId ? "border-red-500" : ""}
                />
                {validationErrors.taxId && (
                  <p className="text-body-md text-error">
                    {validationErrors.taxId}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entityType">Entity Type</Label>
                <Select
                  value={formData.entityType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, entityType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Select
                  value={formData.jurisdiction}
                  onValueChange={(value) =>
                    setFormData({ ...formData, jurisdiction: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jurisdictions.map((jurisdiction) => (
                      <SelectItem key={jurisdiction} value={jurisdiction}>
                        {jurisdiction}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">
                  Client <span className="text-error">*</span>
                </Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) =>
                    setFormData({ ...formData, client: e.target.value })
                  }
                  placeholder="Select or enter client name"
                  className={validationErrors.client ? "border-red-500" : ""}
                />
                {validationErrors.client && (
                  <p className="text-body-md text-error">
                    {validationErrors.client}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxYear">Tax Year</Label>
                <Input
                  id="taxYear"
                  value={formData.taxYear}
                  onChange={(e) =>
                    setFormData({ ...formData, taxYear: e.target.value })
                  }
                  placeholder="2023"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddEntityOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddEntity}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Entity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Entity Dialog */}
      <Dialog open={editEntityOpen} onOpenChange={setEditEntityOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Tax Entity</DialogTitle>
            <DialogDescription>
              Update the tax entity information. All fields marked with * are
              required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-entityName">
                  Entity Name <span className="text-error">*</span>
                </Label>
                <Input
                  id="edit-entityName"
                  value={formData.entityName}
                  onChange={(e) =>
                    setFormData({ ...formData, entityName: e.target.value })
                  }
                  className={
                    validationErrors.entityName ? "border-red-500" : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-taxId">
                  Tax ID <span className="text-error">*</span>
                </Label>
                <Input
                  id="edit-taxId"
                  value={formData.taxId}
                  onChange={(e) =>
                    setFormData({ ...formData, taxId: e.target.value })
                  }
                  className={validationErrors.taxId ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-entityType">Entity Type</Label>
                <Select
                  value={formData.entityType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, entityType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-jurisdiction">Jurisdiction</Label>
                <Select
                  value={formData.jurisdiction}
                  onValueChange={(value) =>
                    setFormData({ ...formData, jurisdiction: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jurisdictions.map((jurisdiction) => (
                      <SelectItem key={jurisdiction} value={jurisdiction}>
                        {jurisdiction}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEntityOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Entity Dialog */}
      <Dialog open={viewEntityOpen} onOpenChange={setViewEntityOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Tax Entity Details</DialogTitle>
          </DialogHeader>
          {selectedEntity && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-info-bg rounded-lg">
                  <Building2 className="h-8 w-8 text-info" />
                </div>
                <div>
                  <h3 className="text-display-sm font-semibold">
                    {selectedEntity.entityName}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedEntity.client}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Tax ID</Label>
                  <p className="font-mono font-medium">
                    {selectedEntity.taxId}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Entity Type</Label>
                  <div>{getEntityTypeBadge(selectedEntity.entityType)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Jurisdiction</Label>
                  <p className="font-medium">{selectedEntity.jurisdiction}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Tax Year</Label>
                  <p className="font-medium">{selectedEntity.taxYear}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Status</Label>
                  <div>{getStatusBadge(selectedEntity.status)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Created Date</Label>
                  <p className="font-medium">{selectedEntity.createdDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-body-md text-muted-foreground">
                          Wallets
                        </p>
                        <p className="text-display-lg font-bold font-mono tabular-nums">
                          {selectedEntity.walletCount}
                        </p>
                      </div>
                      <Wallet className="h-6 w-6 text-info" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-body-md text-muted-foreground">
                          Transactions
                        </p>
                        <p className="text-display-lg font-bold font-mono tabular-nums">
                          {selectedEntity.transactionCount.toLocaleString()}
                        </p>
                      </div>
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewEntityOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setViewEntityOpen(false);
                if (selectedEntity) handleEditEntity(selectedEntity);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Entity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tax Entities</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedEntities.length}{" "}
              {selectedEntities.length > 1 ? "entities" : "entity"}? This action
              cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEntities}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
