import { cn } from "@/lib/utils";

interface PieSegment {
  value: number;
  color: string;
  label: string;
}

interface PieChartProps {
  data: PieSegment[];
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function PieChart({
  data,
  size = 240,
  strokeWidth = 4,
  className,
}: PieChartProps) {
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const total = data.reduce((sum, segment) => sum + segment.value, 0);

  let cumulativeAngle = 0;

  const segments = data.map((segment) => {
    const percentage = segment.value / total;
    const angle = percentage * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;

    // Convert to radians
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    cumulativeAngle += angle;

    return {
      ...segment,
      pathData,
      percentage: Math.round(percentage * 100),
    };
  });

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg width={size} height={size} className="drop-shadow-sm">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.pathData}
            fill={segment.color}
            stroke="white"
            strokeWidth={strokeWidth}
            className="hover:opacity-80 transition-opacity duration-200"
          />
        ))}
        {/* Center circle for donut effect */}
        <circle cx={centerX} cy={centerY} r={radius * 0.35} fill="white" />
      </svg>
    </div>
  );
}

interface LegendProps {
  data: PieSegment[];
  className?: string;
}

export function ChartLegend({ data, className }: LegendProps) {
  return (
    <div
      className={cn(
        "flex justify-center items-center gap-8 flex-wrap",
        className,
      )}
    >
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full border border-black/10"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-body-md text-gray-600 font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
