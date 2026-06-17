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
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;

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
        className="transform -rotate-90 transition-transform duration-300 hover:scale-105 w-full h-auto max-w-full"
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
            <div className="text-display-lg font-bold font-mono tabular-nums text-gray-900">
              {total.toLocaleString()}
            </div>
            <div className="text-caption text-gray-500">Total</div>
          </div>
        )}
      </div>

      {/* Active segment tooltip */}
      {activeSegment !== null && (
        <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-caption sm:text-body-md animate-in fade-in-0 zoom-in-95 duration-200 z-10 whitespace-nowrap">
          <div className="font-medium">{segments[activeSegment].label}</div>
          <div className="text-caption opacity-75">
            {segments[activeSegment].value.toLocaleString()} (
            {segments[activeSegment].percentage}%)
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
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
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div
              className={cn(
                "w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm transition-transform duration-200 flex-shrink-0",
                hoveredItem === index && "scale-110",
              )}
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0 flex-1">
              <span className="text-caption sm:text-body-md font-medium text-gray-900 truncate block">
                {item.label}
              </span>
              {item.trend && item.trendValue && (
                <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                  {item.trend === "up" && (
                    <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500 flex-shrink-0" />
                  )}
                  {item.trend === "down" && (
                    <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-500 flex-shrink-0" />
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
          <div className="text-right flex-shrink-0 ml-2">
            <div className="text-caption sm:text-body-md font-semibold text-gray-900 whitespace-nowrap">
              {item.value.toLocaleString()}
            </div>
            <div className="text-caption text-gray-500 whitespace-nowrap">
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
      {/* Gain/Loss Breakdown */}
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="min-w-0">
              <h3 className="text-heading-md sm:text-heading-lg font-bold text-gray-900 truncate">
                Gain/Loss Breakdown
              </h3>
              <p className="text-caption sm:text-body-md text-gray-500">
                Current tax year performance
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant="secondary"
                className="bg-success-bg text-success-text text-caption"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Net Positive
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hidden sm:flex"
                aria-label="Gain/loss chart options"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="order-2 sm:order-1">
              <EnhancedLegend data={gainLossData} />
            </div>
            <div className="order-1 sm:order-2 flex justify-center py-4 sm:py-0">
              <AnimatedPieChart
                data={gainLossData}
                size={160}
                className="w-full max-w-chart-md"
                centerContent={
                  <div className="text-center">
                    <div className="text-heading-lg sm:text-display-sm font-bold text-green-600">
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
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="min-w-0">
              <h3 className="text-heading-md sm:text-heading-lg font-bold text-gray-900 truncate">
                Transaction Status
              </h3>
              <p className="text-caption sm:text-body-md text-gray-500">
                Processing pipeline overview
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant="secondary"
                className="bg-info-bg text-info-text text-caption"
              >
                {Math.round(
                  (transactionStatusData[0].value / totalTransactions) * 100,
                )}
                % Complete
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hidden sm:flex"
                aria-label="Transaction status chart options"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="order-2 sm:order-1">
              <EnhancedLegend data={transactionStatusData} />
            </div>
            <div className="order-1 sm:order-2 flex justify-center py-4 sm:py-0">
              <AnimatedPieChart
                data={transactionStatusData}
                size={160}
                className="w-full max-w-chart-md"
                centerContent={
                  <div className="text-center">
                    <div className="text-heading-lg sm:text-display-sm font-bold text-gray-900">
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
