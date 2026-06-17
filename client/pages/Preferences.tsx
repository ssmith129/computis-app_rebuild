import { AppLayout } from "@/components/layout/app-layout";
import { PreferencesContent } from "@/components/preferences/preferences-content";

export default function Preferences() {
  return (
    <AppLayout activeItem="Preferences">
      <PreferencesContent />
    </AppLayout>
  );
}
