import { type ReactNode } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardContent } from "./dashboard-content";

interface DashboardLayoutProps {
  activeItem?: string;
  children?: ReactNode;
}

export function DashboardLayout({
  activeItem = "Dashboard",
  children,
}: DashboardLayoutProps) {
  return (
    <AppLayout activeItem={activeItem}>
      {children ?? <DashboardContent />}
    </AppLayout>
  );
}
