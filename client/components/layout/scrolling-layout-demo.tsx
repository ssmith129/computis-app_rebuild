import React from "react";
import {
  ScrollableLayout,
  FixedHeader,
  FixedNavigation,
  ContentArea,
  ScrollableCards,
  ScrollableTable,
  EnhancedCard,
  ResponsiveGrid,
} from "./scrollable-layout";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Menu, Bell, User } from "lucide-react";

/**
 * Complete demonstration of the scrolling layout implementation
 * This component showcases all the key features:
 * 1. Main container prevents horizontal scrolling
 * 2. Fixed header and navigation
 * 3. Horizontally scrollable cards and tables
 * 4. Proper z-index management
 * 5. Responsive design
 */
export function ScrollingLayoutDemo() {
  const [navOpen, setNavOpen] = React.useState(true);

  return (
    <ScrollableLayout className="bg-gray-50">
      {/* Fixed Header */}
      <FixedHeader>
        <div className="flex items-center justify-between p-4">
          {/* Left side - Menu toggle and search */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNavOpen(!navOpen)}
              className="lg:hidden text-white hover:bg-white/10"
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 max-w-md w-full">
              <Search className="h-4 w-4 text-white/70 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-white placeholder:text-white/70 border-none outline-none flex-1"
              />
            </div>
          </div>

          {/* Right side - Notifications and user */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              aria-label="User profile"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </FixedHeader>

      {/* Fixed Navigation */}
      <FixedNavigation isOpen={navOpen}>
        <div className="p-4">
          <div className="text-white font-bold text-heading-lg mb-6">
            CryptoTax Pro
          </div>
          <nav className="space-y-2">
            {[
              "Dashboard",
              "Transactions",
              "Wallets",
              "Reports",
              "Settings",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </FixedNavigation>

      {/* Main Content Area */}
      <ContentArea
        hasHeader={true}
        hasNavigation={true}
        headerHeight="72px"
        className="pt-[72px]"
      >
        {/* Page Title */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-display-lg font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            View your portfolio metrics and recent activity
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-8">
          {/* Section 1: Horizontally Scrollable Cards */}
          <section>
            <h2 className="text-heading-lg font-semibold text-gray-900 mb-4">
              Portfolio Overview
            </h2>
            <ScrollableCards gap="1.5rem">
              {[
                {
                  title: "Total Portfolio",
                  value: "$127,456",
                  change: "+12.5%",
                },
                { title: "Realized Gains", value: "$45,234", change: "+8.3%" },
                {
                  title: "Unrealized Gains",
                  value: "$82,222",
                  change: "+15.7%",
                },
                { title: "Tax Liability", value: "$12,891", change: "-2.1%" },
                { title: "Cost Basis", value: "$85,234", change: "0%" },
                { title: "Transactions", value: "1,234", change: "+45" },
              ].map((metric, index) => (
                <EnhancedCard
                  key={index}
                  minWidth="280px"
                  className="flex-shrink-0"
                >
                  <CardHeader>
                    <CardTitle className="text-body-md font-medium text-gray-600">
                      {metric.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-display-lg font-bold font-mono tabular-nums text-gray-900 mb-1">
                      {metric.value}
                    </div>
                    <div
                      className={`text-body-md ${
                        metric.change.startsWith("+")
                          ? "text-success"
                          : metric.change.startsWith("-")
                            ? "text-error"
                            : "text-muted-foreground"
                      }`}
                    >
                      {metric.change} from last month
                    </div>
                  </CardContent>
                </EnhancedCard>
              ))}
            </ScrollableCards>
          </section>

          {/* Section 2: Responsive Grid (No horizontal scroll) */}
          <section>
            <h2 className="text-heading-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <ResponsiveGrid minCardWidth="250px" gap="1.5rem">
              {[
                {
                  title: "Import Transactions",
                  desc: "Upload CSV or connect exchanges",
                },
                {
                  title: "Generate Reports",
                  desc: "Create tax reports and forms",
                },
                {
                  title: "Review Transactions",
                  desc: "Verify and categorize trades",
                },
                {
                  title: "Export Data",
                  desc: "Download reports and summaries",
                },
              ].map((action, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-heading-md">
                      {action.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-md text-gray-600 mb-4">
                      {action.desc}
                    </p>
                    <Button className="w-full">Get Started</Button>
                  </CardContent>
                </Card>
              ))}
            </ResponsiveGrid>
          </section>

          {/* Section 3: Horizontally Scrollable Table */}
          <section>
            <h2 className="text-heading-lg font-semibold text-gray-900 mb-4">
              Recent Transactions
            </h2>
            <ScrollableTable>
              <Table scrollable={true} minWidth="800px">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="w-[120px]">Asset</TableHead>
                    <TableHead className="w-[120px]">Amount</TableHead>
                    <TableHead className="w-[120px]">Price</TableHead>
                    <TableHead className="w-[120px]">Value</TableHead>
                    <TableHead className="w-[120px]">Exchange</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }, (_, i) => (
                    <TableRow key={i}>
                      <TableCell>2024-01-{15 + i}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-caption">
                          Buy
                        </span>
                      </TableCell>
                      <TableCell>BTC</TableCell>
                      <TableCell>0.025</TableCell>
                      <TableCell>$45,230</TableCell>
                      <TableCell>$1,130.75</TableCell>
                      <TableCell>Coinbase</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-caption">
                          Complete
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollableTable>
          </section>

          {/* Section 4: Mixed Content */}
          <section>
            <h2 className="text-heading-lg font-semibold text-gray-900 mb-4">
              Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Chart card with horizontal scrolling content */}
              <EnhancedCard scrollable={true} minWidth="400px">
                <CardHeader>
                  <CardTitle>Price History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="flex gap-4 pb-4"
                    style={{ minWidth: "600px" }}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="text-caption text-gray-600">
                          {new Date(2024, i, 1).toLocaleDateString("en", {
                            month: "short",
                          })}
                        </div>
                        <div
                          className="bg-blue-500 w-8 rounded"
                          style={{ height: `${Math.random() * 100 + 20}px` }}
                        />
                        <div className="text-caption font-medium">
                          ${(Math.random() * 50000 + 20000).toFixed(0)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </EnhancedCard>

              {/* Right: Summary card (no scrolling) */}
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Trades</span>
                      <span className="font-medium">1,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Trade Size</span>
                      <span className="font-medium">$2,456</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-medium text-green-600">85.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Asset</span>
                      <span className="font-medium">ETH (+45%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </ContentArea>
    </ScrollableLayout>
  );
}
