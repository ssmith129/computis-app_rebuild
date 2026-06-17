import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExportCards } from "./export-cards";
import { ExportConfiguration } from "./export-configuration";
import { DataValidation } from "./data-validation";
import { IssuesTable } from "./issues-table";
import { RecentExports } from "./recent-exports";
import { AuditTrailDrawer } from "./audit-trail-drawer";
import { FileText, History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export function ExportsContent() {
  const [selectedYear, setSelectedYear] = useState("2023");
  const taxYears = ["2023", "2022", "2021"];

  const [historyOpen, setHistoryOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [auditDrawerOpen, setAuditDrawerOpen] = useState(false);
  const [selectedExportId, setSelectedExportId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (generating) return;
    setGenerating(true);
    toast({ title: "Generating…" });
    try {
      await new Promise((r) => setTimeout(r, 1200));
      toast({ title: "Export generated" });
    } catch (e) {
      toast({ title: "Export failed", description: String(e) });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="app-content">
      {/* Sticky page header */}
      <div className="page-titlebar">
        <div className="p-6">
          <div className="space-y-1">
            <h1 className="text-display-lg font-bold text-foreground">
              Export
            </h1>
            <p className="text-muted-foreground">
              Generate IRS 8949, QBO, and CSV files with embedded audit logs
            </p>
          </div>

          {/* Tax Year Selection and actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-body-md font-medium text-muted-foreground">
                Tax Year:
              </span>
              <div className="flex gap-1">
                {taxYears.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear(year)}
                    className="h-8"
                  >
                    {year}
                  </Button>
                ))}
              </div>
              <Button
                variant="link"
                size="sm"
                className="text-primary hover:text-primary-hover px-2"
                onClick={() => setAuditDrawerOpen(true)}
                aria-expanded={auditDrawerOpen}
                aria-controls="audit-drawer"
              >
                View Audit Trail
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHistoryOpen(true)}
              >
                <History className="h-4 w-4 mr-2" />
                Export History
              </Button>
              <Button
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={handleGenerate}
                disabled={generating}
              >
                <FileText className="h-4 w-4 mr-2" />
                {generating ? "Generating…" : "Generate Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Recent Exports */}
        <Card>
          <CardContent className="p-6">
            <RecentExports
              onRowClick={(id) => {
                setSelectedExportId(id);
                setAuditDrawerOpen(true);
              }}
            />
          </CardContent>
        </Card>

        {/* Export Cards */}
        <ExportCards selectedYear={selectedYear} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Configuration */}
          <Card>
            <CardContent className="p-6">
              <ExportConfiguration />
            </CardContent>
          </Card>

          {/* Data Validation */}
          <Card>
            <CardContent className="p-6">
              <DataValidation />
            </CardContent>
          </Card>
        </div>

        {/* Issues Requiring Attention */}
        <Card>
          <CardContent className="p-6">
            <IssuesTable />
          </CardContent>
        </Card>
      </div>
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-5xl w-full">
          <DialogHeader>
            <DialogTitle>Export History</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <RecentExports
              onRowClick={(id) => {
                setSelectedExportId(id);
                setAuditDrawerOpen(true);
                setHistoryOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Audit Trail Drawer */}
      <AuditTrailDrawer
        isOpen={auditDrawerOpen}
        onClose={() => {
          setAuditDrawerOpen(false);
          setSelectedExportId(null);
        }}
        exportId={selectedExportId}
      />
    </div>
  );
}
