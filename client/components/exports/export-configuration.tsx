import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConfigOption {
  id: string;
  label: string;
  checked: boolean;
}

export function ExportConfiguration() {
  const [dataInclusion, setDataInclusion] = useState<ConfigOption[]>([
    {
      id: "all-transactions",
      label: "Include all transactions",
      checked: true,
    },
    {
      id: "confirmed-only",
      label: "Include confirmed transactions only",
      checked: true,
    },
    { id: "audit-trail", label: "Include audit trail data", checked: true },
    {
      id: "ai-confidence",
      label: "Include AI confidence scores",
      checked: true,
    },
    { id: "fmv-source", label: "Include FMV source data", checked: true },
  ]);

  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [numberFormat, setNumberFormat] = useState("1,234.56");
  const [classificationMapping, setClassificationMapping] = useState(
    "Standard IRS Categories",
  );

  const handleDataInclusionChange = (id: string, checked: boolean) => {
    setDataInclusion((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked } : item)),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-heading-lg font-semibold mb-1">
          Export Configuration
        </h3>
        <p className="text-body-md text-muted-foreground">
          Customize your export settings
        </p>
      </div>

      {/* Data Inclusion */}
      <div className="space-y-4">
        <div>
          <Label className="text-heading-md font-medium">Data Inclusion</Label>
          <p className="text-body-md text-muted-foreground">
            Select which data to include in exports
          </p>
        </div>

        <div className="space-y-3">
          {dataInclusion.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={option.checked}
                onCheckedChange={(checked) =>
                  handleDataInclusionChange(option.id, !!checked)
                }
              />
              <Label
                htmlFor={option.id}
                className="text-body-md font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Export Format Options */}
      <div className="space-y-4">
        <div>
          <Label className="text-heading-md font-medium">
            Export Format Options
          </Label>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Date Format */}
          <div className="space-y-2">
            <Label htmlFor="date-format" className="text-body-md">
              Date Format
            </Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                <SelectItem value="ISO 8601">ISO 8601</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Number Format */}
          <div className="space-y-2">
            <Label htmlFor="number-format" className="text-body-md">
              Number Format
            </Label>
            <Select value={numberFormat} onValueChange={setNumberFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1,234.56">1,234.56 (US)</SelectItem>
                <SelectItem value="1.234,56">1.234,56 (EU)</SelectItem>
                <SelectItem value="1 234.56">1 234.56 (FR)</SelectItem>
                <SelectItem value="1234.56">1234.56 (Plain)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Classification Mapping */}
          <div className="space-y-2">
            <Label htmlFor="classification-mapping" className="text-body-md">
              Classification Mapping
            </Label>
            <Select
              value={classificationMapping}
              onValueChange={setClassificationMapping}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard IRS Categories">
                  Standard IRS Categories
                </SelectItem>
                <SelectItem value="Custom Mapping">Custom Mapping</SelectItem>
                <SelectItem value="QuickBooks Chart">
                  QuickBooks Chart
                </SelectItem>
                <SelectItem value="TaxAct Format">TaxAct Format</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Save Configuration */}
      <div className="pt-4 border-t">
        <Button
          size="sm"
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
