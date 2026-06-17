import { AppLayout } from "@/components/layout/app-layout";
import { ClientsContent } from "@/components/clients/clients-content";

export default function Clients() {
  return (
    <AppLayout activeItem="Clients">
      <ClientsContent />
    </AppLayout>
  );
}
