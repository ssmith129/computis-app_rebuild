import { cn } from "@/lib/utils";

interface ChartBarProps {
  height: number;
  color: "blue" | "green" | "orange" | "yellow" | "cyan" | "red";
  className?: string;
}

const colorMap = {
  blue: "bg-chart-blue",
  green: "bg-chart-green",
  orange: "bg-chart-orange",
  yellow: "bg-chart-yellow",
  cyan: "bg-chart-cyan",
  red: "bg-chart-red",
};

export function ChartBar({ height, color, className }: ChartBarProps) {
  return (
    <div
      className={cn("w-[5px] chart-bar rounded-sm", colorMap[color], className)}
      style={{ height: `${height}px` }}
    />
  );
}

interface MiniChartProps {
  data: number[];
  color: "blue" | "green" | "orange" | "yellow" | "cyan" | "red";
  className?: string;
}

export function MiniChart({ data, color, className }: MiniChartProps) {
  const maxValue = Math.max(...data);
  const maxHeight = 48; // 48px max height

  return (
    <div className={cn("flex items-end gap-1.5 h-14 p-1", className)}>
      {data.map((value, index) => (
        <ChartBar
          key={index}
          height={Math.max(2, (value / maxValue) * maxHeight)}
          color={color}
        />
      ))}
    </div>
  );
}
