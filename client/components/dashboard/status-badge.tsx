import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  variant: "success" | "warning" | "error" | "pending";
  children: React.ReactNode;
  className?: string;
}

// Map this component's domain states onto the shared ui/badge variants so the
// status -> fill color mapping has a single source of truth (badgeVariants).
const toBadgeVariant = {
  success: "success",
  warning: "warning",
  error: "error",
  pending: "info",
} as const;

// Shape-only treatment: StatusBadge keeps its distinct squared, bordered look
// (vs the badge's rounded-full pill). The colored border tint reuses the same
// semantic status tokens; the fill colors come from badgeVariants above.
const borderStyles = {
  success: "border-success/30",
  warning: "border-warning/30",
  error: "border-error/30",
  pending: "border-info/30",
} as const;

export function StatusBadge({
  variant,
  children,
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant={toBadgeVariant[variant]}
      className={cn(
        "rounded-md border px-2 py-1 text-caption",
        borderStyles[variant],
        className,
      )}
    >
      {children}
    </Badge>
  );
}
