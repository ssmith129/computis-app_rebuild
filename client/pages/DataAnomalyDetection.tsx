import { AppLayout } from "@/components/layout/app-layout";
import { DataAnomalyDetectionContent } from "@/components/data-anomaly-detection/data-anomaly-detection-content";

export default function DataAnomalyDetection() {
  return (
    <AppLayout activeItem="Transactions">
      <DataAnomalyDetectionContent />
    </AppLayout>
  );
}
