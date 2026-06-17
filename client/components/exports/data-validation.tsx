import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle } from "lucide-react";

const validationItems = [
  {
    id: "transaction-classification",
    title: "Transaction Classification",
    status: "Passed",
    value: 100,
    color: "text-success",
    bgColor: "bg-success",
    icon: CheckCircle,
    description: "All classifications validated",
  },
  {
    id: "fmv-accuracy",
    title: "FMV Data Accuracy",
    status: "Warning",
    value: 85,
    color: "text-warning",
    bgColor: "bg-warning",
    icon: AlertTriangle,
    description: "Some pricing data missing",
  },
  {
    id: "ai-confidence",
    title: "AI Classification Confidence",
    status: "Passed",
    value: 92,
    color: "text-success",
    bgColor: "bg-success",
    icon: CheckCircle,
    description: "High confidence scores",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Passed":
      return (
        <Badge className="bg-success-bg text-success-text">{status}</Badge>
      );
    case "Warning":
      return (
        <Badge className="bg-warning-bg text-warning-text">{status}</Badge>
      );
    case "Error":
      return <Badge className="bg-error-bg text-error-text">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function DataValidation() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="mb-1 text-heading-lg font-semibold">
            Data Validation
          </h3>
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-success" />
            <p className="text-body-md text-muted-foreground">
              Your data has been validated for export
            </p>
          </div>
        </div>
      </div>

      {/* Validation Items */}
      <div className="space-y-6">
        {validationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className={`size-4 ${item.color}`} />
                  <span className="text-body-md font-medium">{item.title}</span>
                </div>
                {getStatusBadge(item.status)}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-body-md">
                  <span className="text-muted-foreground">
                    {item.description}
                  </span>
                  <span className="font-medium">{item.value}%</span>
                </div>
                <div className="relative">
                  <Progress value={item.value} className="h-2" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-body-md">
          <span className="text-muted-foreground">Overall Status:</span>
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-success" />
            <span className="font-medium text-success">Ready for Export</span>
          </div>
        </div>
      </div>
    </div>
  );
}
