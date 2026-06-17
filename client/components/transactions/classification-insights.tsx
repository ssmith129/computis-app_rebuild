import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

const classificationData = [
  {
    level: "High Confidence",
    count: 61,
    percentage: 55,
    description: "Match known patterns with high confidence",
    color: "text-success",
    bgColor: "bg-success-bg",
    icon: CheckCircle,
    progressColor: "bg-success",
    actionColor: "text-success",
  },
  {
    level: "Medium Confidence",
    count: 42,
    percentage: 34,
    description: "Somewhat reliable AI classifications",
    color: "text-warning",
    bgColor: "bg-warning-bg",
    icon: AlertCircle,
    progressColor: "bg-warning",
    actionColor: "text-warning",
  },
  {
    level: "Low Confidence",
    count: 14,
    percentage: 11,
    description: "Need manual review due to uncertain patterns",
    color: "text-error",
    bgColor: "bg-error-bg",
    icon: XCircle,
    progressColor: "bg-error",
    actionColor: "text-error",
  },
];

export function ClassificationInsights() {
  return (
    <div className="space-y-3">
      {classificationData.map((item) => {
        const IconComponent = item.icon;
        return (
          <div key={item.level} className="flex items-center gap-4 py-2">
            {/* Icon and Label */}
            <div className="flex items-center gap-2 min-w-[140px]">
              <IconComponent className={`h-4 w-4 ${item.color}`} />
              <span className="text-body-md font-medium">{item.level}</span>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 min-w-[120px]">
              <Progress value={item.percentage} className="h-2" />
            </div>

            {/* Count and Percentage */}
            <div className="text-body-md text-muted-foreground min-w-[100px] text-right">
              {item.count} ({item.percentage}%)
            </div>

            {/* Primary Action */}
            <Button
              variant="link"
              className={`${item.actionColor} p-0 h-auto text-body-md`}
            >
              Review
            </Button>
          </div>
        );
      })}

      {/* Summary Row */}
      <div className="flex items-center justify-between pt-2 border-t">
        <span className="text-body-md text-muted-foreground">
          Total Classifications
        </span>
        <span className="text-body-md font-medium">117 transactions</span>
      </div>
    </div>
  );
}
