import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { EnhancedDashboardCards } from "./enhanced-dashboard-cards";
import { RecentUploads } from "./recent-uploads";
import { EnhancedPieChartSections } from "./enhanced-pie-charts";
import { AnomalyFlags } from "./anomaly-flags";
import { TouchZoomContainer } from "@/components/ui/touch-zoom-container";
import { Shield, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardContent() {
  const [roleView, setRoleView] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (value: string) => {
    setIsLoading(true);
    setRoleView(value);
    // Simulate content loading
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <div className="app-content bg-muted">
      {/* Page Header */}
      <div className="page-titlebar">
        <div className="flex flex-col p-4 sm:p-6 text-left">
          <h1 className="text-heading-lg font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-body-md text-muted-foreground mt-1">
            View all your key metrics and data here
          </p>

          {/* Role View Selector — header segmented control (single tab row below) */}
          <div className="mt-4">
            <ToggleGroup
              type="single"
              value={roleView}
              onValueChange={(value) => value && handleRoleChange(value)}
              className="inline-flex h-11 items-center justify-start rounded-lg bg-muted p-1"
              aria-label="Dashboard role view"
            >
              <ToggleGroupItem
                value="admin"
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-sm"
                aria-label="Admin view - Full access to all dashboard features"
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="client"
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-sm"
                aria-label="Client view - Limited to client-accessible data"
              >
                <Users className="h-4 w-4" />
                <span>Client</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="cpa"
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-sm"
                aria-label="CPA view - Tax preparer tools and client management"
              >
                <Briefcase className="h-4 w-4" />
                <span>CPA</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* Main Content with Loading State */}
      <div
        className={`p-4 sm:p-6 space-y-4 sm:space-y-6 no-h-scroll transition-opacity duration-300 w-full max-w-full overflow-hidden ${isLoading ? "opacity-50" : "opacity-100"}`}
      >
        <Tabs value={roleView} className="w-full">
          {/* Admin View */}
          <TabsContent value="admin" className="mt-0 space-y-6">
            <RecentUploads />

            <div className="bg-white rounded-lg border border-border">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-border px-6">
                  <TabsList className="h-auto p-0 bg-transparent border-0">
                    <TabsTrigger
                      value="overview"
                      className="relative px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                    >
                      <span className="font-semibold text-sm text-foreground">
                        Overview
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="reports"
                      className="relative px-0 py-3 ml-5 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                    >
                      <span className="font-semibold text-sm text-muted-foreground">
                        Reports
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="portfolio"
                      className="relative px-0 py-3 ml-5 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                    >
                      <span className="font-semibold text-sm text-muted-foreground">
                        Portfolio
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent
                  value="overview"
                  className="p-4 sm:p-6 space-y-8 mt-0 no-h-scroll"
                >
                  <EnhancedDashboardCards />
                  <TouchZoomContainer className="rounded-lg">
                    <EnhancedPieChartSections />
                  </TouchZoomContainer>
                  <AnomalyFlags />
                </TabsContent>

                <TabsContent
                  value="reports"
                  className="p-6 mt-0 space-y-6 no-h-scroll"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-info-bg rounded-lg">
                          <svg
                            className="h-6 w-6 text-info"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            IRS Form 8949
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Capital gains and losses
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Forms Ready:
                          </span>
                          <span className="font-medium">3 of 3</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Last Updated:
                          </span>
                          <span className="font-medium">2 hours ago</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4">View Reports</Button>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-success-bg rounded-lg">
                          <svg
                            className="h-6 w-6 text-success"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Gain/Loss Analysis
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Detailed P&L breakdown
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Net Gain/Loss:
                          </span>
                          <span className="font-medium text-success">
                            +$127,456
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Tax Liability:
                          </span>
                          <span className="font-medium">$25,491</span>
                        </div>
                      </div>
                      <Button variant="success" className="w-full mt-4">
                        View Analysis
                      </Button>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-category-purple-bg rounded-lg">
                          <svg
                            className="h-6 w-6 text-category-purple"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Export Package
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Ready for filing
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Forms Included:
                          </span>
                          <span className="font-medium">8949, Schedule D</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            File Size:
                          </span>
                          <span className="font-medium">2.4 MB</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4">Download Package</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="p-6 mt-0 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Asset Allocation
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-chart-orange rounded-full"></div>
                            <span className="text-sm font-medium">
                              Bitcoin (BTC)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">45.2%</div>
                            <div className="text-xs text-muted-foreground">
                              $234,567
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-chart-blue rounded-full"></div>
                            <span className="text-sm font-medium">
                              Ethereum (ETH)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">32.1%</div>
                            <div className="text-xs text-muted-foreground">
                              $166,234
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-success rounded-full"></div>
                            <span className="text-sm font-medium">
                              Other Assets
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">22.7%</div>
                            <div className="text-xs text-muted-foreground">
                              $117,845
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Performance Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total Portfolio Value
                          </span>
                          <span className="text-lg font-bold text-foreground">
                            $518,646
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Unrealized Gain/Loss
                          </span>
                          <span className="text-lg font-bold text-success">
                            +$127,456 (32.4%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Realized Gain/Loss
                          </span>
                          <span className="text-lg font-bold text-info">
                            +$45,234 (11.8%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Cost Basis
                          </span>
                          <span className="text-lg font-bold text-foreground">
                            $391,190
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* Client View */}
          <TabsContent value="client" className="mt-0 space-y-6">
            <RecentUploads />

            <div className="bg-white rounded-lg border border-border">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-border px-6">
                  <TabsList className="h-auto p-0 bg-transparent border-0">
                    <TabsTrigger
                      value="overview"
                      className="relative px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                    >
                      <span className="font-semibold text-sm text-foreground">
                        Overview
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="portfolio"
                      className="relative px-0 py-3 ml-5 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                    >
                      <span className="font-semibold text-sm text-muted-foreground">
                        Portfolio
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent
                  value="overview"
                  className="p-4 sm:p-6 space-y-8 mt-0 no-h-scroll"
                >
                  <EnhancedDashboardCards />
                  <TouchZoomContainer className="rounded-lg">
                    <EnhancedPieChartSections />
                  </TouchZoomContainer>
                </TabsContent>

                <TabsContent value="portfolio" className="p-6 mt-0 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Asset Allocation
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-chart-orange rounded-full"></div>
                            <span className="text-sm font-medium">
                              Bitcoin (BTC)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">45.2%</div>
                            <div className="text-xs text-muted-foreground">
                              $234,567
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-chart-blue rounded-full"></div>
                            <span className="text-sm font-medium">
                              Ethereum (ETH)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">32.1%</div>
                            <div className="text-xs text-muted-foreground">
                              $166,234
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-success rounded-full"></div>
                            <span className="text-sm font-medium">
                              Other Assets
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">22.7%</div>
                            <div className="text-xs text-muted-foreground">
                              $117,845
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Performance Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total Portfolio Value
                          </span>
                          <span className="text-lg font-bold text-foreground">
                            $518,646
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Unrealized Gain/Loss
                          </span>
                          <span className="text-lg font-bold text-success">
                            +$127,456 (32.4%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Realized Gain/Loss
                          </span>
                          <span className="text-lg font-bold text-info">
                            +$45,234 (11.8%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Cost Basis
                          </span>
                          <span className="text-lg font-bold text-foreground">
                            $391,190
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* CPA View */}
          <TabsContent value="cpa" className="mt-0 space-y-6">
            <RecentUploads />

            <div className="bg-white rounded-lg border border-border">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-border px-6">
                  <TabsList className="h-auto p-0 bg-transparent border-0">
                    <TabsTrigger
                      value="overview"
                      className="relative px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                    >
                      <span className="font-semibold text-sm text-foreground">
                        Overview
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="reports"
                      className="relative px-0 py-3 ml-5 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                    >
                      <span className="font-semibold text-sm text-muted-foreground">
                        Reports
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="portfolio"
                      className="relative px-0 py-3 ml-5 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                    >
                      <span className="font-semibold text-sm text-muted-foreground">
                        Portfolio
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="clients"
                      className="relative px-0 py-3 ml-5 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                    >
                      <span className="font-semibold text-sm text-muted-foreground">
                        Client Management
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent
                  value="overview"
                  className="p-4 sm:p-6 space-y-8 mt-0 no-h-scroll"
                >
                  <EnhancedDashboardCards />
                  <TouchZoomContainer className="rounded-lg">
                    <EnhancedPieChartSections />
                  </TouchZoomContainer>
                  <AnomalyFlags />
                </TabsContent>

                <TabsContent
                  value="reports"
                  className="p-6 mt-0 space-y-6 no-h-scroll"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-info-bg rounded-lg">
                          <svg
                            className="h-6 w-6 text-info"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            IRS Form 8949
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Capital gains and losses
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Forms Ready:
                          </span>
                          <span className="font-medium">3 of 3</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Last Updated:
                          </span>
                          <span className="font-medium">2 hours ago</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4">View Reports</Button>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-success-bg rounded-lg">
                          <svg
                            className="h-6 w-6 text-success"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Gain/Loss Analysis
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Detailed P&L breakdown
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Net Gain/Loss:
                          </span>
                          <span className="font-medium text-success">
                            +$127,456
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Tax Liability:
                          </span>
                          <span className="font-medium">$25,491</span>
                        </div>
                      </div>
                      <Button variant="success" className="w-full mt-4">
                        View Analysis
                      </Button>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-category-purple-bg rounded-lg">
                          <svg
                            className="h-6 w-6 text-category-purple"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Export Package
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Ready for filing
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Forms Included:
                          </span>
                          <span className="font-medium">8949, Schedule D</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            File Size:
                          </span>
                          <span className="font-medium">2.4 MB</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4">Download Package</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="p-6 mt-0 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Asset Allocation
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-chart-orange rounded-full"></div>
                            <span className="text-sm font-medium">
                              Bitcoin (BTC)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">45.2%</div>
                            <div className="text-xs text-muted-foreground">
                              $234,567
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-chart-blue rounded-full"></div>
                            <span className="text-sm font-medium">
                              Ethereum (ETH)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">32.1%</div>
                            <div className="text-xs text-muted-foreground">
                              $166,234
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-success rounded-full"></div>
                            <span className="text-sm font-medium">
                              Other Assets
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">22.7%</div>
                            <div className="text-xs text-muted-foreground">
                              $117,845
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Performance Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total Portfolio Value
                          </span>
                          <span className="text-lg font-bold text-foreground">
                            $518,646
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Unrealized Gain/Loss
                          </span>
                          <span className="text-lg font-bold text-success">
                            +$127,456 (32.4%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Realized Gain/Loss
                          </span>
                          <span className="text-lg font-bold text-info">
                            +$45,234 (11.8%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Cost Basis
                          </span>
                          <span className="text-lg font-bold text-foreground">
                            $391,190
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="clients" className="p-6 mt-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-info-bg to-info-bg/80 p-6 rounded-lg border border-info/30">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-info-text">
                          Total Clients
                        </h4>
                        <Users className="h-4 w-4 text-info" />
                      </div>
                      <p className="text-2xl font-bold text-info-text">47</p>
                      <p className="text-xs text-info-text mt-1">
                        +3 this month
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-success-bg to-success-bg/80 p-6 rounded-lg border border-success/30">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-success-text">
                          Active Returns
                        </h4>
                        <svg
                          className="h-4 w-4 text-success"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-success-text">23</p>
                      <p className="text-xs text-success mt-1">In progress</p>
                    </div>

                    <div className="bg-gradient-to-br from-category-purple-bg to-category-purple-bg p-6 rounded-lg border border-category-purple">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-category-purple-fg">
                          Pending Review
                        </h4>
                        <svg
                          className="h-4 w-4 text-category-purple"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-category-purple-fg">
                        8
                      </p>
                      <p className="text-xs text-category-purple-fg mt-1">
                        Needs attention
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-warning-bg to-warning-bg p-6 rounded-lg border border-warning">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-warning-text">
                          Completed
                        </h4>
                        <svg
                          className="h-4 w-4 text-warning"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-warning-text">16</p>
                      <p className="text-xs text-warning-text mt-1">
                        This tax year
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Client Portfolio Overview
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-info-bg rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-info-text">
                              JD
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              John Doe
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Portfolio: $518,646
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 bg-warning-bg text-warning text-xs font-medium rounded">
                            In Review
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-success-bg rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-success-text">
                              AS
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              Alice Smith
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Portfolio: $1,234,890
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 bg-success-bg text-success text-xs font-medium rounded">
                            Complete
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-category-purple-bg rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-category-purple-fg">
                              BJ
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              Bob Johnson
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Portfolio: $789,234
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 bg-info-bg text-info-text text-xs font-medium rounded">
                            In Progress
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
