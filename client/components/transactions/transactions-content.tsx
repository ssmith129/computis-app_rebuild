import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTable } from "./transactions-table";
import { TransactionInsightsUnified } from "./transaction-insights-unified";
import { Filter, Tag, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function TransactionsContent() {
  const [activeFilters, setActiveFilters] = useState({
    confidence: "All",
    status: "All",
  });

  const confidenceFilters = ["All", "High", "Medium", "Low"];
  const statusFilters = ["All", "Confirmed", "Suggested", "Flagged"];

  const getConfidenceButtonClass = (filter: string, isActive: boolean) => {
    if (!isActive) return "h-8";

    switch (filter) {
      case "High":
        return "h-8 bg-success-bg text-success-text hover:bg-success-bg/80 border-success/30";
      case "Medium":
        return "h-8 bg-warning-bg text-warning-text hover:bg-warning-bg/80 border-warning/30";
      case "Low":
        return "h-8 bg-error-bg text-error-text hover:bg-error-bg/80 border-error/30";
      default:
        return "h-8";
    }
  };

  return (
    <div className="app-content">
      <div className="page-titlebar">
        <div className="p-6">
          <div className="space-y-1">
            <h1 className="text-display-lg font-bold text-foreground">
              Transactions
            </h1>
            <p className="text-muted-foreground">
              Review and manage classified crypto transactions
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-body-md text-muted-foreground whitespace-nowrap">
                Confidence:
              </span>
              {confidenceFilters.map((filter) => {
                const isActive = activeFilters.confidence === filter;
                return (
                  <Button
                    key={filter}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        confidence: filter,
                      }))
                    }
                    className={getConfidenceButtonClass(filter, isActive)}
                  >
                    {filter}
                  </Button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-body-md text-muted-foreground whitespace-nowrap">
                Status:
              </span>
              {statusFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={
                    activeFilters.status === filter ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setActiveFilters((prev) => ({ ...prev, status: filter }))
                  }
                  className="h-8"
                >
                  {filter}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => toast({ title: "Filters coming soon" })}
              >
                <Filter className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => toast({ title: "Select transactions to tag." })}
              >
                <Tag className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Bulk Tag</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => {
                  toast({ title: "AI classification started" });
                  setTimeout(
                    () => toast({ title: "AI classification complete" }),
                    1000,
                  );
                }}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">AI Classify</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Transactions Table */}
          <Card>
            <CardContent className="p-0">
              <TransactionsTable filters={activeFilters} />
            </CardContent>
          </Card>

          {/* Unified Insights Cards - Horizontal Grid */}
          <div>
            <TransactionInsightsUnified />
          </div>
        </div>
      </div>
    </div>
  );
}
