import { MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MiniChart } from "./chart-bar";

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  changeType?: "positive" | "negative" | "neutral";
  chartData: number[];
  chartColor: "blue" | "green" | "orange" | "yellow" | "cyan" | "red";
}

export function DashboardCard({
  title,
  value,
  change,
  changeType = "neutral",
  chartData,
  chartColor,
}: DashboardCardProps) {
  const changeColorClass = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-muted-foreground",
  }[changeType];

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          aria-label="Card options"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-lg font-bold text-foreground">{value}</div>
          <div className={`text-xs ${changeColorClass}`}>{change}</div>
        </div>

        <MiniChart data={chartData} color={chartColor} />
      </div>
    </Card>
  );
}

export function DashboardCards() {
  const cardsData = [
    {
      title: "Transactions",
      value: "122,124",
      change: "+ 2,122",
      changeType: "positive" as const,
      chartData: [9, 16, 9, 4, 8, 23, 29, 12, 16, 2],
      chartColor: "blue" as const,
    },
    {
      title: "Unmatched Txs",
      value: "125",
      change: "- 14",
      changeType: "positive" as const,
      chartData: [17, 25, 21, 17, 9, 17, 13, 27, 32, 25],
      chartColor: "green" as const,
    },
    {
      title: "Commented Txs",
      value: "15",
      change: "+ 2",
      changeType: "positive" as const,
      chartData: [9, 8, 26, 4, 24, 16, 11, 32, 16, 7],
      chartColor: "orange" as const,
    },
    {
      title: "Accounts",
      value: "194",
      change: "No Updates",
      changeType: "neutral" as const,
      chartData: [17, 31, 13, 17, 15, 25, 17, 8, 27, 32],
      chartColor: "yellow" as const,
    },
    {
      title: "Failed Txs",
      value: "27",
      change: "- 21",
      changeType: "positive" as const,
      chartData: [17, 9, 15, 17, 25, 28, 21, 27, 17, 21],
      chartColor: "cyan" as const,
    },
    {
      title: "Wallets and Exchanges",
      value: "187",
      change: "+ 3",
      changeType: "positive" as const,
      chartData: [17, 17, 25, 21, 17, 32, 9, 17, 13, 27],
      chartColor: "red" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardsData.slice(0, 3).map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardsData.slice(3).map((card, index) => (
          <DashboardCard key={index + 3} {...card} />
        ))}
      </div>
    </div>
  );
}
