import { ReactNode } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardContent } from "./dashboard-content";

interface DashboardLayoutProps {
  children?: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <AppLayout>{children ?? <DashboardContent />}</AppLayout>;
}
