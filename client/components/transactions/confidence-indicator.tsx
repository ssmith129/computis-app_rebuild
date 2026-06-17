import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ConfidenceIndicator (WCAG 1.4.1 — do not rely on color alone)
 *
 * Encodes AI-classification confidence with THREE redundant channels for every
 * tier: an icon, a short text label, and a semantic token color. Previously the
 * judgment was color-only and an icon appeared only below 40%, leaving the
 * 40–69% tier with no non-color signal.
 *
 *   >= 70  check-circle   "High"  text-success
 *   40–69  alert-circle   "Med"   text-warning
 *   < 40   alert-triangle "Low"   text-error
 */
export type ConfidenceTier = "High" | "Med" | "Low";

export function getConfidenceTier(confidence: number): {
  Icon: typeof CheckCircle2;
  label: ConfidenceTier;
  color: string;
} {
  if (confidence >= 70)
    return { Icon: CheckCircle2, label: "High", color: "text-success" };
  if (confidence >= 40)
    return { Icon: AlertCircle, label: "Med", color: "text-warning" };
  return { Icon: AlertTriangle, label: "Low", color: "text-error" };
}

export interface ConfidenceIndicatorProps {
  confidence: number;
  /** "sm" keeps 40px table-row density; "lg" for the detail modal. */
  size?: "sm" | "lg";
  className?: string;
}

export function ConfidenceIndicator({
  confidence,
  size = "sm",
  className,
}: ConfidenceIndicatorProps) {
  const { Icon, label, color } = getConfidenceTier(confidence);
  const iconClass = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  const textClass =
    size === "lg" ? "text-2xl font-bold" : "text-sm font-medium";

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", color, className)}
      role="img"
      aria-label={`${label} confidence, ${confidence} percent`}
    >
      <Icon className={cn(iconClass, "shrink-0")} aria-hidden="true" />
      <span className={cn("whitespace-nowrap tabular-nums", textClass)}>
        <span className="font-semibold">{label}</span> {confidence}%
      </span>
    </span>
  );
}
