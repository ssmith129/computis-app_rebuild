import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  ScrollableCards,
  ScrollableTable,
  EnhancedCard,
  ResponsiveGrid,
} from "@/components/layout/scrollable-layout";
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
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  FileText,
  Download,
  Eye,
} from "lucide-react";

/**
 * Enhanced Dashboard that demonstrates the scrolling layout implementation
 * integrated with the existing dashboard structure
 */
export function EnhancedDashboard() {
  return (
    <DashboardLayout activeItem="Dashboard">
      {/* This content replaces the default DashboardContent */}
      <div className="app-content bg-gray-50">
        {/* Page Header - Fixed when scrolling */}
        <div className="page-titlebar">
          <div className="flex flex-col p-6 text-left">
            <h1 className="text-heading-lg font-bold text-foreground">
              Enhanced Dashboard
            </h1>
            <p className="text-body-md text-muted-foreground mt-1">
              Demonstrating horizontal scrolling layout with fixed header and
              navigation
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 space-y-8 no-h-scroll">
          {/* Section 1: Horizontally Scrollable Portfolio Cards */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-lg font-semibold text-gray-900">
                Portfolio Overview
              </h2>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>

            <ScrollableCards gap="1.5rem" className="pb-2">
              {[
                {
                  title: "Total Portfolio Value",
                  value: "$127,456.78",
                  change: "+12.5%",
                  trend: "up",
                  icon: DollarSign,
                  color: "blue",
                },
                {
                  title: "Realized Gains",
                  value: "$45,234.12",
                  change: "+8.3%",
                  trend: "up",
                  icon: TrendingUp,
                  color: "green",
                },
                {
                  title: "Unrealized Gains",
                  value: "$82,222.66",
                  change: "+15.7%",
                  trend: "up",
                  icon: TrendingUp,
                  color: "green",
                },
                {
                  title: "Tax Liability",
                  value: "$12,891.45",
                  change: "-2.1%",
                  trend: "down",
                  icon: TrendingDown,
                  color: "red",
                },
                {
                  title: "Cost Basis",
                  value: "$85,234.32",
                  change: "0%",
                  trend: "neutral",
                  icon: PieChart,
                  color: "gray",
                },
                {
                  title: "Total Transactions",
                  value: "1,234",
                  change: "+45 this month",
                  trend: "up",
                  icon: FileText,
                  color: "purple",
                },
                {
                  title: "Average Trade Size",
                  value: "$2,456.78",
                  change: "+5.2%",
                  trend: "up",
                  icon: DollarSign,
                  color: "blue",
                },
                {
                  title: "Success Rate",
                  value: "85.3%",
                  change: "+2.1%",
                  trend: "up",
                  icon: TrendingUp,
                  color: "green",
                },
              ].map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <EnhancedCard
                    key={index}
                    minWidth="280px"
                    className="flex-shrink-0 hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-body-md font-medium text-gray-600">
                          {metric.title}
                        </CardTitle>
                        <div
                          className={`p-2 rounded-lg ${
                            metric.color === "blue"
                              ? "bg-info-bg"
                              : metric.color === "green"
                                ? "bg-success-bg"
                                : metric.color === "red"
                                  ? "bg-error-bg"
                                  : metric.color === "purple"
                                    ? "bg-purple-100"
                                    : "bg-muted"
                          }`}
                        >
                          <IconComponent
                            className={`h-4 w-4 ${
                              metric.color === "blue"
                                ? "text-info"
                                : metric.color === "green"
                                  ? "text-success"
                                  : metric.color === "red"
                                    ? "text-error"
                                    : metric.color === "purple"
                                      ? "text-purple-600"
                                      : "text-muted-foreground"
                            }`}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-display-lg font-bold font-mono tabular-nums text-gray-900 mb-2">
                        {metric.value}
                      </div>
                      <div
                        className={`text-body-md flex items-center gap-1 ${
                          metric.trend === "up"
                            ? "text-success"
                            : metric.trend === "down"
                              ? "text-error"
                              : "text-muted-foreground"
                        }`}
                      >
                        {metric.trend === "up" && (
                          <TrendingUp className="h-3 w-3" />
                        )}
                        {metric.trend === "down" && (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{metric.change}</span>
                      </div>
                    </CardContent>
                  </EnhancedCard>
                );
              })}
            </ScrollableCards>
          </section>

          {/* Section 2: Responsive Grid for Quick Actions (No horizontal scroll) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>

            <ResponsiveGrid minCardWidth="250px" gap="1.5rem">
              {[
                {
                  title: "Import Transactions",
                  desc: "Upload CSV files or connect to exchanges",
                  action: "Import Now",
                  icon: Download,
                  color: "blue",
                },
                {
                  title: "Generate Reports",
                  desc: "Create comprehensive tax reports and forms",
                  action: "Generate",
                  icon: FileText,
                  color: "green",
                },
                {
                  title: "Review Transactions",
                  desc: "Verify and categorize your trading activity",
                  action: "Review",
                  icon: Eye,
                  color: "purple",
                },
                {
                  title: "Export Data",
                  desc: "Download reports and transaction summaries",
                  action: "Export",
                  icon: Download,
                  color: "orange",
                },
              ].map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow group"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg transition-colors group-hover:scale-110 ${
                            action.color === "blue"
                              ? "bg-info-bg group-hover:bg-info-bg/80"
                              : action.color === "green"
                                ? "bg-success-bg group-hover:bg-success-bg/80"
                                : action.color === "purple"
                                  ? "bg-purple-100 group-hover:bg-purple-200"
                                  : "bg-warning-bg group-hover:bg-warning-bg/80"
                          }`}
                        >
                          <IconComponent
                            className={`h-5 w-5 ${
                              action.color === "blue"
                                ? "text-info"
                                : action.color === "green"
                                  ? "text-success"
                                  : action.color === "purple"
                                    ? "text-purple-600"
                                    : "text-warning"
                            }`}
                          />
                        </div>
                        <CardTitle className="text-heading-md">
                          {action.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-body-md text-gray-600 mb-4">
                        {action.desc}
                      </p>
                      <Button
                        className="w-full"
                        variant={
                          action.color === "blue" ? "default" : "outline"
                        }
                      >
                        {action.action}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </ResponsiveGrid>
          </section>

          {/* Section 3: Horizontally Scrollable Transactions Table */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-lg font-semibold text-gray-900">
                Recent Transactions
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </div>

            <ScrollableTable>
              <Table scrollable={true} minWidth="1200px">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Date & Time</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="w-[120px]">Asset</TableHead>
                    <TableHead className="w-[140px]">Amount</TableHead>
                    <TableHead className="w-[140px]">Price (USD)</TableHead>
                    <TableHead className="w-[140px]">Total Value</TableHead>
                    <TableHead className="w-[120px]">Exchange</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[120px]">Gain/Loss</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 15 }, (_, i) => {
                    const types = [
                      "Buy",
                      "Sell",
                      "Transfer",
                      "Stake",
                      "Unstake",
                    ];
                    const assets = ["BTC", "ETH", "ADA", "SOL", "MATIC", "DOT"];
                    const exchanges = [
                      "Coinbase",
                      "Binance",
                      "Kraken",
                      "FTX",
                      "Gemini",
                    ];
                    const statuses = ["Complete", "Pending", "Failed"];

                    const type =
                      types[Math.floor(Math.random() * types.length)];
                    const asset =
                      assets[Math.floor(Math.random() * assets.length)];
                    const exchange =
                      exchanges[Math.floor(Math.random() * exchanges.length)];
                    const status =
                      statuses[Math.floor(Math.random() * statuses.length)];
                    const amount = (Math.random() * 10).toFixed(4);
                    const price = (Math.random() * 50000 + 1000).toFixed(2);
                    const value = (
                      parseFloat(amount) * parseFloat(price)
                    ).toFixed(2);
                    const gainLoss = (Math.random() - 0.5) * 1000;

                    return (
                      <TableRow key={i} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-caption">
                          2024-01-{String(15 + i).padStart(2, "0")}
                          <br />
                          <span className="text-gray-500">
                            14:
                            {String(Math.floor(Math.random() * 60)).padStart(
                              2,
                              "0",
                            )}
                            :00
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              type === "Buy"
                                ? "default"
                                : type === "Sell"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{asset}</TableCell>
                        <TableCell className="font-mono">{amount}</TableCell>
                        <TableCell className="font-mono">${price}</TableCell>
                        <TableCell className="font-mono font-semibold">
                          ${value}
                        </TableCell>
                        <TableCell>{exchange}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              status === "Complete"
                                ? "default"
                                : status === "Pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`font-mono font-semibold ${
                            gainLoss > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {gainLoss > 0 ? "+" : ""}${gainLoss.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollableTable>
          </section>

          {/* Section 4: Mixed Content - Charts with Horizontal Scrolling */}
          <section>
            <h2 className="text-heading-lg font-semibold text-gray-900 mb-4">
              Analytics & Insights
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Price History Chart with horizontal scrolling */}
              <EnhancedCard scrollable={true} minWidth="500px">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Portfolio Performance (12 Months)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="flex gap-4 pb-4"
                    style={{ minWidth: "800px" }}
                  >
                    {Array.from({ length: 12 }, (_, i) => {
                      const height = Math.random() * 120 + 40;
                      const value = Math.random() * 50000 + 20000;
                      const month = new Date(2023, i, 1).toLocaleDateString(
                        "en",
                        { month: "short" },
                      );

                      return (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-2 min-w-[60px]"
                        >
                          <div className="text-caption text-gray-600 font-medium">
                            {month}
                          </div>
                          <div
                            className={`w-8 rounded transition-colors hover:opacity-80 ${
                              i === 11 ? "bg-blue-500" : "bg-gray-300"
                            }`}
                            style={{ height: `${height}px` }}
                            title={`${month}: $${value.toFixed(0)}`}
                          />
                          <div className="text-caption font-medium text-center">
                            ${(value / 1000).toFixed(1)}k
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t pt-4 text-body-md text-gray-600">
                    Drag or scroll horizontally to view all months
                  </div>
                </CardContent>
              </EnhancedCard>

              {/* Right: Summary Stats (no scrolling) */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Total Trades",
                        value: "1,234",
                        subtext: "+45 this month",
                      },
                      {
                        label: "Avg Trade Size",
                        value: "$2,456",
                        subtext: "Median: $1,230",
                      },
                      {
                        label: "Success Rate",
                        value: "85.3%",
                        subtext: "Above average",
                      },
                      {
                        label: "Best Performing Asset",
                        value: "ETH",
                        subtext: "+127% YTD",
                      },
                      {
                        label: "Largest Gain",
                        value: "+$12,456",
                        subtext: "Single trade",
                      },
                      {
                        label: "Tax Efficiency",
                        value: "92%",
                        subtext: "Optimized",
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <div className="text-body-md text-gray-600">
                            {stat.label}
                          </div>
                          <div className="text-caption text-gray-400">
                            {stat.subtext}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-body-md font-semibold text-gray-900">
                            {stat.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
