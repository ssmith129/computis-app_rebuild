import { AppLayout } from "@/components/layout/app-layout";
import { RuleEngineContent } from "@/components/rule-engine/rule-engine-content";

export default function RuleEngine() {
  return (
    <AppLayout activeItem="Rule Engine">
      <RuleEngineContent />
    </AppLayout>
  );
}
