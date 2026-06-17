import { AppLayout } from "@/components/layout/app-layout";
import { SettingsContent } from "@/components/settings/settings-content";

export default function Settings() {
  return (
    <AppLayout activeItem="General Settings">
      <SettingsContent />
    </AppLayout>
  );
}
