import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  variant: "success" | "warning" | "error" | "pending";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  success: "bg-success-bg text-success-text border-success/30",
  warning: "bg-warning-bg text-warning-text border-warning/30",
  error: "bg-error-bg text-error-text border-error/30",
  pending: "bg-pending-bg text-pending-foreground border-pending/30",
};

export function StatusBadge({
  variant,
  children,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
