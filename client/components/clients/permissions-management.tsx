import { useState, Fragment } from "react";
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
  Shield,
  MoreHorizontal,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  FileEdit,
  Users,
  UserPlus,
  History,
  Lock,
  Unlock,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: Record<string, boolean>;
  color: string;
  createdDate: string;
  lastModified: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  role: string;
  details: string;
}

const permissionCategories = {
  "Client Management": [
    {
      id: "clients.view",
      name: "View Clients",
      description: "View client information",
    },
    {
      id: "clients.create",
      name: "Create Clients",
      description: "Create new clients",
    },
    {
      id: "clients.edit",
      name: "Edit Clients",
      description: "Modify client details",
    },
    {
      id: "clients.delete",
      name: "Delete Clients",
      description: "Delete clients",
    },
  ],
  "User Management": [
    { id: "users.view", name: "View Users", description: "View user accounts" },
    { id: "users.create", name: "Create Users", description: "Add new users" },
    {
      id: "users.edit",
      name: "Edit Users",
      description: "Modify user accounts",
    },
    { id: "users.delete", name: "Delete Users", description: "Remove users" },
  ],
  "Tax Entities": [
    {
      id: "entities.view",
      name: "View Entities",
      description: "View tax entities",
    },
    {
      id: "entities.create",
      name: "Create Entities",
      description: "Create tax entities",
    },
    {
      id: "entities.edit",
      name: "Edit Entities",
      description: "Modify tax entities",
    },
    {
      id: "entities.delete",
      name: "Delete Entities",
      description: "Delete tax entities",
    },
  ],
  Transactions: [
    {
      id: "transactions.view",
      name: "View Transactions",
      description: "View transaction data",
    },
    {
      id: "transactions.classify",
      name: "Classify Transactions",
      description: "Classify transactions",
    },
    {
      id: "transactions.edit",
      name: "Edit Transactions",
      description: "Modify transaction data",
    },
    {
      id: "transactions.export",
      name: "Export Transactions",
      description: "Export transaction data",
    },
  ],
  Reports: [
    { id: "reports.view", name: "View Reports", description: "Access reports" },
    {
      id: "reports.generate",
      name: "Generate Reports",
      description: "Create new reports",
    },
    {
      id: "reports.export",
      name: "Export Reports",
      description: "Download reports",
    },
    {
      id: "reports.schedule",
      name: "Schedule Reports",
      description: "Set up automated reports",
    },
  ],
  Settings: [
    {
      id: "settings.view",
      name: "View Settings",
      description: "View system settings",
    },
    {
      id: "settings.edit",
      name: "Edit Settings",
      description: "Modify system configuration",
    },
    {
      id: "settings.permissions",
      name: "Manage Permissions",
      description: "Configure role permissions",
    },
  ],
};

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access with all permissions",
    userCount: 3,
    color: "blue",
    createdDate: "Jan 15, 2023",
    lastModified: "2 hours ago",
    permissions: Object.fromEntries(
      Object.values(permissionCategories)
        .flat()
        .map((p) => [p.id, true]),
    ),
  },
  {
    id: "2",
    name: "Tax Preparer",
    description: "Access to transaction classification and report generation",
    userCount: 6,
    color: "purple",
    createdDate: "Feb 1, 2023",
    lastModified: "1 day ago",
    permissions: {
      "clients.view": true,
      "clients.create": false,
      "clients.edit": true,
      "clients.delete": false,
      "users.view": true,
      "users.create": false,
      "users.edit": false,
      "users.delete": false,
      "entities.view": true,
      "entities.create": true,
      "entities.edit": true,
      "entities.delete": false,
      "transactions.view": true,
      "transactions.classify": true,
      "transactions.edit": true,
      "transactions.export": true,
      "reports.view": true,
      "reports.generate": true,
      "reports.export": true,
      "reports.schedule": false,
      "settings.view": true,
      "settings.edit": false,
      "settings.permissions": false,
    },
  },
  {
    id: "3",
    name: "Client User",
    description: "Limited access to view own data and basic reports",
    userCount: 21,
    color: "green",
    createdDate: "Mar 10, 2023",
    lastModified: "3 days ago",
    permissions: {
      "clients.view": true,
      "clients.create": false,
      "clients.edit": false,
      "clients.delete": false,
      "users.view": false,
      "users.create": false,
      "users.edit": false,
      "users.delete": false,
      "entities.view": true,
      "entities.create": false,
      "entities.edit": false,
      "entities.delete": false,
      "transactions.view": true,
      "transactions.classify": false,
      "transactions.edit": false,
      "transactions.export": false,
      "reports.view": true,
      "reports.generate": false,
      "reports.export": true,
      "reports.schedule": false,
      "settings.view": false,
      "settings.edit": false,
      "settings.permissions": false,
    },
  },
];

const mockAuditTrail: AuditEntry[] = [
  {
    id: "1",
    timestamp: "2 hours ago",
    user: "Sarah Johnson",
    action: "Updated Permissions",
    role: "Tax Preparer",
    details: "Added transaction export permission",
  },
  {
    id: "2",
    timestamp: "1 day ago",
    user: "Michael Chen",
    action: "Created Role",
    role: "Client Analyst",
    details: "Created new role with custom permissions",
  },
  {
    id: "3",
    timestamp: "3 days ago",
    user: "Sarah Johnson",
    action: "Assigned Role",
    role: "Tax Preparer",
    details: "Assigned role to Emily Rodriguez",
  },
  {
    id: "4",
    timestamp: "1 week ago",
    user: "David Park",
    action: "Removed Permission",
    role: "Client User",
    details: "Removed user deletion permission",
  },
];

const getPermissionIcon = (allowed: boolean) => {
  return allowed ? (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success-bg">
      <Check className="h-4 w-4 text-success" />
    </div>
  ) : (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-error-bg">
      <X className="h-4 w-4 text-error" />
    </div>
  );
};

const getRoleColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: "bg-info-bg text-info-text",
    purple: "bg-category-purple-bg text-category-purple-fg",
    green: "bg-success-bg text-success-text",
    orange: "bg-warning-bg text-warning-text",
  };
  return colors[color] || "bg-muted text-foreground";
};

export function PermissionsManagement() {
  const [activeTab, setActiveTab] = useState("roles");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [viewRoleOpen, setViewRoleOpen] = useState(false);
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form states
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRoleColor, setNewRoleColor] = useState("blue");
  const [newRolePermissions, setNewRolePermissions] = useState<
    Record<string, boolean>
  >({});

  // Bulk assignment states
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkAssignRole, setBulkAssignRole] = useState("");

  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    setViewRoleOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setNewRoleName(role.name);
    setNewRoleDescription(role.description);
    setNewRoleColor(role.color);
    setNewRolePermissions(role.permissions);
    setEditRoleOpen(true);
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      toast({ title: "Role name is required", variant: "destructive" });
      return;
    }
    toast({
      title: "Role created successfully",
      description: `${newRoleName} has been created`,
    });
    setCreateRoleOpen(false);
    setNewRoleName("");
    setNewRoleDescription("");
    setNewRoleColor("blue");
    setNewRolePermissions({});
  };

  const handleSaveEdit = () => {
    toast({ title: "Role updated successfully" });
    setEditRoleOpen(false);
  };

  const handleDeleteRole = () => {
    toast({ title: "Role deleted successfully" });
    setDeleteDialogOpen(false);
    setSelectedRole(null);
  };

  const handleBulkAssign = () => {
    if (!bulkAssignRole) {
      toast({ title: "Please select a role", variant: "destructive" });
      return;
    }
    toast({
      title: "Roles assigned",
      description: `${selectedUsers.length} users assigned to ${bulkAssignRole}`,
    });
    setAssignRoleOpen(false);
    setSelectedUsers([]);
    setBulkAssignRole("");
  };

  const togglePermission = (permissionId: string) => {
    setNewRolePermissions((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId],
    }));
  };

  const toggleCategoryPermissions = (category: string, enabled: boolean) => {
    const categoryPermissions =
      permissionCategories[category as keyof typeof permissionCategories];
    const updates = Object.fromEntries(
      categoryPermissions.map((p) => [p.id, enabled]),
    );
    setNewRolePermissions((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="matrix">Permissions Matrix</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAssignRoleOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Bulk Assign
            </Button>
            <Button
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
              onClick={() => setCreateRoleOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>
        </div>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockRoles.map((role) => (
              <Card
                key={role.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewRole(role)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-lg ${getRoleColor(role.color)}`}
                      >
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{role.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Users with this role
                    </span>
                    <Badge
                      className={getRoleColor(role.color)}
                      variant="secondary"
                    >
                      {role.userCount}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Permissions
                    </span>
                    <span className="font-semibold">
                      {Object.values(role.permissions).filter(Boolean).length} /{" "}
                      {Object.keys(role.permissions).length}
                    </span>
                  </div>
                  <div className="pt-2 border-t flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRole(role);
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewRole(role)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          View Users
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-error"
                          onClick={() => {
                            setSelectedRole(role);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permissions Matrix Tab */}
        <TabsContent value="matrix" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions Matrix</CardTitle>
              <p className="text-sm text-muted-foreground">
                View and compare permissions across all roles
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-64 sticky left-0 bg-background z-10">
                        Permission
                      </TableHead>
                      {mockRoles.map((role) => (
                        <TableHead key={role.id} className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{role.name}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(permissionCategories).map(
                      ([category, permissions]) => (
                        <Fragment key={category}>
                          <TableRow className="bg-muted/50">
                            <TableCell
                              colSpan={mockRoles.length + 1}
                              className="font-semibold sticky left-0 bg-muted/50"
                            >
                              {category}
                            </TableCell>
                          </TableRow>
                          {permissions.map((permission) => (
                            <TableRow key={permission.id}>
                              <TableCell className="sticky left-0 bg-background">
                                <div>
                                  <div className="font-medium">
                                    {permission.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {permission.description}
                                  </div>
                                </div>
                              </TableCell>
                              {mockRoles.map((role) => (
                                <TableCell
                                  key={role.id}
                                  className="text-center"
                                >
                                  {role.permissions[permission.id] ? (
                                    <div className="flex justify-center">
                                      <Check className="h-5 w-5 text-success" />
                                    </div>
                                  ) : (
                                    <div className="flex justify-center">
                                      <X className="h-5 w-5 text-error" />
                                    </div>
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </Fragment>
                      ),
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Permission Change History</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track all permission and role changes
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <History className="h-4 w-4 mr-2" />
                  Export History
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAuditTrail.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-muted-foreground">
                        {entry.timestamp}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-category-purple flex items-center justify-center text-white font-semibold text-xs">
                            {entry.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="font-medium">{entry.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{entry.action}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-category-purple-bg text-category-purple-fg border-0">
                          {entry.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {entry.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Role Dialog */}
      <Dialog open={viewRoleOpen} onOpenChange={setViewRoleOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Role Details</DialogTitle>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-lg ${getRoleColor(selectedRole.color)}`}
                >
                  <Shield className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedRole.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedRole.description}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Users</p>
                    <p className="text-2xl font-bold">
                      {selectedRole.userCount}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-lg font-medium">
                      {selectedRole.createdDate}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Last Modified
                    </p>
                    <p className="text-lg font-medium">
                      {selectedRole.lastModified}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Permissions</h4>
                {Object.entries(permissionCategories).map(
                  ([category, permissions]) => (
                    <div key={category} className="space-y-2">
                      <h5 className="font-medium text-sm text-muted-foreground">
                        {category}
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div>
                              <div className="font-medium text-sm">
                                {permission.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {permission.description}
                              </div>
                            </div>
                            {getPermissionIcon(
                              selectedRole.permissions[permission.id] || false,
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewRoleOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setViewRoleOpen(false);
                if (selectedRole) handleEditRole(selectedRole);
              }}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Role Dialog */}
      <Dialog
        open={createRoleOpen || editRoleOpen}
        onOpenChange={(open) => {
          setCreateRoleOpen(open);
          setEditRoleOpen(open);
          if (!open) {
            setNewRoleName("");
            setNewRoleDescription("");
            setNewRoleColor("blue");
            setNewRolePermissions({});
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editRoleOpen ? "Edit Role" : "Create New Role"}
            </DialogTitle>
            <DialogDescription>
              {editRoleOpen
                ? "Update role information and permissions"
                : "Define a new role with specific permissions"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">
                  Role Name <span className="text-error">*</span>
                </Label>
                <Input
                  id="role-name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g., Senior Analyst"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-color">Display Color</Label>
                <Select value={newRoleColor} onValueChange={setNewRoleColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Input
                id="role-description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Brief description of this role"
              />
            </div>
            <div className="space-y-4">
              <Label>Permissions</Label>
              {Object.entries(permissionCategories).map(
                ([category, permissions]) => {
                  const allEnabled = permissions.every(
                    (p) => newRolePermissions[p.id],
                  );
                  const someEnabled = permissions.some(
                    (p) => newRolePermissions[p.id],
                  );
                  return (
                    <Card key={category}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{category}</h4>
                          <div className="flex gap-2">
                            <Button
                              variant={allEnabled ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                toggleCategoryPermissions(category, true)
                              }
                            >
                              <Lock className="h-4 w-4 mr-1" />
                              Enable All
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                toggleCategoryPermissions(category, false)
                              }
                            >
                              <Unlock className="h-4 w-4 mr-1" />
                              Disable All
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Checkbox
                                checked={
                                  newRolePermissions[permission.id] || false
                                }
                                onCheckedChange={() =>
                                  togglePermission(permission.id)
                                }
                              />
                              <div>
                                <div className="font-medium text-sm">
                                  {permission.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {permission.description}
                                </div>
                              </div>
                            </div>
                            {newRolePermissions[permission.id] ? (
                              <Badge className="bg-success-bg text-success border-0">
                                <Check className="h-3 w-3 mr-1" />
                                Enabled
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-muted-foreground"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Disabled
                              </Badge>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                },
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateRoleOpen(false);
                setEditRoleOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editRoleOpen ? handleSaveEdit : handleCreateRole}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              {editRoleOpen ? "Save Changes" : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Assign Dialog */}
      <Dialog open={assignRoleOpen} onOpenChange={setAssignRoleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Assign Roles</DialogTitle>
            <DialogDescription>
              Assign roles to multiple users at once
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select value={bulkAssignRole} onValueChange={setBulkAssignRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role..." />
                </SelectTrigger>
                <SelectContent>
                  {mockRoles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {role.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Selected Users ({selectedUsers.length})</Label>
              <div className="border rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
                {selectedUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No users selected
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedUsers.map((userId) => (
                      <div
                        key={userId}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted"
                      >
                        <span className="text-sm">User {userId}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() =>
                            setSelectedUsers((prev) =>
                              prev.filter((id) => id !== userId),
                            )
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-info-bg border border-info/30">
              <AlertCircle className="h-5 w-5 text-info mt-0.5" />
              <div className="text-sm text-info-text">
                <p className="font-medium">Note:</p>
                <p>
                  Bulk role assignment will override existing roles for selected
                  users.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignRoleOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkAssign}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Roles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role "{selectedRole?.name}"?
              This action cannot be undone. Users with this role will need to be
              reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRole}
              className="bg-error hover:bg-error"
            >
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
