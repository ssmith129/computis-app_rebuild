import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Flag, Users, X } from "lucide-react";

const ruleConflicts = [
  {
    id: "classification-conflict",
    type: "error",
    icon: AlertTriangle,
    title: "Classification Conflict",
    description: "ETH-BTC Swaps vs Exchange Transfer: 23 rules",
    details:
      "3 transactions are affected by both rules with different classifications.",
    actionLabel: "Resolve",
    dismissLabel: "Adjust Priority",
  },
  {
    id: "priority-conflict",
    type: "warning",
    icon: Flag,
    title: "Priority Conflict",
    description: "Tag: Mining Income vs Exchange Fees",
    details:
      "Both rules have the same priority level and may cause inconsistent results.",
    actionLabel: "Adjust Priority",
    dismissLabel: "Ignore",
  },
];

const getAlertStyles = (type: string) => {
  switch (type) {
    case "error":
      return "border-red-200 bg-red-50 text-red-800";
    case "warning":
      return "border-yellow-200 bg-yellow-50 text-yellow-800";
    case "info":
      return "border-blue-200 bg-blue-50 text-blue-800";
    default:
      return "border-gray-200 bg-gray-50 text-gray-800";
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case "error":
      return "text-red-500";
    case "warning":
      return "text-yellow-500";
    case "info":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
};

export function RuleConflicts() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {ruleConflicts.map((conflict) => {
        const IconComponent = conflict.icon;
        return (
          <Alert
            key={conflict.id}
            className={`${getAlertStyles(conflict.type)} flex-1 min-w-0`}
          >
            <div className="flex items-start gap-3">
              <IconComponent
                className={`h-5 w-5 mt-0.5 shrink-0 ${getIconColor(conflict.type)}`}
              />
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <h4 className="font-medium">{conflict.title}</h4>
                  <AlertDescription className="text-body-md">
                    {conflict.description}
                  </AlertDescription>
                </div>
                <p className="text-caption opacity-80">{conflict.details}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-caption"
                  >
                    {conflict.actionLabel}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-caption"
                  >
                    {conflict.dismissLabel}
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 shrink-0 opacity-50 hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </Alert>
        );
      })}

      {/* Empty State if no conflicts */}
      {ruleConflicts.length === 0 && (
        <div className="text-center py-8 flex-1">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-heading-lg font-medium mb-2">
            No Rule Conflicts
          </h3>
          <p className="text-body-md text-muted-foreground">
            All your rules are working together without conflicts.
          </p>
        </div>
      )}
    </div>
  );
}
