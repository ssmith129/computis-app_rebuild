import { AppLayout } from "@/components/layout/app-layout";
import { TransactionsContent } from "@/components/transactions/transactions-content";

export default function Transactions() {
  return (
    <AppLayout activeItem="Transactions">
      <TransactionsContent />
    </AppLayout>
  );
}
