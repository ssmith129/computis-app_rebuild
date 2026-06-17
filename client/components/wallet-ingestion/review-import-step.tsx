import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Upload,
  Clock,
  Database,
} from "lucide-react";

interface ReviewImportStepProps {
  fileName: string;
  onBack: () => void;
  onImport: () => void;
}

const sampleTransactions = [
  {
    date: "2023-12-01",
    type: "Buy",
    asset: "BTC",
    amount: "0.05000000",
    price_usd: "$42,500.00",
    fee: "$12.50",
    exchange: "Coinbase",
  },
  {
    date: "2023-12-02",
    type: "Sell",
    asset: "ETH",
    amount: "2.50000000",
    price_usd: "$2,150.00",
    fee: "$8.75",
    exchange: "Binance",
  },
  {
    date: "2023-12-03",
    type: "Transfer",
    asset: "USDC",
    amount: "1,000.00000000",
    price_usd: "$1.00",
    fee: "$2.00",
    exchange: "MetaMask",
  },
];

const importSettings = [
  {
    id: "duplicate-detection",
    label: "Enable duplicate transaction detection",
    description: "Automatically identify and merge duplicate transactions",
    checked: true,
  },
  {
    id: "auto-classification",
    label: "Apply automatic classification rules",
    description: "Use AI to classify transactions based on existing rules",
    checked: true,
  },
  {
    id: "price-validation",
    label: "Validate pricing data",
    description: "Cross-reference prices with market data sources",
    checked: true,
  },
  {
    id: "notification",
    label: "Send completion notification",
    description: "Notify when import process is complete",
    checked: false,
  },
];

export function ReviewImportStep({
  fileName,
  onBack,
  onImport,
}: ReviewImportStepProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [settings, setSettings] = useState(
    importSettings.reduce(
      (acc, setting) => ({
        ...acc,
        [setting.id]: setting.checked,
      }),
      {},
    ),
  );

  const handleSettingChange = (settingId: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [settingId]: checked,
    }));
  };

  const handleImport = () => {
    setIsImporting(true);
    setImportProgress(0);

    // Simulate import progress
    intervalRef.current = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsImporting(false);
          // Use setTimeout to avoid setState during render warning
          setTimeout(() => {
            onImport();
          }, 0);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* File Info Header */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-medium">{fileName}</h3>
            <p className="text-sm text-muted-foreground">
              Ready for import • 1,247 transactions
            </p>
          </div>
        </div>
      </div>

      {/* Review Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">Review & Import</h3>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <p className="text-sm text-muted-foreground">
              Data validated and mapped successfully
            </p>
          </div>
        </div>
      </div>

      {/* Import Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Import Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold font-mono tabular-nums text-success">
                1,247
              </div>
              <div className="text-sm text-muted-foreground">
                Total Transactions
              </div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold font-mono tabular-nums text-primary">
                8
              </div>
              <div className="text-sm text-muted-foreground">Assets</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold font-mono tabular-nums text-category-purple">
                4
              </div>
              <div className="text-sm text-muted-foreground">Exchanges</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold font-mono tabular-nums text-chart-orange">
                365
              </div>
              <div className="text-sm text-muted-foreground">Days Range</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sample Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
              <span>Date</span>
              <span>Type</span>
              <span>Asset</span>
              <span>Amount</span>
              <span>Price</span>
              <span>Fee</span>
              <span>Exchange</span>
            </div>
            {sampleTransactions.map((tx, index) => (
              <div key={index} className="grid grid-cols-7 gap-2 text-sm py-2">
                <span>{tx.date}</span>
                <Badge variant="outline" className="text-xs w-fit">
                  {tx.type}
                </Badge>
                <span className="font-medium">{tx.asset}</span>
                <span>{tx.amount}</span>
                <span>{tx.price_usd}</span>
                <span>{tx.fee}</span>
                <span className="text-muted-foreground">{tx.exchange}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Import Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Import Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {importSettings.map((setting, index) => (
            <div key={setting.id}>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={setting.id}
                  checked={settings[setting.id] || false}
                  onCheckedChange={(checked) =>
                    handleSettingChange(setting.id, !!checked)
                  }
                  className="mt-1"
                />
                <div className="space-y-1">
                  <label
                    htmlFor={setting.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {setting.label}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
              </div>
              {index < importSettings.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Import Progress */}
      {isImporting && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Importing Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing transactions...</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} className="h-2" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Estimated time remaining:{" "}
                {Math.max(0, Math.ceil((100 - importProgress) / 10))} seconds
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} disabled={isImporting}>
          Back to Mapping
        </Button>
        <Button
          onClick={handleImport}
          disabled={isImporting}
          className="flex-1"
        >
          {isImporting ? (
            <>
              <Database className="h-4 w-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Start Import
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
