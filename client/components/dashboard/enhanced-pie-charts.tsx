import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PieSegment {
  value: number;
  color: string;
  label: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
}

interface AnimatedPieChartProps {
  data: PieSegment[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  animate?: boolean;
  centerContent?: React.ReactNode;
}

export function AnimatedPieChart({
  data,
  size = 200,
  strokeWidth = 8,
  className,
  animate = true,
  centerContent,
}: AnimatedPieChartProps) {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<number>();

  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  const circumference = 2 * Math.PI * radius;

  const total = data.reduce((sum, segment) => sum + segment.value, 0);

  useEffect(() => {
    if (animate) {
      const startTime = Date.now();
      const duration = 1500; // 1.5 seconds

      const updateAnimation = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setAnimationProgress(easeOutQuart);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(updateAnimation);
        }
      };

      animationRef.current = requestAnimationFrame(updateAnimation);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      setAnimationProgress(1);
    }
  }, [animate]);

  let cumulativeAngle = 0;

  const segments = data.map((segment, index) => {
    const percentage = segment.value / total;
    const angle = percentage * 360 * animationProgress;

    const isActive = activeSegment === index;
    const adjustedRadius = isActive ? radius + 4 : radius;

    // Calculate stroke-dasharray for the segment
    const segmentLength = percentage * circumference * animationProgress;
    const dashArray = `${segmentLength} ${circumference}`;
    const dashOffset = (-cumulativeAngle / 360) * circumference;

    cumulativeAngle += angle;

    return {
      ...segment,
      percentage: Math.round(percentage * 100),
      dashArray,
      dashOffset,
      adjustedRadius,
      isActive,
    };
  });

  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-full",
        className,
      )}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full max-w-full -rotate-90 transition-transform duration-300 hover:scale-105"
      >
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="hsl(var(--gray-100))"
          strokeWidth={strokeWidth}
        />

        {/* Animated segments */}
        {segments.map((segment, index) => (
          <circle
            key={index}
            cx={centerX}
            cy={centerY}
            r={segment.adjustedRadius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={segment.dashArray}
            strokeDashoffset={segment.dashOffset}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-300 cursor-pointer",
              segment.isActive && "drop-shadow-lg",
            )}
            style={{
              filter: segment.isActive
                ? `drop-shadow(0 0 8px ${segment.color}40)`
                : "none",
            }}
            onMouseEnter={() => setActiveSegment(index)}
            onMouseLeave={() => setActiveSegment(null)}
          />
        ))}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {centerContent || (
          <div className="text-center">
            <div className="font-mono text-display-lg font-bold tabular-nums text-gray-900">
              {total.toLocaleString()}
            </div>
            <div className="text-caption text-gray-500">Total</div>
          </div>
        )}
      </div>

      {/* Active segment tooltip */}
      {activeSegment !== null && (
        <div className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1.5 text-caption text-white duration-200 animate-in fade-in-0 zoom-in-95 sm:-top-12 sm:px-3 sm:py-2 sm:text-body-md">
          <div className="font-medium">{segments[activeSegment].label}</div>
          <div className="text-caption opacity-75">
            {segments[activeSegment].value.toLocaleString()} (
            {segments[activeSegment].percentage}%)
          </div>
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

interface EnhancedLegendProps {
  data: PieSegment[];
  className?: string;
  interactive?: boolean;
}

export function EnhancedLegend({
  data,
  className,
  interactive = true,
}: EnhancedLegendProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <div className={cn("space-y-2 sm:space-y-3", className)}>
      {data.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-200 min-w-0",
            interactive && "hover:bg-gray-50 cursor-pointer",
            hoveredItem === index && "bg-gray-50 shadow-sm",
          )}
          onMouseEnter={() => interactive && setHoveredItem(index)}
          onMouseLeave={() => interactive && setHoveredItem(null)}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div
              className={cn(
                "w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm transition-transform duration-200 flex-shrink-0",
                hoveredItem === index && "scale-110",
              )}
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0 flex-1">
              <span className="block truncate text-caption font-medium text-gray-900 sm:text-body-md">
                {item.label}
              </span>
              {item.trend && item.trendValue && (
                <div className="mt-0.5 flex items-center gap-1 sm:mt-1">
                  {item.trend === "up" && (
                    <TrendingUp className="size-2.5 shrink-0 text-green-500 sm:size-3" />
                  )}
                  {item.trend === "down" && (
                    <TrendingDown className="size-2.5 shrink-0 text-red-500 sm:size-3" />
                  )}
                  <span
                    className={cn(
                      "text-caption truncate",
                      item.trend === "up" && "text-success",
                      item.trend === "down" && "text-error",
                      item.trend === "stable" && "text-gray-500",
                    )}
                  >
                    {item.trendValue}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="ml-2 shrink-0 text-right">
            <div className="whitespace-nowrap text-caption font-semibold text-gray-900 sm:text-body-md">
              {item.value.toLocaleString()}
            </div>
            <div className="whitespace-nowrap text-caption text-gray-500">
              {Math.round(
                (item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100,
              )}
              %
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EnhancedPieChartSections() {
  const gainLossData = [
    {
      value: 89650,
      color: "var(--chart-long-term-gains)",
      label: "Long-term Gains",
      trend: "up" as const,
      trendValue: "+12.5%",
    },
    {
      value: 45200,
      color: "var(--chart-short-term-gains)",
      label: "Short-term Gains",
      trend: "up" as const,
      trendValue: "+8.3%",
    },
    {
      value: -15400,
      color: "var(--chart-realized-losses)",
      label: "Realized Losses",
      trend: "down" as const,
      trendValue: "-3.2%",
    },
    {
      value: 8750,
      color: "var(--chart-pending)",
      label: "Pending Review",
      trend: "stable" as const,
      trendValue: "No change",
    },
  ];

  const transactionStatusData = [
    {
      value: 8543,
      color: "var(--chart-classified)",
      label: "Classified",
      trend: "up" as const,
      trendValue: "+234 today",
    },
    {
      value: 1205,
      color: "var(--chart-pending)",
      label: "Pending Review",
      trend: "down" as const,
      trendValue: "-45 today",
    },
    {
      value: 156,
      color: "var(--chart-realized-losses)",
      label: "Failed Validation",
      trend: "down" as const,
      trendValue: "-12 today",
    },
    {
      value: 89,
      color: "var(--chart-neutral)",
      label: "Archived",
      trend: "stable" as const,
      trendValue: "No change",
    },
  ];

  const totalGainLoss = gainLossData.reduce((sum, item) => sum + item.value, 0);
  const totalTransactions = transactionStatusData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8">
      {/* Gain/Loss Breakdown */}
      <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <h3 className="truncate text-heading-md font-bold text-gray-900 sm:text-heading-lg">
                Gain/Loss Breakdown
              </h3>
              <p className="text-caption text-gray-500 sm:text-body-md">
                Current tax year performance
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-success-bg text-caption text-success-text"
              >
                <TrendingUp className="mr-1 size-3" />
                Net Positive
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="hidden size-6 sm:flex"
                aria-label="Gain/loss chart options"
              >
                <MoreHorizontal className="size-4 text-gray-400" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="order-2 sm:order-1">
              <EnhancedLegend data={gainLossData} />
            </div>
            <div className="order-1 flex justify-center py-4 sm:order-2 sm:py-0">
              <AnimatedPieChart
                data={gainLossData}
                size={160}
                className="w-full max-w-chart-md"
                centerContent={
                  <div className="text-center">
                    <div className="text-heading-lg font-bold text-green-600 sm:text-display-sm">
                      ${totalGainLoss.toLocaleString()}
                    </div>
                    <div className="text-caption text-gray-500">Net Gain</div>
                  </div>
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Status */}
      <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <h3 className="truncate text-heading-md font-bold text-gray-900 sm:text-heading-lg">
                Transaction Status
              </h3>
              <p className="text-caption text-gray-500 sm:text-body-md">
                Processing pipeline overview
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-info-bg text-caption text-info-text"
              >
                {Math.round(
                  (transactionStatusData[0].value / totalTransactions) * 100,
                )}
                % Complete
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="hidden size-6 sm:flex"
                aria-label="Transaction status chart options"
              >
                <MoreHorizontal className="size-4 text-gray-400" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="order-2 sm:order-1">
              <EnhancedLegend data={transactionStatusData} />
            </div>
            <div className="order-1 flex justify-center py-4 sm:order-2 sm:py-0">
              <AnimatedPieChart
                data={transactionStatusData}
                size={160}
                className="w-full max-w-chart-md"
                centerContent={
                  <div className="text-center">
                    <div className="text-heading-lg font-bold text-gray-900 sm:text-display-sm">
                      {totalTransactions.toLocaleString()}
                    </div>
                    <div className="text-caption text-gray-500">Total Txs</div>
                  </div>
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
