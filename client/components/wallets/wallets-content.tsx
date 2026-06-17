import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    color: "from-orange-500 to-amber-500",
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
    color: "from-blue-500 to-cyan-500",
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
    color: "from-yellow-500 to-orange-400",
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
    color: "from-slate-500 to-gray-600",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Connected":
      return <CheckCircle className="size-3.5 text-success" />;
    case "Syncing":
      return <Clock className="size-3.5 animate-pulse text-info" />;
    case "Error":
      return <AlertCircle className="size-3.5 text-error" />;
    default:
      return <Clock className="size-3.5 text-gray-500" />;
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
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

function WalletCard({ wallet }: { wallet: (typeof mockWallets)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden border border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => toast({ title: `Opening ${wallet.name}` })}
    >
      {/* Gradient Background Accent */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${wallet.color} transition-all duration-300 ${isHovered ? "h-2" : "h-1"}`}
      />

      <CardContent className="p-4">
        {/* Header Section */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="shrink-0 text-display-sm leading-none">
              {wallet.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-body-md font-semibold text-gray-900">
                {wallet.name}
              </h3>
              <p className="mt-0.5 truncate text-caption text-gray-500">
                <span>{wallet.type}</span>
                <span className="mx-1 text-gray-300">•</span>
                <span className="font-mono">{wallet.address}</span>
              </p>
            </div>
          </div>
          <div
            className={`flex shrink-0 items-center justify-center rounded-full border p-1.5 transition-all ${getStatusColor(wallet.status)}`}
            aria-label={wallet.status}
            title={wallet.status}
          >
            {getStatusIcon(wallet.status)}
            <span className="sr-only">{wallet.status}</span>
          </div>
        </div>

        {/* Stats Section - Progressive Disclosure */}
        <div
          className={`grid grid-cols-2 gap-2 overflow-hidden transition-all duration-300 ${isHovered ? "mb-3 max-h-24 opacity-100" : "mb-0 max-h-0 opacity-0"}`}
        >
          <div className="min-w-0 rounded-lg bg-gray-50 px-2.5 py-2">
            <p className="truncate text-caption text-gray-500">Transactions</p>
            <p className="truncate text-body-md font-semibold text-gray-900">
              {wallet.transactions}
            </p>
          </div>
          <div className="min-w-0 rounded-lg bg-gray-50 px-2.5 py-2">
            <p className="truncate text-caption text-gray-500">Last Sync</p>
            <p className="truncate text-body-md font-semibold text-gray-900">
              {wallet.lastSync}
            </p>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 min-w-0 truncate px-2 text-caption text-gray-600 transition-all hover:text-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              toast({ title: `Syncing ${wallet.name}` });
            }}
          >
            {wallet.status === "Syncing" ? "Cancel Sync" : "Sync Now"}
          </Button>
          <ChevronRight
            className={`size-4 shrink-0 text-gray-400 transition-all duration-300 ${isHovered ? "translate-x-1 text-gray-600" : ""}`}
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
            <p className="mt-1 text-body-md text-muted-foreground">
              Connect and manage your crypto wallets and exchange accounts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link to="/wallet-ingestion">
                <Plus className="mr-2 size-4" />
                Add Wallet
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/wallet-ingestion">
                <Plus className="mr-2 size-4" />
                Add Exchange
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="font-mono text-display-lg font-bold tabular-nums text-gray-900">
                4
              </div>
              <p className="text-body-md text-gray-500">Connected Sources</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="font-mono text-display-lg font-bold tabular-nums text-gray-900">
                521
              </div>
              <p className="text-body-md text-gray-500">Total Transactions</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="font-mono text-display-lg font-bold tabular-nums text-gray-900">
                3
              </div>
              <p className="text-body-md text-gray-500">Active Syncing</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="font-mono text-display-lg font-bold tabular-nums text-gray-900">
                1h
              </div>
              <p className="text-body-md text-gray-500">Last Sync</p>
            </CardContent>
          </Card>
        </div>

        {/* Wallets and Exchanges Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockWallets.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} />
          ))}

          {/* Add New Card */}
          <Link to="/wallet-ingestion" className="group">
            <Card className="h-full border-2 border-dashed border-gray-300 bg-gray-50/50 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md">
              <CardContent className="flex h-full min-h-[140px] flex-col items-center justify-center p-6 text-center">
                <div className="mb-3 rounded-full bg-white p-3 shadow-sm transition-shadow group-hover:shadow">
                  <Plus className="size-5 text-gray-600 transition-colors group-hover:text-gray-900" />
                </div>
                <h3 className="mb-1 text-body-md font-semibold text-gray-900">
                  Add New Connection
                </h3>
                <p className="mb-3 text-caption text-gray-500">
                  Connect wallet or exchange
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 border-gray-300 text-caption hover:border-gray-400"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <h3 className="mb-4 text-heading-md font-semibold text-gray-900">
              Recent Sync Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 py-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-success-bg p-1.5">
                    <CheckCircle className="size-3.5 text-success" />
                  </div>
                  <div>
                    <p className="text-body-md font-medium text-gray-900">
                      Coinbase Pro sync completed
                    </p>
                    <p className="text-caption text-gray-500">
                      15 new transactions imported
                    </p>
                  </div>
                </div>
                <span className="text-caption text-gray-400">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 py-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-info-bg p-1.5">
                    <Clock className="size-3.5 animate-pulse text-blue-600" />
                  </div>
                  <div>
                    <p className="text-body-md font-medium text-gray-900">
                      Binance sync in progress
                    </p>
                    <p className="text-caption text-gray-500">
                      Fetching recent transactions...
                    </p>
                  </div>
                </div>
                <span className="text-caption text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-success-bg p-1.5">
                    <CheckCircle className="size-3.5 text-success" />
                  </div>
                  <div>
                    <p className="text-body-md font-medium text-gray-900">
                      MetaMask wallet connected
                    </p>
                    <p className="text-caption text-gray-500">
                      42 transactions imported
                    </p>
                  </div>
                </div>
                <span className="text-caption text-gray-400">3 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
