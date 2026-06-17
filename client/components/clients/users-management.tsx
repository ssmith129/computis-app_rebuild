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
  ArrowUpDown,
  UserPlus,
  Mail,
  MoreHorizontal,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Clock,
  Shield,
  Eye,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: "Active" | "Inactive" | "Pending";
  department?: string;
  phone?: string;
  joinedDate: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@acme.com",
    role: "Administrator",
    lastLogin: "2 hours ago",
    status: "Active",
    department: "Finance",
    phone: "+1 (555) 123-4567",
    joinedDate: "Jan 15, 2023",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@acme.com",
    role: "Tax Preparer",
    lastLogin: "5 hours ago",
    status: "Active",
    department: "Tax",
    phone: "+1 (555) 234-5678",
    joinedDate: "Feb 20, 2023",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@acme.com",
    role: "Client User",
    lastLogin: "1 day ago",
    status: "Active",
    department: "Operations",
    phone: "+1 (555) 345-6789",
    joinedDate: "Mar 10, 2023",
  },
  {
    id: "4",
    name: "David Park",
    email: "david.park@acme.com",
    role: "Tax Preparer",
    lastLogin: "3 days ago",
    status: "Inactive",
    department: "Tax",
    phone: "+1 (555) 456-7890",
    joinedDate: "Apr 5, 2023",
  },
  {
    id: "5",
    name: "Jessica Williams",
    email: "jessica.williams@acme.com",
    role: "Client User",
    lastLogin: "Never",
    status: "Pending",
    department: "Compliance",
    phone: "+1 (555) 567-8901",
    joinedDate: "May 1, 2023",
  },
  {
    id: "6",
    name: "Robert Lee",
    email: "robert.lee@acme.com",
    role: "Administrator",
    lastLogin: "1 week ago",
    status: "Inactive",
    department: "IT",
    phone: "+1 (555) 678-9012",
    joinedDate: "Jun 12, 2023",
  },
  {
    id: "7",
    name: "Amanda Martinez",
    email: "amanda.martinez@acme.com",
    role: "Tax Preparer",
    lastLogin: "Never",
    status: "Pending",
    department: "Tax",
    phone: "+1 (555) 789-0123",
    joinedDate: "Jul 8, 2023",
  },
];

type SortField = "name" | "email" | "role" | "lastLogin" | "status";
type SortDirection = "asc" | "desc";

const getStatusBadge = (status: User["status"]) => {
  const variants = {
    Active: "bg-success-bg text-success-text border-0",
    Inactive: "bg-gray-100 text-gray-700 border-0",
    Pending: "bg-warning-bg text-warning-text border-0",
  };
  const icons = {
    Active: <UserCheck className="h-3 w-3 mr-1" />,
    Inactive: <UserX className="h-3 w-3 mr-1" />,
    Pending: <Clock className="h-3 w-3 mr-1" />,
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

const getRoleBadge = (role: string) => {
  const variants: Record<string, string> = {
    Administrator: "bg-info-bg text-info-text border-0",
    "Tax Preparer": "bg-purple-100 text-purple-700 border-0",
    "Client User": "bg-cyan-100 text-cyan-700 border-0",
  };
  return (
    <Badge className={variants[role] || "bg-gray-100 text-gray-700 border-0"}>
      {role}
    </Badge>
  );
};

export function UsersManagement() {
  const [userTab, setUserTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterRole, setFilterRole] = useState<string>("all");

  // Dialog states
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [viewUserOpen, setViewUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Client User");
  const [newUserDepartment, setNewUserDepartment] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = mockUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab =
        userTab === "active"
          ? user.status === "Active"
          : userTab === "inactive"
            ? user.status === "Inactive"
            : user.status === "Pending";
      const matchesRole = filterRole === "all" || user.role === filterRole;
      return matchesSearch && matchesTab && matchesRole;
    });

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      return aVal > bVal ? modifier : aVal < bVal ? -modifier : 0;
    });

    return filtered;
  }, [searchTerm, userTab, filterRole, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredAndSortedUsers.length
        ? []
        : filteredAndSortedUsers.map((u) => u.id),
    );
  };

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail) {
      toast({
        title: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "User invitation sent",
      description: `Invitation sent to ${newUserEmail}`,
    });
    setAddUserOpen(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Client User");
    setNewUserDepartment("");
    setNewUserPhone("");
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewUserOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  const activeCount = mockUsers.filter((u) => u.status === "Active").length;
  const inactiveCount = mockUsers.filter((u) => u.status === "Inactive").length;
  const pendingCount = mockUsers.filter((u) => u.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-success">
                  {activeCount}
                </p>
              </div>
              <div className="p-3 bg-success-bg rounded-lg">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Inactive Users
                </p>
                <p className="text-3xl font-bold text-gray-600">
                  {inactiveCount}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <UserX className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Approvals
                </p>
                <p className="text-3xl font-bold text-warning">
                  {pendingCount}
                </p>
              </div>
              <div className="p-3 bg-warning-bg rounded-lg">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for User Views */}
      <Tabs value={userTab} onValueChange={setUserTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">
              Active Users ({activeCount})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive Users ({inactiveCount})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending Approvals ({pendingCount})
            </TabsTrigger>
          </TabsList>
          <Button
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
            onClick={() => setAddUserOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="mt-6">
          <TabsContent value="active" className="space-y-4 mt-0">
            <UserTableSection
              users={filteredAndSortedUsers}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterRole={filterRole}
              setFilterRole={setFilterRole}
              selectedUsers={selectedUsers}
              handleSelectAll={handleSelectAll}
              handleSelectUser={handleSelectUser}
              handleSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              handleViewUser={handleViewUser}
              handleEditUser={handleEditUser}
            />
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4 mt-0">
            <UserTableSection
              users={filteredAndSortedUsers}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterRole={filterRole}
              setFilterRole={setFilterRole}
              selectedUsers={selectedUsers}
              handleSelectAll={handleSelectAll}
              handleSelectUser={handleSelectUser}
              handleSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              handleViewUser={handleViewUser}
              handleEditUser={handleEditUser}
            />
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-0">
            <UserTableSection
              users={filteredAndSortedUsers}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterRole={filterRole}
              setFilterRole={setFilterRole}
              selectedUsers={selectedUsers}
              handleSelectAll={handleSelectAll}
              handleSelectUser={handleSelectUser}
              handleSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              handleViewUser={handleViewUser}
              handleEditUser={handleEditUser}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Send an invitation to a new user. They will receive an email with
              setup instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUserRole} onValueChange={setNewUserRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                    <SelectItem value="Tax Preparer">Tax Preparer</SelectItem>
                    <SelectItem value="Client User">Client User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newUserDepartment}
                  onChange={(e) => setNewUserDepartment(e.target.value)}
                  placeholder="Finance"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={newUserPhone}
                onChange={(e) => setNewUserPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={viewUserOpen} onOpenChange={setViewUserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl">
                  {selectedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Role</Label>
                  <div>{getRoleBadge(selectedUser.role)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Status</Label>
                  <div>{getStatusBadge(selectedUser.status)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Department</Label>
                  <p className="font-medium">
                    {selectedUser.department || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedUser.phone || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Last Login</Label>
                  <p className="font-medium">{selectedUser.lastLogin}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Joined Date</Label>
                  <p className="font-medium">{selectedUser.joinedDate}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewUserOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setViewUserOpen(false);
                if (selectedUser) handleEditUser(selectedUser);
              }}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input id="edit-name" defaultValue={selectedUser.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    defaultValue={selectedUser.email}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrator">
                        Administrator
                      </SelectItem>
                      <SelectItem value="Tax Preparer">Tax Preparer</SelectItem>
                      <SelectItem value="Client User">Client User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedUser.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    defaultValue={selectedUser.department}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input id="edit-phone" defaultValue={selectedUser.phone} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({ title: "User updated successfully" });
                setEditUserOpen(false);
              }}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface UserTableSectionProps {
  users: User[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterRole: string;
  setFilterRole: (role: string) => void;
  selectedUsers: string[];
  handleSelectAll: () => void;
  handleSelectUser: (id: string) => void;
  handleSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  handleViewUser: (user: User) => void;
  handleEditUser: (user: User) => void;
}

function UserTableSection({
  users,
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  selectedUsers,
  handleSelectAll,
  handleSelectUser,
  handleSort,
  sortField,
  sortDirection,
  handleViewUser,
  handleEditUser,
}: UserTableSectionProps) {
  const SortIcon = ({ field }: { field: SortField }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 -ml-3"
      onClick={() => handleSort(field)}
    >
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  return (
    <>
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-select-default">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Administrator">Administrator</SelectItem>
              <SelectItem value="Tax Preparer">Tax Preparer</SelectItem>
              <SelectItem value="Client User">Client User</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => toast({ title: "Export started" })}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {selectedUsers.length > 0 && (
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
              <div className="text-sm font-medium">
                {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""}{" "}
                selected
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Bulk Edit
                </Button>
                <Button variant="destructive" size="sm">
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
                      selectedUsers.length === users.length && users.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Name
                    <SortIcon field="name" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Email
                    <SortIcon field="email" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Role
                    <SortIcon field="role" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Last Login
                    <SortIcon field="lastLogin" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Status
                    <SortIcon field="status" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.department}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
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
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-error">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
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
    </>
  );
}
