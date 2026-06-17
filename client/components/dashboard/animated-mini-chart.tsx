import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedChartBarProps {
  height: number;
  color: "blue" | "green" | "orange" | "yellow" | "cyan" | "red" | "purple";
  delay: number;
  animate: boolean;
  isActive: boolean;
}

const colorMap = {
  blue: {
    bg: "bg-blue-500",
    glow: "shadow-blue-500/50",
    hover: "bg-blue-600",
  },
  green: {
    bg: "bg-green-500",
    glow: "shadow-green-500/50",
    hover: "bg-green-600",
  },
  orange: {
    bg: "bg-orange-500",
    glow: "shadow-orange-500/50",
    hover: "bg-orange-600",
  },
  yellow: {
    bg: "bg-yellow-500",
    glow: "shadow-yellow-500/50",
    hover: "bg-yellow-600",
  },
  cyan: {
    bg: "bg-cyan-500",
    glow: "shadow-cyan-500/50",
    hover: "bg-cyan-600",
  },
  red: {
    bg: "bg-red-500",
    glow: "shadow-red-500/50",
    hover: "bg-red-600",
  },
  purple: {
    bg: "bg-purple-500",
    glow: "shadow-purple-500/50",
    hover: "bg-purple-600",
  },
};

export function AnimatedChartBar({
  height,
  color,
  delay,
  animate,
  isActive,
}: AnimatedChartBarProps) {
  const [currentHeight, setCurrentHeight] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setCurrentHeight(height);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setCurrentHeight(height);
    }
  }, [height, delay, animate]);

  const colors = colorMap[color];

  return (
    <div
      className={cn(
        "w-full min-w-[3px] max-w-[5px] rounded-full transition-all duration-500 ease-out cursor-pointer relative",
        colors.bg,
        isHovered && colors.hover,
        isActive && `shadow-lg ${colors.glow}`,
        animate && "hover:scale-110",
      )}
      style={{
        height: `${Math.max(2, currentHeight)}px`,
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated glow effect */}
      {isActive && (
        <div
          className={cn(
            "absolute inset-0 rounded-full animate-pulse",
            colors.bg,
            "opacity-75",
          )}
        />
      )}
    </div>
  );
}

interface AnimatedMiniChartProps {
  data: number[];
  color: "blue" | "green" | "orange" | "yellow" | "cyan" | "red" | "purple";
  className?: string;
  animate?: boolean;
  showTooltip?: boolean;
}

export function AnimatedMiniChart({
  data,
  color,
  className,
  animate = false,
  showTooltip = true,
}: AnimatedMiniChartProps) {
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const maxValue = Math.max(...data);
  const maxHeight = 48; // 48px max height

  const processedData = data.map((value, index) => ({
    value,
    height: Math.max(4, (value / maxValue) * maxHeight),
    delay: index * 50, // Staggered animation
  }));

  return (
    <div className={cn("relative w-full max-w-chart-sm", className)}>
      <div className="flex h-12 items-end gap-1 p-1 sm:h-14 sm:gap-1.5">
        {processedData.map((item, index) => (
          <div
            key={index}
            className="group relative min-w-0 flex-1"
            onMouseEnter={() => setActiveBar(index)}
            onMouseLeave={() => setActiveBar(null)}
          >
            <AnimatedChartBar
              height={item.height}
              color={color}
              delay={item.delay}
              animate={mounted && animate}
              isActive={activeBar === index}
            />

            {/* Tooltip */}
            {showTooltip && activeBar === index && (
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 duration-200 animate-in fade-in-0 zoom-in-95">
                <div className="whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-caption text-white">
                  {item.value.toLocaleString()}
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Animated baseline */}
      <div
        className={cn(
          "h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50 transition-opacity duration-300",
          animate && "opacity-100",
        )}
      />
    </div>
  );
}

interface InteractiveLineChartProps {
  data: number[];
  color: "blue" | "green" | "orange" | "yellow" | "cyan" | "red" | "purple";
  width?: number;
  height?: number;
  className?: string;
  animate?: boolean;
}

export function InteractiveLineChart({
  data,
  color,
  width = 120,
  height = 40,
  className,
  animate = false,
}: InteractiveLineChartProps) {
  const [pathLength, setPathLength] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return { x, y, value };
  });

  const pathData = points.reduce((path, point, index) => {
    return index === 0
      ? `M ${point.x} ${point.y}`
      : `${path} L ${point.x} ${point.y}`;
  }, "");

  const colors = colorMap[color];

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setPathLength(1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height} className="overflow-visible">
        {/* Background gradient */}
        <defs>
          <linearGradient
            id={`gradient-${color}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor={`var(--${color}-500)`}
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor={`var(--${color}-500)`}
              stopOpacity="0.1"
            />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
          fill={`url(#gradient-${color})`}
          className={cn(
            "transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-50",
          )}
        />

        {/* Main line */}
        <path
          d={pathData}
          fill="none"
          stroke={`var(--${color}-500)`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "transition-all duration-300",
            isHovered && "drop-shadow-sm",
          )}
          style={{
            strokeDasharray: animate ? pathLength * 200 : "none",
            strokeDashoffset: animate ? (1 - pathLength) * 200 : 0,
            transition: animate ? "stroke-dashoffset 1s ease-out" : "none",
          }}
        />

        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={isHovered ? "3" : "2"}
            fill={`var(--${color}-500)`}
            className={cn(
              "transition-all duration-200",
              isHovered && `drop-shadow-sm ${colors.glow}`,
            )}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
