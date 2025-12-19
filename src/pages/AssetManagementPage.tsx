import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Monitor,
  Laptop,
  Server,
  Printer,
  Smartphone,
  HardDrive,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AssetType = "laptop" | "desktop" | "server" | "printer" | "phone" | "storage";
type AssetStatus = "active" | "maintenance" | "retired" | "available";

interface Asset {
  id: string;
  name: string;
  type: AssetType;
  serialNumber: string;
  assignedTo: string | null;
  department: string;
  purchaseDate: string;
  warrantyExpiry: string;
  status: AssetStatus;
  location: string;
  value: number;
}

const assetTypeIcons: Record<AssetType, React.ComponentType<{ className?: string }>> = {
  laptop: Laptop,
  desktop: Monitor,
  server: Server,
  printer: Printer,
  phone: Smartphone,
  storage: HardDrive,
};

const statusConfig: Record<AssetStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  active: { label: "Active", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  maintenance: { label: "Maintenance", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: AlertTriangle },
  retired: { label: "Retired", color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
  available: { label: "Available", color: "bg-primary/10 text-primary border-primary/20", icon: Package },
};

const initialAssets: Asset[] = [
  {
    id: "AST-001",
    name: "Dell Latitude 5520",
    type: "laptop",
    serialNumber: "DL5520-A1B2C3",
    assignedTo: "John Smith",
    department: "Engineering",
    purchaseDate: "2023-03-15",
    warrantyExpiry: "2026-03-15",
    status: "active",
    location: "Floor 2, Desk 24",
    value: 1200,
  },
  {
    id: "AST-002",
    name: "HP ProDesk 400",
    type: "desktop",
    serialNumber: "HP400-D4E5F6",
    assignedTo: "Jane Doe",
    department: "Finance",
    purchaseDate: "2022-08-20",
    warrantyExpiry: "2025-08-20",
    status: "active",
    location: "Floor 1, Desk 12",
    value: 800,
  },
  {
    id: "AST-003",
    name: "Dell PowerEdge R740",
    type: "server",
    serialNumber: "DPE740-G7H8I9",
    assignedTo: null,
    department: "IT",
    purchaseDate: "2021-01-10",
    warrantyExpiry: "2024-01-10",
    status: "maintenance",
    location: "Server Room A",
    value: 8500,
  },
  {
    id: "AST-004",
    name: "HP LaserJet Pro",
    type: "printer",
    serialNumber: "HPLJ-J1K2L3",
    assignedTo: null,
    department: "Shared",
    purchaseDate: "2023-06-01",
    warrantyExpiry: "2025-06-01",
    status: "active",
    location: "Floor 1, Print Area",
    value: 450,
  },
  {
    id: "AST-005",
    name: "iPhone 14 Pro",
    type: "phone",
    serialNumber: "IP14P-M4N5O6",
    assignedTo: "Mike Johnson",
    department: "Sales",
    purchaseDate: "2023-09-22",
    warrantyExpiry: "2025-09-22",
    status: "active",
    location: "Mobile",
    value: 999,
  },
  {
    id: "AST-006",
    name: "Synology DS920+",
    type: "storage",
    serialNumber: "SYN920-P7Q8R9",
    assignedTo: null,
    department: "IT",
    purchaseDate: "2022-04-15",
    warrantyExpiry: "2025-04-15",
    status: "active",
    location: "Server Room B",
    value: 1500,
  },
  {
    id: "AST-007",
    name: "MacBook Pro 16",
    type: "laptop",
    serialNumber: "MBP16-S1T2U3",
    assignedTo: null,
    department: "Design",
    purchaseDate: "2024-01-05",
    warrantyExpiry: "2027-01-05",
    status: "available",
    location: "IT Storage",
    value: 2499,
  },
  {
    id: "AST-008",
    name: "Dell OptiPlex 7090",
    type: "desktop",
    serialNumber: "DO7090-V4W5X6",
    assignedTo: "Sarah Wilson",
    department: "HR",
    purchaseDate: "2021-11-30",
    warrantyExpiry: "2024-11-30",
    status: "retired",
    location: "Storage",
    value: 750,
  },
];

export default function AssetManagementPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<AssetType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    type: "laptop",
    status: "available",
  });

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || asset.type === typeFilter;
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: assets.length,
    active: assets.filter((a) => a.status === "active").length,
    maintenance: assets.filter((a) => a.status === "maintenance").length,
    available: assets.filter((a) => a.status === "available").length,
    totalValue: assets.reduce((sum, a) => sum + a.value, 0),
  };

  const handleAddAsset = () => {
    if (!newAsset.name || !newAsset.serialNumber) {
      toast.error("Please fill in required fields");
      return;
    }

    const asset: Asset = {
      id: `AST-${String(assets.length + 1).padStart(3, "0")}`,
      name: newAsset.name || "",
      type: newAsset.type as AssetType,
      serialNumber: newAsset.serialNumber || "",
      assignedTo: newAsset.assignedTo || null,
      department: newAsset.department || "Unassigned",
      purchaseDate: newAsset.purchaseDate || new Date().toISOString().split("T")[0],
      warrantyExpiry: newAsset.warrantyExpiry || "",
      status: newAsset.status as AssetStatus,
      location: newAsset.location || "TBD",
      value: newAsset.value || 0,
    };

    setAssets([...assets, asset]);
    setNewAsset({ type: "laptop", status: "available" });
    setIsAddDialogOpen(false);
    toast.success("Asset added successfully");
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
    toast.success("Asset deleted successfully");
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Asset Management"
        description="Manage and track all company assets in one place"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.active}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.maintenance}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.available}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AssetType | "all")}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="laptop">Laptop</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="server">Server</SelectItem>
              <SelectItem value="printer">Printer</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="storage">Storage</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AssetStatus | "all")}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
              <DialogDescription>
                Enter the details of the new asset to add to inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Asset Name *</Label>
                  <Input
                    id="name"
                    placeholder="Dell Latitude 5520"
                    value={newAsset.name || ""}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newAsset.type}
                    onValueChange={(v) => setNewAsset({ ...newAsset, type: v as AssetType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="server">Server</SelectItem>
                      <SelectItem value="printer">Printer</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="storage">Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serial">Serial Number *</Label>
                  <Input
                    id="serial"
                    placeholder="ABC123XYZ"
                    value={newAsset.serialNumber || ""}
                    onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newAsset.status}
                    onValueChange={(v) => setNewAsset({ ...newAsset, status: v as AssetStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    placeholder="John Smith"
                    value={newAsset.assignedTo || ""}
                    onChange={(e) => setNewAsset({ ...newAsset, assignedTo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="Engineering"
                    value={newAsset.department || ""}
                    onChange={(e) => setNewAsset({ ...newAsset, department: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={newAsset.purchaseDate || ""}
                    onChange={(e) => setNewAsset({ ...newAsset, purchaseDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                  <Input
                    id="warrantyExpiry"
                    type="date"
                    value={newAsset.warrantyExpiry || ""}
                    onChange={(e) => setNewAsset({ ...newAsset, warrantyExpiry: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Floor 2, Desk 24"
                    value={newAsset.location || ""}
                    onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="1200"
                    value={newAsset.value || ""}
                    onChange={(e) => setNewAsset({ ...newAsset, value: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAsset}>Add Asset</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assets Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Asset</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => {
                const Icon = assetTypeIcons[asset.type];
                const status = statusConfig[asset.status];
                return (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">{asset.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{asset.serialNumber}</TableCell>
                    <TableCell>{asset.assignedTo || <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>{asset.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("border", status.color)}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>${asset.value.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewAsset(asset)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteAsset(asset.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredAssets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No assets found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Asset Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  {(() => {
                    const Icon = assetTypeIcons[selectedAsset.type];
                    return <Icon className="w-8 h-8 text-primary" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedAsset.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAsset.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Serial Number</p>
                  <p className="font-mono">{selectedAsset.serialNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant="outline" className={cn("border", statusConfig[selectedAsset.status].color)}>
                    {statusConfig[selectedAsset.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Assigned To</p>
                  <p>{selectedAsset.assignedTo || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p>{selectedAsset.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p>{selectedAsset.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Value</p>
                  <p>${selectedAsset.value.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Purchase Date</p>
                  <p>{selectedAsset.purchaseDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Warranty Expiry</p>
                  <p>{selectedAsset.warrantyExpiry}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
