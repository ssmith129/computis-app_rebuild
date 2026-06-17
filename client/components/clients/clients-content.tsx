import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Plus,
  Search,
  Filter,
  Building2,
  User,
  Users,
  MoreHorizontal,
  Edit2,
  Check,
  X,
  Building,
  UserCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UsersManagement } from "./users-management";
import { TaxEntitiesManagement } from "./tax-entities-management";
import { PermissionsManagement } from "./permissions-management";

const mockClients = [
  {
    id: "1",
    name: "Blockchain Advisors LLC",
    type: "Firm",
    users: 5,
    taxEntities: 12,
    status: "Active",
    lastActivity: "Today, 10:25 AM",
    icon: Building2,
    color: "text-info",
  },
  {
    id: "2",
    name: "Crypto Tax Experts Inc.",
    type: "Firm",
    users: 8,
    taxEntities: 24,
    status: "Active",
    lastActivity: "Yesterday, 3:45 PM",
    icon: Building2,
    color: "text-purple-600",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    type: "Individual",
    users: 1,
    taxEntities: 2,
    status: "Active",
    lastActivity: "Oct 25, 2023",
    icon: User,
    color: "text-success",
  },
  {
    id: "4",
    name: "Blockchain Capital Partners",
    type: "Firm",
    users: 3,
    taxEntities: 7,
    status: "Pending",
    lastActivity: "Oct 22, 2023",
    icon: Building2,
    color: "text-warning",
  },
  {
    id: "5",
    name: "Michael Chen",
    type: "Individual",
    users: 1,
    taxEntities: 1,
    status: "Archived",
    lastActivity: "Oct 15, 2023",
    icon: User,
    color: "text-error",
  },
];

const roles = [
  {
    name: "Administrator",
    description: "Full system access",
    permissions: {
      clientManagement: true,
      userManagement: true,
      taxEntityManagement: true,
      transactionClassification: true,
      reportGeneration: true,
    },
    users: 3,
    color: "blue",
  },
  {
    name: "Tax Preparer",
    description: "Full transaction access",
    permissions: {
      clientManagement: true,
      userManagement: false,
      taxEntityManagement: true,
      transactionClassification: true,
      reportGeneration: true,
    },
    users: 6,
    color: "green",
  },
  {
    name: "Client User",
    description: "Limited access",
    permissions: {
      clientManagement: true,
      userManagement: false,
      taxEntityManagement: false,
      transactionClassification: true,
      reportGeneration: false,
    },
    users: 21,
    color: "purple",
  },
];

const recentTaxEntities = [
  {
    name: "Blockchain Advisors 2022",
    client: "Blockchain Advisors LLC",
    type: "LLC",
    taxYear: "2022",
    wallets: 8,
    status: "Active",
  },
  {
    name: "Sarah Johnson 2022",
    client: "Sarah Johnson",
    type: "Individual",
    taxYear: "2022",
    wallets: 3,
    status: "Active",
  },
  {
    name: "Crypto Tax Experts 2022",
    client: "Crypto Tax Experts Inc.",
    type: "Corporation",
    taxYear: "2022",
    wallets: 15,
    status: "In Progress",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return (
        <Badge className="border-0 bg-success-bg text-success-text">
          {status}
        </Badge>
      );
    case "Pending":
      return (
        <Badge className="border-0 bg-warning-bg text-warning-text">
          {status}
        </Badge>
      );
    case "Archived":
      return (
        <Badge className="border-0 bg-gray-100 text-gray-700">{status}</Badge>
      );
    case "In Progress":
      return (
        <Badge className="border-0 bg-info-bg text-info-text">{status}</Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getPermissionIcon = (allowed: boolean) => {
  return allowed ? (
    <Check className="size-4 text-success" />
  ) : (
    <X className="size-4 text-error" />
  );
};

export function ClientsContent() {
  const [activeTab, setActiveTab] = useState("clients");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const [clients, setClients] = useState(mockClients);

  const filteredClients = useMemo(
    () =>
      clients.filter((client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [clients, searchTerm],
  );

  const handleSelectClient = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  };

  const handleSelectAll = () => {
    setSelectedClients(
      selectedClients.length === filteredClients.length
        ? []
        : filteredClients.map((c) => c.id),
    );
  };

  // Dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Add client form state
  const [newClientName, setNewClientName] = useState("");
  const [newClientType, setNewClientType] = useState<"Firm" | "Individual">(
    "Firm",
  );
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateClient = () => {
    if (!newClientName.trim()) {
      setFormError("Client name is required.");
      return;
    }
    const id = (clients.length + 1).toString();
    setClients([
      {
        id,
        name: newClientName.trim(),
        type: newClientType,
        users: newClientType === "Firm" ? 1 : 1,
        taxEntities: 0,
        status: "Active",
        lastActivity: "Just now",
        icon: newClientType === "Firm" ? Building2 : User,
        color: newClientType === "Firm" ? "text-blue-600" : "text-green-600",
      },
      ...clients,
    ]);
    setAddOpen(false);
    setNewClientName("");
    setNewClientType("Firm");
    setFormError(null);
    toast({ title: "Client created" });
  };

  const handleConfirmDelete = () => {
    setClients((prev) => prev.filter((c) => !selectedClients.includes(c.id)));
    setSelectedClients([]);
    setDeleteOpen(false);
    toast({ title: "Deleted selected clients" });
  };

  const handleConfirmExport = () => {
    setExportOpen(false);
    toast({ title: "Export started" });
    setTimeout(() => toast({ title: "Export complete" }), 800);
  };

  return (
    <div className="app-content">
      {/* Header */}
      <div className="page-titlebar">
        <div className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <h1 className="text-display-lg font-bold text-foreground">
              Client Management
            </h1>
            <p className="text-muted-foreground">
              Manage firms, client users, and tax entities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ title: "Filters coming soon" })}
            >
              <Filter className="mr-2 size-4" />
              Filters
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="mr-2 size-4" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="tax-entities">Tax Entities</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="team-access">Team Access</TabsTrigger>
              <TabsTrigger value="client-settings">Client Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="clients" className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md pl-10"
              />
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-body-md text-muted-foreground">View:</span>
              <Button variant="default" size="sm" className="h-8 text-caption">
                All Clients
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-caption">
                Firms
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-caption">
                Individuals
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-caption">
                Status:
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-caption">
                Active
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-caption">
                Pending
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-caption">
                Archived
              </Button>
              <Button
                variant="link"
                size="sm"
                className="ml-auto h-8 p-0 text-caption text-blue-600 hover:text-blue-700"
                onClick={() => toast({ title: "Activity log coming soon" })}
              >
                View Activity Log
              </Button>
            </div>

            {/* Clients Table */}
            <Card>
              <CardContent className="p-0">
                {selectedClients.length > 0 && (
                  <div className="flex items-center justify-between border-b bg-muted/30 p-4">
                    <div className="text-body-md">
                      {selectedClients.length} selected
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExportOpen(true)}
                      >
                        Export
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteOpen(true)}
                      >
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
                            selectedClients.length === filteredClients.length
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Tax Entities</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => {
                      const IconComponent = client.icon;
                      return (
                        <TableRow key={client.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedClients.includes(client.id)}
                              onCheckedChange={() =>
                                handleSelectClient(client.id)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div
                                className={`rounded-lg p-2 ${client.type === "Firm" ? "bg-info-bg" : "bg-success-bg"}`}
                              >
                                <IconComponent
                                  className={`size-4 ${client.color}`}
                                />
                              </div>
                              <span className="font-medium">{client.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                client.type === "Firm"
                                  ? "bg-info-bg text-info-text"
                                  : "bg-success-bg text-success-text"
                              }
                            >
                              {client.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{client.users}</TableCell>
                          <TableCell>{client.taxEntities}</TableCell>
                          <TableCell>{getStatusBadge(client.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {client.lastActivity}
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
                                <DropdownMenuItem>
                                  <Edit2 className="mr-2 size-4" />
                                  Edit Client
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Users className="mr-2 size-4" />
                                  Manage Users
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Building className="mr-2 size-4" />
                                  Tax Entities
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t p-4">
                  <div className="text-body-md text-muted-foreground">
                    Showing 5 of 12 clients
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <div className="flex gap-1">
                      <Button
                        variant="default"
                        size="sm"
                        className="size-8 p-0"
                      >
                        1
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="size-8 p-0"
                      >
                        2
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="size-8 p-0"
                      >
                        3
                      </Button>
                      <span className="flex items-center px-2">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="size-8 p-0"
                      >
                        7
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="tax-entities" className="space-y-6">
            <TaxEntitiesManagement />
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <PermissionsManagement />
          </TabsContent>

          <TabsContent value="team-access" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members with Access</CardTitle>
                    <p className="mt-1 text-body-md text-muted-foreground">
                      Manage team access and permissions for this client
                    </p>
                  </div>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    <Plus className="mr-2 size-4" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-body-md font-semibold text-white">
                            SC
                          </div>
                          <div>
                            <div className="font-medium">Sarah Chen</div>
                            <div className="text-body-md text-muted-foreground">
                              sarah.chen@cpa.com
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="border-0 bg-blue-100 text-blue-700">
                          Senior CPA
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        2 hours ago
                      </TableCell>
                      <TableCell>
                        <Badge className="border-0 bg-green-100 text-green-700">
                          Full Access
                        </Badge>
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
                            <DropdownMenuItem>
                              <Edit2 className="mr-2 size-4" />
                              Edit Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 size-4" />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-error">
                              <X className="mr-2 size-4" />
                              Remove Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-red-500 text-body-md font-semibold text-white">
                            DW
                          </div>
                          <div>
                            <div className="font-medium">David Wong</div>
                            <div className="text-body-md text-muted-foreground">
                              david.wong@cpa.com
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="border-0 bg-purple-100 text-purple-700">
                          Managing Partner
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        1 day ago
                      </TableCell>
                      <TableCell>
                        <Badge className="border-0 bg-green-100 text-green-700">
                          Full Access
                        </Badge>
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
                            <DropdownMenuItem>
                              <Edit2 className="mr-2 size-4" />
                              Edit Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 size-4" />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-error">
                              <X className="mr-2 size-4" />
                              Remove Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-body-md font-semibold text-white">
                            JP
                          </div>
                          <div>
                            <div className="font-medium">James Park</div>
                            <div className="text-body-md text-muted-foreground">
                              james.park@acmefund.com
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="border-0 bg-gray-100 text-gray-700">
                          Client
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        3 days ago
                      </TableCell>
                      <TableCell>
                        <Badge className="border-0 bg-warning-bg text-warning-text">
                          View Only
                        </Badge>
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
                            <DropdownMenuItem>
                              <Edit2 className="mr-2 size-4" />
                              Edit Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 size-4" />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-error">
                              <X className="mr-2 size-4" />
                              Remove Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Permission Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Access Level Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border bg-info-bg p-4 dark:bg-info-bg/30">
                    <div className="text-display-lg font-semibold text-info dark:text-info">
                      2
                    </div>
                    <div className="mt-1 text-body-md text-muted-foreground">
                      Full Access Members
                    </div>
                  </div>
                  <div className="rounded-lg border bg-warning-bg p-4 dark:bg-warning-bg/30">
                    <div className="text-display-lg font-semibold text-warning dark:text-warning">
                      1
                    </div>
                    <div className="mt-1 text-body-md text-muted-foreground">
                      Limited Access Members
                    </div>
                  </div>
                  <div className="rounded-lg border bg-success-bg p-4 dark:bg-success-bg/30">
                    <div className="text-display-lg font-semibold text-success dark:text-success">
                      3
                    </div>
                    <div className="mt-1 text-body-md text-muted-foreground">
                      Total Team Members
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="client-settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Configuration</CardTitle>
                <p className="mt-1 text-body-md text-muted-foreground">
                  Manage client-specific settings and preferences
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* General Settings */}
                <div className="space-y-4">
                  <h3 className="text-body-md font-semibold">
                    General Settings
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Client Name</Label>
                      <Input
                        id="client-name"
                        defaultValue="Acme Crypto Fund"
                        placeholder="Enter client name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-type">Client Type</Label>
                      <Input
                        id="client-type"
                        defaultValue="Firm"
                        placeholder="Select type"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-year">Default Tax Year</Label>
                      <Input
                        id="tax-year"
                        defaultValue="2023"
                        placeholder="Enter tax year"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accounting-method">
                        Accounting Method
                      </Label>
                      <Input
                        id="accounting-method"
                        defaultValue="FIFO"
                        placeholder="Select method"
                      />
                    </div>
                  </div>
                </div>

                {/* Tax Settings */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-body-md font-semibold">Tax Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="text-body-md font-medium">
                          Enable Auto-Classification
                        </div>
                        <div className="text-caption text-muted-foreground">
                          Automatically classify transactions using AI
                        </div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="text-body-md font-medium">
                          Require CPA Approval
                        </div>
                        <div className="text-caption text-muted-foreground">
                          All classifications must be approved by a CPA
                        </div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="text-body-md font-medium">
                          Track Cost Basis
                        </div>
                        <div className="text-caption text-muted-foreground">
                          Automatically track cost basis for all assets
                        </div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="text-body-md font-medium">
                          Generate Audit Trails
                        </div>
                        <div className="text-caption text-muted-foreground">
                          Create detailed audit logs for all actions
                        </div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-body-md font-semibold">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="text-body-md font-medium">
                          Email Alerts
                        </div>
                        <div className="text-caption text-muted-foreground">
                          Send email notifications for important events
                        </div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="text-body-md font-medium">
                          Weekly Reports
                        </div>
                        <div className="text-caption text-muted-foreground">
                          Receive weekly summary reports via email
                        </div>
                      </div>
                      <Checkbox />
                    </div>
                  </div>
                </div>

                {/* Save Actions */}
                <div className="flex justify-end gap-3 border-t pt-6">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-error/30 dark:border-error/30">
              <CardHeader>
                <CardTitle className="text-error dark:text-error">
                  Danger Zone
                </CardTitle>
                <p className="mt-1 text-body-md text-muted-foreground">
                  Irreversible actions that affect this client
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                  <div>
                    <div className="text-body-md font-medium">
                      Archive Client
                    </div>
                    <div className="text-caption text-muted-foreground">
                      Move this client to archived status
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-100"
                  >
                    Archive
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                  <div>
                    <div className="text-body-md font-medium">
                      Delete Client
                    </div>
                    <div className="text-caption text-muted-foreground">
                      Permanently delete this client and all associated data
                    </div>
                  </div>
                  <Button variant="destructive">Delete</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Roles & Permissions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-lg font-semibold">
              Roles & Permissions
            </h2>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="mr-2 size-4" />
              Create Role
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {roles.map((role, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg p-2 ${
                          role.color === "blue"
                            ? "bg-info-bg"
                            : role.color === "green"
                              ? "bg-success-bg"
                              : "bg-purple-100"
                        }`}
                      >
                        <UserCheck
                          className={`size-5 ${
                            role.color === "blue"
                              ? "text-info"
                              : role.color === "green"
                                ? "text-success"
                                : "text-purple-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{role.name}</h3>
                        <p className="text-body-md text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-body-md">Client Management</span>
                      {getPermissionIcon(role.permissions.clientManagement)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-body-md">User Management</span>
                      {getPermissionIcon(role.permissions.userManagement)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-body-md">
                        Tax Entity Management
                      </span>
                      {getPermissionIcon(role.permissions.taxEntityManagement)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-body-md">
                        Transaction Classification
                      </span>
                      {getPermissionIcon(
                        role.permissions.transactionClassification,
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-body-md">Report Generation</span>
                      {getPermissionIcon(role.permissions.reportGeneration)}
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-body-md text-muted-foreground">
                      {role.users} users with this role
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Tax Entities */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Tax Entities</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tax Year</TableHead>
                  <TableHead>Wallets</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTaxEntities.map((entity, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Building className="size-4 text-info" />
                        <span className="font-medium">{entity.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{entity.client}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="border-0 bg-info-bg text-info-text"
                      >
                        {entity.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{entity.taxYear}</TableCell>
                    <TableCell>{entity.wallets}</TableCell>
                    <TableCell>{getStatusBadge(entity.status)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="size-8 p-0">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Client Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="client-name">Name</Label>
              <Input
                id="client-name"
                value={newClientName}
                onChange={(e) => {
                  setNewClientName(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="Enter client name"
              />
              {formError && (
                <p className="text-body-md text-red-600">{formError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={newClientType === "Firm" ? "default" : "outline"}
                  onClick={() => setNewClientType("Firm")}
                  className="h-9"
                >
                  Firm
                </Button>
                <Button
                  type="button"
                  variant={
                    newClientType === "Individual" ? "default" : "outline"
                  }
                  onClick={() => setNewClientType("Individual")}
                  className="h-9"
                >
                  Individual
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateClient}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected clients?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-body-md text-muted-foreground">
            This action cannot be undone.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Confirmation */}
      <AlertDialog open={exportOpen} onOpenChange={setExportOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export selected clients?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-body-md text-muted-foreground">
            A CSV will be generated for download.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExport}>
              Export
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
