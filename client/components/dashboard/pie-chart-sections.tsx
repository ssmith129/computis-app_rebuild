import { MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, ChartLegend } from "./pie-chart";

const txsStatusData = [
  { value: 65, color: "var(--chart-processed)", label: "Processed" },
  { value: 20, color: "var(--chart-source)", label: "Source" },
  { value: 10, color: "var(--chart-archived)", label: "Archived" },
  { value: 5, color: "var(--chart-ignored)", label: "Ignored" },
];

const uploadStatusData = [
  { value: 80, color: "var(--chart-success)", label: "Success" },
  { value: 15, color: "var(--chart-warning-hex)", label: "Warning" },
  { value: 5, color: "var(--chart-failed)", label: "Failed" },
];

export function PieChartSections() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Txs Status Chart */}
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">Txs Status</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            aria-label="Transaction status options"
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <PieChart data={txsStatusData} size={240} />
          </div>
          <ChartLegend data={txsStatusData} />
        </div>
      </Card>

      {/* Txs Upload Status Chart */}
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">
            Txs Upload Status
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            aria-label="Upload status options"
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <PieChart data={uploadStatusData} size={240} />
          </div>
          <ChartLegend data={uploadStatusData} />
        </div>
      </Card>
    </div>
  );
}
