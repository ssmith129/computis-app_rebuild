import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const mockWallets = [
  {
    id: "1",
    name: "MetaMask Wallet",
    type: "Wallet",
    address: "0x742d...4b82",
    status: "Connected",
    transactions: 156,
    lastSync: "2 hours ago",
    icon: "🦊",
    color: "from-chart-orange to-warning",
  },
  {
    id: "2",
    name: "Coinbase Pro",
    type: "Exchange",
    address: "coinbase-pro",
    status: "Connected",
    transactions: 89,
    lastSync: "1 hour ago",
    icon: "🔷",
    color: "from-primary to-cyan-500",
  },
  {
    id: "3",
    name: "Binance",
    type: "Exchange",
    address: "binance-main",
    status: "Syncing",
    transactions: 234,
    lastSync: "Syncing...",
    icon: "🟡",
    color: "from-warning to-chart-orange",
  },
  {
    id: "4",
    name: "Hardware Wallet",
    type: "Wallet",
    address: "bc1q...7x8k",
    status: "Connected",
    transactions: 42,
    lastSync: "3 hours ago",
    icon: "🔒",
    color: "from-muted-foreground to-muted-foreground",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Connected":
      return <CheckCircle className="h-3.5 w-3.5 text-success" />;
    case "Syncing":
      return <Clock className="h-3.5 w-3.5 text-info animate-pulse" />;
    case "Error":
      return <AlertCircle className="h-3.5 w-3.5 text-error" />;
    default:
      return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Connected":
      return "text-success bg-success-bg border-success/30";
    case "Syncing":
      return "text-info bg-info-bg border-info/30";
    case "Error":
      return "text-error bg-error-bg border-error/30";
    default:
      return "text-muted-foreground bg-muted border-border";
  }
};

function WalletCard({ wallet }: { wallet: (typeof mockWallets)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer border border-border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => toast({ title: `Opening ${wallet.name}` })}
    >
      {/* Gradient Background Accent */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${wallet.color} transition-all duration-300 ${isHovered ? "h-2" : "h-1"}`}
      />

      <CardContent className="p-4">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="text-xl leading-none flex-shrink-0">
              {wallet.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {wallet.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                <span>{wallet.type}</span>
                <span className="text-muted-foreground mx-1">•</span>
                <span className="font-mono">{wallet.address}</span>
              </p>
            </div>
          </div>
          <div
            className={`flex items-center justify-center p-1.5 rounded-full border transition-all flex-shrink-0 ${getStatusColor(wallet.status)}`}
            aria-label={wallet.status}
            title={wallet.status}
          >
            {getStatusIcon(wallet.status)}
            <span className="sr-only">{wallet.status}</span>
          </div>
        </div>

        {/* Stats Section - Progressive Disclosure */}
        <div
          className={`grid grid-cols-2 gap-2 overflow-hidden transition-all duration-300 ${isHovered ? "max-h-24 opacity-100 mb-3" : "max-h-0 opacity-0 mb-0"}`}
        >
          <div className="bg-muted rounded-lg px-2.5 py-2 min-w-0">
            <p className="text-xs text-muted-foreground truncate">
              Transactions
            </p>
            <p className="text-sm font-semibold text-foreground truncate">
              {wallet.transactions}
            </p>
          </div>
          <div className="bg-muted rounded-lg px-2.5 py-2 min-w-0">
            <p className="text-xs text-muted-foreground truncate">Last Sync</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {wallet.lastSync}
            </p>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-foreground px-2 transition-all min-w-0 truncate"
            onClick={(e) => {
              e.stopPropagation();
              toast({ title: `Syncing ${wallet.name}` });
            }}
          >
            {wallet.status === "Syncing" ? "Cancel Sync" : "Sync Now"}
          </Button>
          <ChevronRight
            className={`h-4 w-4 text-muted-foreground transition-all duration-300 flex-shrink-0 ${isHovered ? "translate-x-1 text-muted-foreground" : ""}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function WalletsContent() {
  return (
    <div className="app-content">
      <div className="page-titlebar">
        <div className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <h1 className="text-heading-lg font-bold text-foreground">
              Wallets and Exchanges
            </h1>
            <p className="text-body-md text-muted-foreground mt-1">
              Connect and manage your crypto wallets and exchange accounts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link to="/wallet-ingestion">
                <Plus className="h-4 w-4 mr-2" />
                Add Wallet
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/wallet-ingestion">
                <Plus className="h-4 w-4 mr-2" />
                Add Exchange
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="text-2xl font-bold font-mono tabular-nums text-foreground">
                4
              </div>
              <p className="text-sm text-muted-foreground">Connected Sources</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="text-2xl font-bold font-mono tabular-nums text-foreground">
                521
              </div>
              <p className="text-sm text-muted-foreground">
                Total Transactions
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="text-2xl font-bold font-mono tabular-nums text-foreground">
                3
              </div>
              <p className="text-sm text-muted-foreground">Active Syncing</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="text-2xl font-bold font-mono tabular-nums text-foreground">
                1h
              </div>
              <p className="text-sm text-muted-foreground">Last Sync</p>
            </CardContent>
          </Card>
        </div>

        {/* Wallets and Exchanges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockWallets.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} />
          ))}

          {/* Add New Card */}
          <Link to="/wallet-ingestion" className="group">
            <Card className="h-full border-2 border-dashed border-border hover:border-border transition-all duration-300 hover:shadow-md bg-muted/50 hover:bg-muted">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[140px]">
                <div className="bg-white rounded-full p-3 mb-3 shadow-sm group-hover:shadow transition-shadow">
                  <Plus className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  Add New Connection
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Connect wallet or exchange
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-border hover:border-border"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card className="border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-base text-foreground mb-4">
              Recent Sync Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-success-bg rounded-full p-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Coinbase Pro sync completed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      15 new transactions imported
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  1 hour ago
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-info-bg rounded-full p-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Binance sync in progress
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Fetching recent transactions...
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  2 hours ago
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="bg-success-bg rounded-full p-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      MetaMask wallet connected
                    </p>
                    <p className="text-xs text-muted-foreground">
                      42 transactions imported
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  3 hours ago
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
