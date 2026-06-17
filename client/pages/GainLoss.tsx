import { AppLayout } from "@/components/layout/app-layout";
import { GainLossContent } from "@/components/gain-loss/gain-loss-content";

export default function GainLoss() {
  return (
    <AppLayout activeItem="Gain/Loss">
      <GainLossContent />
    </AppLayout>
  );
}
