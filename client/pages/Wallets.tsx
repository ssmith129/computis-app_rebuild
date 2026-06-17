import { AppLayout } from "@/components/layout/app-layout";
import { WalletsContent } from "@/components/wallets/wallets-content";

export default function Wallets() {
  return (
    <AppLayout activeItem="Wallets and Exchanges">
      <WalletsContent />
    </AppLayout>
  );
}
