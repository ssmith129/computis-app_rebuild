import {
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Settings,
  DollarSign,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

interface EnhancedDashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: any;
  iconColor: string;
  iconBg: string;
  chartData?: number[];
  chartColor?:
    | "blue"
    | "green"
    | "orange"
    | "yellow"
    | "cyan"
    | "red"
    | "purple";
  progress?: number;
  status?: "success" | "warning" | "error" | "info";
  actionLabel?: string;
  actionLink?: string;
  badge?: {
    text: string;
    variant: "success" | "warning" | "error" | "info";
  };
  animate?: boolean;
}

export function EnhancedDashboardCard({
  title,
  value,
  subtitle,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor,
  iconBg,
  chartData,
  chartColor = "blue",
  progress,
  status,
  actionLabel,
  actionLink,
  badge,
  animate = true,
}: EnhancedDashboardCardProps) {
  const changeColorClass = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-gray-500",
  }[changeType];

  const statusColors = {
    success: "border-success/30 bg-success-bg",
    warning: "border-warning/30 bg-warning-bg",
    error: "border-error/30 bg-error-bg",
    info: "border-info/30 bg-info-bg",
  };

  const cardClassName = status
    ? `${statusColors[status]} transition-shadow duration-300 hover:shadow-lg cursor-pointer`
    : "bg-card transition-shadow duration-300 hover:shadow-lg cursor-pointer";

  const cardContent = (
    <Card className={cardClassName}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className={`p-2 sm:p-3 rounded-xl ${iconBg} flex-shrink-0`}>
              <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`} />
            </div>
            <div className="min-w-0">
              <h3 className="text-overline font-medium text-muted-foreground mb-1 truncate">
                {title}
              </h3>
              {badge && (
                <Badge
                  variant="secondary"
                  className={`text-caption ${
                    badge.variant === "success"
                      ? "bg-success-bg text-success-text"
                      : badge.variant === "warning"
                        ? "bg-warning-bg text-warning-text"
                        : badge.variant === "error"
                          ? "bg-error-bg text-error-text"
                          : "bg-info-bg text-info-text"
                  }`}
                >
                  {badge.text}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Card options"
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="space-y-1">
            <div className="text-display-sm font-bold text-foreground">
              {typeof value === "number" ? value.toLocaleString() : value}
            </div>
            {subtitle && (
              <div className="text-caption text-muted-foreground truncate">
                {subtitle}
              </div>
            )}
            {change && (
              <div
                className={`text-caption flex items-center gap-1 ${changeColorClass}`}
              >
                {changeType === "positive" && (
                  <TrendingUp className="h-3 w-3 flex-shrink-0" />
                )}
                {changeType === "negative" && (
                  <TrendingDown className="h-3 w-3 flex-shrink-0" />
                )}
                <span className="truncate">{change}</span>
              </div>
            )}
          </div>

          {progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-body-md">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress
                value={progress}
                className="h-2 transition-all duration-500"
              />
            </div>
          )}

          {actionLabel && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-caption hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {actionLabel}
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (actionLink) {
    return (
      <Link to={actionLink} className="block group">
        {cardContent}
      </Link>
    );
  }

  return <div className="group">{cardContent}</div>;
}

export function EnhancedDashboardCards() {
  const cardsData = [
    {
      title: "Total Gain/Loss",
      value: "$127,456",
      subtitle: "Current tax year",
      change: "+$12,300 this month",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "text-success",
      iconBg: "bg-success-bg",
      chartData: [45, 52, 38, 65, 42, 73, 58, 67, 89, 76],
      chartColor: "green" as const,
      actionLabel: "View Gain/Loss Report",
      actionLink: "/gain-loss",
      animate: true,
    },
    {
      title: "Data Anomalies",
      value: 7,
      subtitle: "Issues requiring attention",
      change: "-3 resolved today",
      changeType: "positive" as const,
      icon: AlertTriangle,
      iconColor: "text-warning",
      iconBg: "bg-warning-bg",
      status: "warning" as const,
      badge: {
        text: "Action Required",
        variant: "warning" as const,
      },
      actionLabel: "Investigate Issues",
      actionLink: "/data-anomaly-detection",
      animate: true,
    },
    {
      title: "IRS 8949 Forms",
      value: "Ready",
      subtitle: "3 forms generated",
      change: "Updated 2 hours ago",
      changeType: "neutral" as const,
      icon: FileText,
      iconColor: "text-info",
      iconBg: "bg-info-bg",
      progress: 95,
      status: "success" as const,
      actionLabel: "Download Forms",
      actionLink: "/irs-8949",
      animate: true,
    },
    {
      title: "Active Clients",
      value: 24,
      subtitle: "18 firms, 6 individuals",
      change: "+2 new this week",
      changeType: "positive" as const,
      icon: Users,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      chartData: [12, 19, 15, 22, 18, 24, 21, 25, 23, 24],
      chartColor: "purple" as const,
      actionLabel: "Manage Clients",
      actionLink: "/clients",
      animate: true,
    },
    {
      title: "Transactions Processed",
      value: "98,765",
      subtitle: "Across all wallets",
      change: "+2,134 today",
      changeType: "positive" as const,
      icon: Activity,
      iconColor: "text-info",
      iconBg: "bg-info-bg",
      chartData: [890, 920, 1100, 980, 1200, 1350, 1180, 1400, 1250, 1380],
      chartColor: "blue" as const,
      actionLabel: "View Transactions",
      actionLink: "/transactions",
      animate: true,
    },
    {
      title: "Automation Rules",
      value: 15,
      subtitle: "Active classification rules",
      change: "89% accuracy rate",
      changeType: "positive" as const,
      icon: Settings,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
      progress: 89,
      actionLabel: "Manage Rules",
      actionLink: "/rule-engine",
      animate: true,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-heading-sm font-bold text-foreground truncate">
            Key Metrics & Tools
          </h2>
          <p className="text-caption sm:text-body-md text-gray-500">
            Overview of your crypto tax preparation status
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge
            variant="secondary"
            className="bg-success-bg text-success-text text-caption"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cardsData.map((card, index) => (
          <EnhancedDashboardCard key={index} {...card} />
        ))}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 sm:mt-8">
        <Card className="p-6 bg-gradient-to-r from-info-bg to-indigo-50 border-info/30 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Ready to File?
                </h3>
                <p className="text-body-md text-gray-600 mb-4">
                  All transactions classified and forms generated
                </p>
                <Link to="/exports">
                  <Button className="bg-primary hover:bg-primary-hover">
                    Generate Tax Package
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="text-4xl opacity-20">📊</div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-success-bg to-emerald-50 border-success/30 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Upload New Data
                </h3>
                <p className="text-body-md text-gray-600 mb-4">
                  Import transactions from wallets and exchanges
                </p>
                <Link to="/wallet-ingestion">
                  <Button
                    variant="outline"
                    className="border-success text-success hover:bg-success hover:text-white"
                  >
                    Upload Transactions
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="text-4xl opacity-20">📈</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
