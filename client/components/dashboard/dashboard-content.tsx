import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="app-content bg-gray-50">
      {/* Page Header */}
      <div className="page-titlebar">
        <div className="flex flex-col p-4 text-left sm:p-6">
          <h1 className="text-heading-lg font-bold text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-body-md text-muted-foreground">
            View all your key metrics and data here
          </p>

          {/* Role View Selector */}
          <div className="mt-4">
            <Tabs
              value={roleView}
              onValueChange={handleRoleChange}
              className="w-full"
            >
              <TabsList className="inline-flex h-11 items-center justify-start rounded-lg bg-gray-100 p-1">
                <TabsTrigger
                  value="admin"
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-body-md font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  aria-label="Admin view - Full access to all dashboard features"
                >
                  <Shield className="size-4" />
                  <span>Admin</span>
                </TabsTrigger>
                <TabsTrigger
                  value="client"
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-body-md font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  aria-label="Client view - Limited to client-accessible data"
                >
                  <Users className="size-4" />
                  <span>Client</span>
                </TabsTrigger>
                <TabsTrigger
                  value="cpa"
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-body-md font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  aria-label="CPA view - Tax preparer tools and client management"
                >
                  <Briefcase className="size-4" />
                  <span>CPA</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main Content with Loading State */}
      <div
        className={`no-h-scroll w-full max-w-full space-y-4 overflow-hidden p-4 transition-opacity duration-300 sm:space-y-6 sm:p-6 ${isLoading ? "opacity-50" : "opacity-100"}`}
      >
        <Tabs value={roleView} className="w-full">
          {/* Admin View */}
          <TabsContent value="admin" className="mt-0 space-y-6">
            <RecentUploads />

            <div className="rounded-lg border border-gray-200 bg-white">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-gray-200 px-6">
                  <TabsList className="h-auto border-0 bg-transparent p-0">
                    <TabsTrigger
                      value="overview"
                      className="relative rounded-none border-b-2 border-transparent px-0 py-3 data-[state=active]:border-yellow-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <span className="text-body-md font-semibold text-gray-900">
                        Overview
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="reports"
                      className="relative ml-5 rounded-none border-b-2 border-transparent px-0 py-3 data-[state=active]:border-yellow-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <span className="text-body-md font-semibold text-gray-500">
                        Reports
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="portfolio"
                      className="relative ml-5 rounded-none border-b-2 border-transparent px-0 py-3 data-[state=active]:border-yellow-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <span className="text-body-md font-semibold text-gray-500">
                        Portfolio
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent
                  value="overview"
                  className="no-h-scroll mt-0 space-y-8 p-4 sm:p-6"
                >
                  <EnhancedDashboardCards />
                  <TouchZoomContainer className="rounded-lg">
                    <EnhancedPieChartSections />
                  </TouchZoomContainer>
                  <AnomalyFlags />
                </TabsContent>

                <TabsContent
                  value="reports"
                  className="no-h-scroll mt-0 space-y-6 p-6"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-info-bg p-2">
                          <svg
                            className="size-6 text-info"
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
                          <h3 className="font-semibold text-gray-900">
                            IRS Form 8949
                          </h3>
                          <p className="text-body-md text-gray-500">
                            Capital gains and losses
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-body-md">
                          <span className="text-gray-600">Forms Ready:</span>
                          <span className="font-medium">3 of 3</span>
                        </div>
                        <div className="flex justify-between text-body-md">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="font-medium">2 hours ago</span>
                        </div>
                      </div>
                      <Button className="mt-4 w-full">View Reports</Button>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-success-bg p-2">
                          <svg
                            className="size-6 text-success"
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
                          <h3 className="font-semibold text-gray-900">
                            Gain/Loss Analysis
                          </h3>
                          <p className="text-body-md text-gray-500">
                            Detailed P&L breakdown
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-body-md">
                          <span className="text-gray-600">Net Gain/Loss:</span>
                          <span className="font-medium text-success">
                            +$127,456
                          </span>
                        </div>
                        <div className="flex justify-between text-body-md">
                          <span className="text-gray-600">Tax Liability:</span>
                          <span className="font-medium">$25,491</span>
                        </div>
                      </div>
                      <Button variant="success" className="mt-4 w-full">
                        View Analysis
                      </Button>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-purple-100 p-2">
                          <svg
                            className="size-6 text-purple-600"
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
                          <h3 className="font-semibold text-gray-900">
                            Export Package
                          </h3>
                          <p className="text-body-md text-gray-500">
                            Ready for filing
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-body-md">
                          <span className="text-gray-600">Forms Included:</span>
                          <span className="font-medium">8949, Schedule D</span>
                        </div>
                        <div className="flex justify-between text-body-md">
                          <span className="text-gray-600">File Size:</span>
                          <span className="font-medium">2.4 MB</span>
                        </div>
                      </div>
                      <Button className="mt-4 w-full">Download Package</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="mt-0 space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h3 className="mb-4 text-heading-lg font-semibold text-gray-900">
                        Asset Allocation
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-4 rounded-full bg-orange-500"></div>
                            <span className="text-body-md font-medium">
                              Bitcoin (BTC)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-body-md font-semibold">
                              45.2%
                            </div>
                            <div className="text-caption text-gray-500">
                              $234,567
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-4 rounded-full bg-blue-500"></div>
                            <span className="text-body-md font-medium">
                              Ethereum (ETH)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-body-md font-semibold">
                              32.1%
                            </div>
                            <div className="text-caption text-gray-500">
                              $166,234
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-4 rounded-full bg-green-500"></div>
                            <span className="text-body-md font-medium">
                              Other Assets
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-body-md font-semibold">
                              22.7%
                            </div>
                            <div className="text-caption text-gray-500">
                              $117,845
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h3 className="mb-4 text-heading-lg font-semibold text-gray-900">
                        Performance Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-body-md text-gray-600">
                            Total Portfolio Value
                          </span>
                          <span className="text-heading-lg font-bold text-gray-900">
                            $518,646
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body-md text-gray-600">
                            Unrealized Gain/Loss
                          </span>
                          <span className="text-heading-lg font-bold text-success">
                            +$127,456 (32.4%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body-md text-gray-600">
                            Realized Gain/Loss
                          </span>
                          <span className="text-heading-lg font-bold text-info">
                            +$45,234 (11.8%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body-md text-gray-600">
                            Cost Basis
                          </span>
                          <span className="text-heading-lg font-bold text-gray-900">
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

            <div className="rounded-lg border border-gray-200 bg-white">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-gray-200 px-6">
                  <TabsList className="h-auto border-0 bg-transparent p-0">
                    <TabsTrigger
                      value="overview"
                      className="relative rounded-none border-b-2 border-transparent px-0 py-3 data-[state=active]:border-yellow-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <span className="text-body-md font-semibold text-gray-900">
                        Overview
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="portfolio"
                      className="relative ml-5 rounded-none border-b-2 border-transparent px-0 py-3 data-[state=active]:border-yellow-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <span className="text-body-md font-semibold text-gray-500">
                        Portfolio
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent
                  value="overview"
                  className="no-h-scroll mt-0 space-y-8 p-4 sm:p-6"
                >
                  <EnhancedDashboardCards />
                  <TouchZoomContainer className="rounded-lg">
                    <EnhancedPieChartSections />
                  </TouchZoomContainer>
                </TabsContent>

                <TabsContent value="portfolio" className="mt-0 space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h3 className="mb-4 text-heading-lg font-semibold text-gray-900">
                        Asset Allocation
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-4 rounded-full bg-orange-500"></div>
                            <span className="text-body-md font-medium">
                              Bitcoin (BTC)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-body-md font-semibold">
                              45.2%
                            </div>
                            <div className="text-caption text-gray-500">
                              $234,567
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-4 rounded-full bg-blue-500"></div>
                            <span className="text-body-md font-medium">
                              Ethereum (ETH)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-body-md font-semibold">
                              32.1%
                            </div>
                            <div className="text-caption text-gray-500">
                              $166,234
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-4 rounded-full bg-green-500"></div>
                            <span className="text-body-md font-medium">
                              Other Assets
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-body-md font-semibold">
                              22.7%
                            </div>
                            <div className="text-caption text-gray-500">
                              $117,845
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h3 className="mb-4 text-heading-lg font-semibold text-gray-900">
                        Performance Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-body-md text-gray-600">
                            Total Portfolio Value
                          </span>
                          <span className="text-heading-lg font-bold text-gray-900">
                            $518,646
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body-md text-gray-600">
                            Unrealized Gain/Loss
                          </span>
                          <span className="text-heading-lg font-bold text-success">
                            +$127,456 (32.4%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body-md text-gray-600">
                            Realized Gain/Loss
                          </span>
                          <span className="text-heading-lg font-bold text-info">
                            +$45,234 (11.8%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body-md text-gray-600">
                            Cost Basis
                          </span>
                          <span className="text-heading-lg font-bold text-gray-900">
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

            <div className="rounded-lg border border-gray-200 bg-white">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-gray-200 px-6">
                  <TabsList className="h-auto border-0 bg-transparent p-0">
                    <TabsTrigger
                      value="overview"
                      className="relative rounded-none border-b-2 border-transparent px-0 py-3 data-[state=active]:border-yellow-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <span className="text-body-md font-semibold text-gray-900">
                        Overview
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="reports"
                      className="relative ml-5 rounded-none border-b-2 border-transparent px-0 py-3 data-[state=active]:border-yellow-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <span className="text-body-md font-semibold text-gray-500">
                        Reports
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="portfolio"
                      className="relative ml-5 rounded-none border-b-2 border-transparent px-0 py-3 data-[state=active]:border-yellow-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <span className="text-body-md font-semibold text-gray-500">
                        Portfolio
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="clients"
                      className="relative ml-5 rounded-none border-b-2 border-transparent px-0 py-3 data-[state=active]:border-yellow-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <span className="text-body-md font-semibold text-gray-500">
                        Client Management
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent
                  value="overview"
                  className="no-h-scroll mt-0 space-y-8 p-4 sm:p-6"
                >
                  <EnhancedDashboardCards />
                  <TouchZoomContainer className="rounded-lg">
                    <EnhancedPieChartSections />
                  </TouchZoomContainer>
                  <AnomalyFlags />
                </TabsContent>

                <TabsContent
                  value="reports"
                  className="no-h-scroll mt-0 space-y-6 p-6"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-info-bg p-2">
                          <svg
                            className="size-6 text-info"
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
                          <h3 className="font-semibold text-gray-900">
                            IRS Form 8949
                          </h3>
                          <p className="text-body-md text-gray-500">
                            Capital gains and losses
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-body-md">
                          <span className="text-gray-600">Forms Ready:</span>
                          <span className="font-medium">3 of 3</span>
                        </div>
                        <div className="flex justify-between text-body-md">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="font-medium">2 hours ago</span>
                        </div>
                      </div>
                      <Button className="mt-4 w-full">View Reports</Button>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-success-bg p-2">
                          <svg
                            className="size-6 text-success"
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
                          <h3 className="font-semibold text-gray-900">
                            Gain/Loss Analysis
                          </h3>
                          <p className="text-body-md text-gray-500">
                            Detailed P&L breakdown
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-body-md">
                          <span className="text-gray-600">Net Gain/Loss:</span>
                          <span className="font-medium text-success">
                            +$127,456
                          </span>
                        </div>
                        <div className="flex justify-between text-body-md">
                          <span className="text-gray-600">Tax Liability:</span>
                          <span className="font-medium">$25,491</span>
                        </div>
                      </div>
                      <Button variant="success" className="mt-4 w-full">
                        View Analysis
                      </Button>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-purple-100 p-2">
                          <svg
                            className="size-6 text-purple-600"
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
                          <h3 className="font-semibold text-gray-900">
                            Export Package
                          </h3>
                          <p className="text-body-md text-gray-500">
                            Ready for filing
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-body-md">
                          <span className="text-gray-600">Forms Included:</span>
                          <span className="font-medium">8949, Schedule D</span>
                        </div>
                        <div className="flex justify-between text-body-md">
                          <span className="text-gray-600">File Size:</span>
                          <span className="font-medium">2.4 MB</span>
                        </div>
                      </div>
                      <Button className="mt-4 w-full">Download Package</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="mt-0 space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h3 className="mb-4 text-heading-lg font-semibold text-gray-900">
                        Asset Allocation
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-4 rounded-full bg-orange-500"></div>
                            <span className="text-body-md font-medium">
                              Bitcoin (BTC)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-body-md font-semibold">
                              45.2%
                            </div>
                            <div className="text-caption text-gray-500">
                              $234,567
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-4 rounded-full bg-blue-500"></div>
                            <span className="text-body-md font-medium">
                              Ethereum (ETH)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-body-md font-semibold">
                              32.1%
                            </div>
                            <div className="text-caption text-gray-500">
                              $166,234
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-4 rounded-full bg-green-500"></div>
                            <span className="text-body-md font-medium">
                              Other Assets
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-body-md font-semibold">
                              22.7%
                            </div>
                            <div className="text-caption text-gray-500">
                              $117,845
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h3 className="mb-4 text-heading-lg font-semibold text-gray-900">
                        Performance Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-body-md text-gray-600">
                            Total Portfolio Value
                          </span>
                          <span className="text-heading-lg font-bold text-gray-900">
                            $518,646
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body-md text-gray-600">
                            Unrealized Gain/Loss
                          </span>
                          <span className="text-heading-lg font-bold text-success">
                            +$127,456 (32.4%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body-md text-gray-600">
                            Realized Gain/Loss
                          </span>
                          <span className="text-heading-lg font-bold text-info">
                            +$45,234 (11.8%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body-md text-gray-600">
                            Cost Basis
                          </span>
                          <span className="text-heading-lg font-bold text-gray-900">
                            $391,190
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="clients" className="mt-0 space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-info/30 bg-gradient-to-br from-info-bg to-info-bg/80 p-6">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-body-md font-medium text-info-text">
                          Total Clients
                        </h4>
                        <Users className="size-4 text-info" />
                      </div>
                      <p className="text-display-lg font-bold text-info-text">
                        47
                      </p>
                      <p className="mt-1 text-caption text-info-text">
                        +3 this month
                      </p>
                    </div>

                    <div className="rounded-lg border border-success/30 bg-gradient-to-br from-success-bg to-success-bg/80 p-6">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-body-md font-medium text-success-text">
                          Active Returns
                        </h4>
                        <svg
                          className="size-4 text-success"
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
                      <p className="text-display-lg font-bold text-success-text">
                        23
                      </p>
                      <p className="mt-1 text-caption text-green-700">
                        In progress
                      </p>
                    </div>

                    <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-body-md font-medium text-purple-900">
                          Pending Review
                        </h4>
                        <svg
                          className="size-4 text-purple-600"
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
                      <p className="text-display-lg font-bold text-purple-900">
                        8
                      </p>
                      <p className="mt-1 text-caption text-purple-700">
                        Needs attention
                      </p>
                    </div>

                    <div className="rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-body-md font-medium text-warning-text">
                          Completed
                        </h4>
                        <svg
                          className="size-4 text-warning"
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
                      <p className="text-display-lg font-bold text-warning-text">
                        16
                      </p>
                      <p className="mt-1 text-caption text-warning-text">
                        This tax year
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="mb-4 text-heading-lg font-semibold text-gray-900">
                      Client Portfolio Overview
                    </h3>
                    <div className="space-y-3">
                      <div className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-info-bg">
                            <span className="text-body-md font-semibold text-info-text">
                              JD
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              John Doe
                            </p>
                            <p className="text-caption text-gray-500">
                              Portfolio: $518,646
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="rounded bg-yellow-100 px-2 py-1 text-caption font-medium text-yellow-800">
                            In Review
                          </span>
                        </div>
                      </div>

                      <div className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-success-bg">
                            <span className="text-body-md font-semibold text-success-text">
                              AS
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Alice Smith
                            </p>
                            <p className="text-caption text-gray-500">
                              Portfolio: $1,234,890
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="rounded bg-success-bg px-2 py-1 text-caption font-medium text-green-800">
                            Complete
                          </span>
                        </div>
                      </div>

                      <div className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-purple-100">
                            <span className="text-body-md font-semibold text-purple-900">
                              BJ
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Bob Johnson
                            </p>
                            <p className="text-caption text-gray-500">
                              Portfolio: $789,234
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="rounded bg-info-bg px-2 py-1 text-caption font-medium text-blue-800">
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
