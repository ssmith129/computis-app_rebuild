import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, X, ArrowRight, Trash2 } from "lucide-react";

interface CreateRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface Action {
  id: string;
  type: string;
  classification?: string;
  tags?: string[];
  status?: string;
}

export function CreateRuleModal({ open, onOpenChange }: CreateRuleModalProps) {
  const [ruleName, setRuleName] = useState("BTC Mining Income");
  const [ruleType, setRuleType] = useState("Merge");
  const [priority, setPriority] = useState("Low");
  const [logicalOperator, setLogicalOperator] = useState("AND");

  const [conditions, setConditions] = useState<Condition[]>([
    { id: "1", field: "Transaction", operator: "equals", value: "Receive" },
    {
      id: "2",
      field: "Transaction",
      operator: "equals",
      value: "Bitcoin (BTC)",
    },
    { id: "3", field: "Transaction", operator: "equals", value: "mining-pool" },
  ]);

  const [actions, setActions] = useState<Action[]>([
    { id: "1", type: "Set Classification", classification: "Transfer" },
    {
      id: "2",
      type: "Set Classification",
      classification: "Mining",
      tags: ["Income"],
    },
    { id: "3", type: "Set Classification", status: "Pending" },
  ]);

  const addCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: "Transaction",
      operator: "equals",
      value: "",
    };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const updateCondition = (id: string, updates: Partial<Condition>) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  };

  const addAction = () => {
    const newAction: Action = {
      id: Date.now().toString(),
      type: "Set Classification",
      classification: "",
    };
    setActions([...actions, newAction]);
  };

  const removeAction = (id: string) => {
    setActions(actions.filter((a) => a.id !== id));
  };

  const updateAction = (id: string, updates: Partial<Action>) => {
    setActions(actions.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const conditionFields = [
    "Transaction",
    "Asset",
    "Amount",
    "Date",
    "Exchange",
  ];
  const operators = [
    "equals",
    "contains",
    "greater than",
    "less than",
    "starts with",
  ];
  const actionTypes = ["Set Classification", "Add Tag", "Set Status"];
  const classifications = ["Transfer", "Mining", "Income", "Expense", "Trade"];
  const statuses = ["Pending", "Confirmed", "Flagged"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Merge Rule</DialogTitle>
          <DialogDescription>
            Define conditions to automatically merge related transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Rule Info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input
                id="ruleName"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruleType">Rule Type</Label>
              <Select value={ruleType} onValueChange={setRuleType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Merge">Merge</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Split">Split</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Conditions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-heading-lg font-semibold">Conditions</h3>
                <p className="text-body-md text-muted-foreground">
                  Define when this rule should be applied
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="logicalOperator" className="text-body-md">
                  Logical Operator:
                </Label>
                <Select
                  value={logicalOperator}
                  onValueChange={setLogicalOperator}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              {conditions.map((condition) => (
                <div key={condition.id} className="flex items-center gap-3">
                  <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-3">
                    <Select
                      value={condition.field}
                      onValueChange={(value) =>
                        updateCondition(condition.id, { field: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionFields.map((field) => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={condition.operator}
                      onValueChange={(value) =>
                        updateCondition(condition.id, { operator: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map((op) => (
                          <SelectItem key={op} value={op}>
                            {op}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                      {condition.value && (
                        <Badge variant="outline" className="shrink-0">
                          {condition.value}
                          <X
                            className="ml-1 size-3 cursor-pointer"
                            onClick={() =>
                              updateCondition(condition.id, { value: "" })
                            }
                          />
                        </Badge>
                      )}
                      <Input
                        placeholder="Add value"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            updateCondition(condition.id, {
                              value: e.target.value,
                            });
                            e.target.value = "";
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.currentTarget.value) {
                            updateCondition(condition.id, {
                              value: e.currentTarget.value,
                            });
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(condition.id)}
                    className="shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={addCondition}>
              <Plus className="mr-2 size-4" />
              Add Condition
            </Button>
          </div>

          <Separator />

          {/* Actions Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-heading-lg font-semibold">Actions</h3>
              <p className="text-body-md text-muted-foreground">
                Define what happens when conditions are met
              </p>
            </div>

            <div className="space-y-3">
              {actions.map((action) => (
                <div key={action.id} className="flex items-center gap-3">
                  <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-2">
                    <Select
                      value={action.type}
                      onValueChange={(value) =>
                        updateAction(action.id, { type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {actionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                      {action.classification && (
                        <Badge className="bg-info-bg text-info-text">
                          {action.classification}
                        </Badge>
                      )}
                      {action.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-success-bg text-success-text"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {action.status && (
                        <Badge className="bg-warning-bg text-warning-text">
                          {action.status}
                        </Badge>
                      )}

                      {action.type === "Set Classification" && (
                        <Select
                          value={action.classification || ""}
                          onValueChange={(value) =>
                            updateAction(action.id, { classification: value })
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {classifications.map((cls) => (
                              <SelectItem key={cls} value={cls}>
                                {cls}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {action.type === "Set Status" && (
                        <Select
                          value={action.status || ""}
                          onValueChange={(value) =>
                            updateAction(action.id, { status: value })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAction(action.id)}
                    className="shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={addAction}>
              <Plus className="mr-2 size-4" />
              Add Action
            </Button>
          </div>

          <Separator />

          {/* Preview Impact */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-heading-lg font-semibold">
                  Preview Impact
                </h3>
                <p className="text-body-md text-muted-foreground">
                  23 transactions will be affected by this rule
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Transactions
              </Button>
            </div>

            <div className="flex flex-col items-stretch gap-4 overflow-x-auto md:flex-row md:items-center">
              {/* Before */}
              <Card className="min-w-rule-card flex-1">
                <CardHeader>
                  <CardTitle className="text-heading-md">Before</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-body-md text-muted-foreground">
                      Classification:
                    </div>
                    <div className="text-body-md">Unclassified (18)</div>
                    <div className="text-body-md">Transfer (5)</div>
                  </div>
                  <div>
                    <div className="text-body-md text-muted-foreground">
                      Tags:
                    </div>
                    <div className="text-body-md">None (23)</div>
                  </div>
                  <div>
                    <div className="text-body-md text-muted-foreground">
                      Status:
                    </div>
                    <div className="text-body-md">Pending (20)</div>
                    <div className="text-body-md">Needs Review (3)</div>
                  </div>
                </CardContent>
              </Card>

              {/* Arrow */}
              <div
                className="flex shrink-0 items-center justify-center self-center"
                aria-label="transforms to"
              >
                <ArrowRight className="size-8 text-primary" />
              </div>

              {/* After */}
              <Card className="min-w-rule-card flex-1">
                <CardHeader>
                  <CardTitle className="text-heading-md">After</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-body-md text-muted-foreground">
                      Classification:
                    </div>
                    <div className="text-body-md text-success">Income (23)</div>
                  </div>
                  <div>
                    <div className="text-body-md text-muted-foreground">
                      Tags:
                    </div>
                    <div className="text-body-md text-success">
                      Mining, Income (23)
                    </div>
                  </div>
                  <div>
                    <div className="text-body-md text-muted-foreground">
                      Status:
                    </div>
                    <div className="text-body-md text-success">
                      Confirmed (23)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
