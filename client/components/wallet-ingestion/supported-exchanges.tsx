import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

const exchanges = [
  {
    name: "Coinbase",
    icon: "🪙",
    color: "text-orange-500",
  },
  {
    name: "Binance",
    icon: "🏛️",
    color: "text-blue-500",
  },
  {
    name: "Kraken",
    icon: "💳",
    color: "text-green-500",
  },
  {
    name: "Metamask",
    icon: "🦊",
    color: "text-purple-500",
  },
  {
    name: "More",
    icon: <Plus className="size-6 text-muted-foreground" />,
    color: "text-muted-foreground",
  },
];

export function SupportedExchanges() {
  return (
    <div className="space-y-4">
      <h3 className="text-heading-lg font-medium text-foreground">
        Supported Exchanges & Wallets
      </h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {exchanges.map((exchange) => (
          <Card
            key={exchange.name}
            className="cursor-pointer transition-shadow hover:shadow-md"
          >
            <CardContent className="space-y-2 p-4 text-center">
              <div className="flex justify-center">
                {typeof exchange.icon === "string" ? (
                  <span className="text-display-lg">{exchange.icon}</span>
                ) : (
                  exchange.icon
                )}
              </div>
              <p className={`text-body-md font-medium ${exchange.color}`}>
                {exchange.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
