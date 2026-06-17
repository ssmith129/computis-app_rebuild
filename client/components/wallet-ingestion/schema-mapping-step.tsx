import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";

interface SchemaMappingStepProps {
  fileName: string;
  onNext: () => void;
  onBack: () => void;
}

const detectedColumns = [
  { original: "Date", suggested: "date", confidence: "high", required: true },
  {
    original: "Transaction Type",
    suggested: "type",
    confidence: "high",
    required: true,
  },
  { original: "Asset", suggested: "asset", confidence: "high", required: true },
  {
    original: "Amount",
    suggested: "amount",
    confidence: "high",
    required: true,
  },
  {
    original: "Price USD",
    suggested: "price_usd",
    confidence: "medium",
    required: false,
  },
  { original: "Fee", suggested: "fee", confidence: "medium", required: false },
  {
    original: "Exchange",
    suggested: "exchange",
    confidence: "high",
    required: false,
  },
  {
    original: "Transaction ID",
    suggested: "tx_id",
    confidence: "low",
    required: false,
  },
];

const standardFields = [
  "date",
  "type",
  "asset",
  "amount",
  "price_usd",
  "fee",
  "exchange",
  "tx_id",
  "wallet_address",
  "notes",
  "ignore",
];

export function SchemaMappingStep({
  fileName,
  onNext,
  onBack,
}: SchemaMappingStepProps) {
  const [mappings, setMappings] = useState<Record<string, string>>(
    detectedColumns.reduce(
      (acc, col) => ({
        ...acc,
        [col.original]: col.suggested,
      }),
      {},
    ),
  );

  const handleMappingChange = (originalColumn: string, newMapping: string) => {
    setMappings((prev) => ({
      ...prev,
      [originalColumn]: newMapping,
    }));
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case "high":
        return <Badge className="bg-green-100 text-green-800">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-red-100 text-red-800">Low</Badge>;
      default:
        return <Badge variant="outline">{confidence}</Badge>;
    }
  };

  const requiredFieldsMapped = detectedColumns
    .filter((col) => col.required)
    .every(
      (col) => mappings[col.original] && mappings[col.original] !== "ignore",
    );

  return (
    <div className="space-y-6">
      {/* File Info Header */}
      <div className="rounded-lg bg-muted/50 p-4">
        <div className="flex items-center gap-3">
          <FileText className="size-5 text-muted-foreground" />
          <div>
            <h3 className="font-medium">{fileName}</h3>
            <p className="text-body-md text-muted-foreground">
              Map your CSV columns to our standard schema
            </p>
          </div>
        </div>
      </div>

      {/* Mapping Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="mb-1 text-heading-lg font-semibold">Schema Mapping</h3>
          <div className="flex items-center gap-2">
            {requiredFieldsMapped ? (
              <CheckCircle className="size-4 text-green-500" />
            ) : (
              <AlertTriangle className="size-4 text-yellow-500" />
            )}
            <p className="text-body-md text-muted-foreground">
              {requiredFieldsMapped
                ? "All required fields mapped successfully"
                : "Please map all required fields to continue"}
            </p>
          </div>
        </div>
      </div>

      {/* Schema Mapping Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-heading-md">Column Mapping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {detectedColumns.map((column, index) => (
            <div key={column.original}>
              <div className="flex items-center gap-4 py-3">
                {/* Original Column */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-body-md font-medium">
                      {column.original}
                    </span>
                    {column.required && (
                      <Badge variant="outline" className="text-caption">
                        Required
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-caption text-muted-foreground">
                      Confidence:
                    </span>
                    {getConfidenceBadge(column.confidence)}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />

                {/* Mapped Field */}
                <div className="flex-1">
                  <Select
                    value={mappings[column.original] || ""}
                    onValueChange={(value) =>
                      handleMappingChange(column.original, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mapping..." />
                    </SelectTrigger>
                    <SelectContent>
                      {standardFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field === "ignore"
                            ? "Ignore this column"
                            : field.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {index < detectedColumns.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sample Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-heading-md">Sample Data Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-4 border-b pb-2 text-caption font-medium text-muted-foreground">
              <span>Original</span>
              <span>Mapped</span>
              <span>Sample Value</span>
              <span>Status</span>
            </div>
            {detectedColumns.slice(0, 4).map((column) => (
              <div
                key={column.original}
                className="grid grid-cols-4 gap-4 py-2 text-body-md"
              >
                <span className="font-medium">{column.original}</span>
                <span className="text-muted-foreground">
                  {mappings[column.original] || "Not mapped"}
                </span>
                <span className="text-muted-foreground">
                  {column.original === "Date" && "2023-12-01"}
                  {column.original === "Transaction Type" && "Buy"}
                  {column.original === "Asset" && "BTC"}
                  {column.original === "Amount" && "0.05"}
                </span>
                <div>
                  {mappings[column.original] &&
                  mappings[column.original] !== "ignore" ? (
                    <CheckCircle className="size-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="size-4 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back to Validation
        </Button>
        <Button
          onClick={onNext}
          disabled={!requiredFieldsMapped}
          className="flex-1"
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
}
