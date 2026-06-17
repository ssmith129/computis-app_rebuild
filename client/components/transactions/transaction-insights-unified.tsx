import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Sparkles,
  Flag,
} from "lucide-react";
import { Link } from "react-router-dom";

const classificationData = [
  {
    level: "High",
    fullLevel: "High Confidence",
    count: 61,
    percentage: 55,
    description: "Match known patterns",
    color: "text-success",
    bgColor: "bg-success-bg",
    icon: CheckCircle,
    progressColor: "bg-success",
    actionColor: "text-success",
  },
  {
    level: "Medium",
    fullLevel: "Medium Confidence",
    count: 42,
    percentage: 34,
    description: "Somewhat reliable",
    color: "text-warning",
    bgColor: "bg-warning-bg",
    icon: AlertCircle,
    progressColor: "bg-warning",
    actionColor: "text-warning",
  },
  {
    level: "Low",
    fullLevel: "Low Confidence",
    count: 14,
    percentage: 11,
    description: "Needs manual review",
    color: "text-error",
    bgColor: "bg-error-bg",
    icon: XCircle,
    progressColor: "bg-error",
    actionColor: "text-error",
  },
];

const anomalyFlags = [
  {
    id: "volume-spike",
    type: "error",
    severity: "high",
    icon: AlertTriangle,
    title: "Volume Spike",
    subtitle: "Unusual Activity",
    count: 15,
    metric: "+300%",
    iconBg: "bg-error-bg",
    iconColor: "text-error",
    borderColor: "border-error/30",
    accentColor: "bg-error",
    actionLabel: "Investigate",
  },
  {
    id: "missing-fmv",
    type: "warning",
    severity: "medium",
    icon: TrendingUp,
    title: "Missing FMV",
    subtitle: "Pricing Required",
    count: 3,
    metric: "Critical",
    iconBg: "bg-warning-bg",
    iconColor: "text-warning",
    borderColor: "border-warning/30",
    accentColor: "bg-warning",
    actionLabel: "Fix Values",
  },
  {
    id: "classification-conflict",
    type: "info",
    severity: "low",
    icon: Users,
    title: "Rule Conflict",
    subtitle: "Classification Issue",
    count: 2,
    metric: "Low Priority",
    iconBg: "bg-info-bg",
    iconColor: "text-info",
    borderColor: "border-info/30",
    accentColor: "bg-info",
    actionLabel: "Resolve",
  },
];

export function TransactionInsightsUnified() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* AI Classification Insights Card */}
      <section
        aria-labelledby="classification-heading"
        className="flex flex-col h-auto border rounded-lg bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-info-bg">
              <Sparkles className="h-5 w-5 text-info" aria-hidden="true" />
            </div>
            <div>
              <h3
                id="classification-heading"
                className="text-heading-md font-semibold text-foreground leading-none mb-1"
              >
                AI Classification
              </h3>
              <p className="text-caption text-muted-foreground">
                Confidence distribution
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-caption font-semibold px-2.5 py-1"
          >
            117
          </Badge>
        </div>

        {/* Classification List */}
        <div
          className="space-y-4 flex-1"
          role="list"
          aria-label="Classification levels"
        >
          {classificationData.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.level}
                className="group flex items-center gap-3"
                role="listitem"
              >
                {/* Icon and Label */}
                <div className="flex items-center gap-2 min-w-[100px]">
                  <div className={`p-1 rounded-md ${item.bgColor}`}>
                    <IconComponent
                      className={`h-4 w-4 ${item.color}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-body-md font-semibold text-foreground leading-tight">
                      {item.level}
                    </span>
                    <span className="text-caption text-muted-foreground leading-tight">
                      {item.count} txns
                    </span>
                  </div>
                </div>

                {/* Progress Bar with Percentage */}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <Progress
                    value={item.percentage}
                    className="h-2 flex-1"
                    aria-label={`${item.fullLevel}: ${item.percentage}% of transactions`}
                  />
                  <span
                    className={`text-body-md font-bold tabular-nums ${item.color} min-w-[42px] text-right`}
                    aria-label={`${item.percentage} percent`}
                  >
                    {item.percentage}%
                  </span>
                </div>

                {/* Action Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${item.actionColor} h-7 px-2 text-caption font-medium opacity-0 group-hover:opacity-100 transition-opacity`}
                  aria-label={`Review ${item.fullLevel.toLowerCase()} transactions`}
                >
                  Review
                </Button>
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        <div className="mt-5 pt-4 border-t flex items-center justify-between">
          <span className="text-caption font-medium text-muted-foreground">
            Total Classified
          </span>
          <span className="text-body-md font-bold text-foreground tabular-nums">
            117 transactions
          </span>
        </div>
      </section>

      {/* Anomaly Flags Card - 1x3 Grid with Compact Layout */}
      <section
        aria-labelledby="anomaly-heading"
        className="flex flex-col h-auto border rounded-lg bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-warning-bg">
              <Flag className="h-5 w-5 text-orange-600" aria-hidden="true" />
            </div>
            <div>
              <h3
                id="anomaly-heading"
                className="text-heading-md font-semibold text-foreground leading-none mb-1"
              >
                Anomaly Flags
              </h3>
              <p className="text-caption text-muted-foreground">
                Issues requiring attention
              </p>
            </div>
          </div>
          <Link to="/data-anomaly-detection">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-auto p-0 text-caption font-medium"
              aria-label="View all anomaly flags"
            >
              View All →
            </Button>
          </Link>
        </div>

        {/* 1x3 Grid of Compact Anomaly Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1"
          role="list"
          aria-label="Transaction anomalies"
        >
          {anomalyFlags.map((flag) => {
            const IconComponent = flag.icon;
            return (
              <div
                key={flag.id}
                className={`group relative flex flex-col h-auto border-2 ${flag.borderColor} rounded-lg bg-card hover:shadow-lg transition-all overflow-hidden`}
                role="listitem"
              >
                {/* Severity Accent Bar */}
                <div
                  className={`h-1 w-full ${flag.accentColor}`}
                  aria-label={`Severity: ${flag.severity}`}
                />

                {/* Card Content - Compact Layout */}
                <div className="p-4 flex flex-col gap-3">
                  {/* Icon and Title Section */}
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${flag.iconBg} shrink-0`}>
                      <IconComponent
                        className={`h-4 w-4 ${flag.iconColor}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-body-md font-bold text-foreground leading-tight mb-0.5">
                        {flag.title}
                      </h4>
                      <p className="text-caption text-muted-foreground leading-tight">
                        {flag.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Metrics Section */}
                  <div className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50">
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-caption text-muted-foreground mb-0.5">
                        Count
                      </span>
                      <span
                        className={`text-caption font-bold ${flag.iconColor} tabular-nums`}
                      >
                        {flag.count}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-border mx-2" />
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-caption text-muted-foreground mb-0.5">
                        Status
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-caption font-semibold ${flag.iconBg} ${flag.iconColor} border-0 px-2`}
                      >
                        {flag.metric}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="mt-auto pt-2 text-center">
                    <Link
                      to="/data-anomaly-detection"
                      className={`text-body-md font-medium ${flag.iconColor} hover:underline transition-all`}
                      aria-label={`${flag.actionLabel} ${flag.title.toLowerCase()}`}
                    >
                      {flag.actionLabel} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        <div className="mt-5 pt-4 border-t">
          <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border-l-4 border-orange-500">
            <div className="flex items-center gap-2">
              <AlertTriangle
                className="h-4 w-4 text-orange-600 shrink-0"
                aria-hidden="true"
              />
              <span className="text-caption font-medium text-foreground">
                Active Issues
              </span>
            </div>
            <span
              className="text-body-md font-bold text-orange-600 tabular-nums"
              aria-label="20 total anomalies"
            >
              20 Total
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
