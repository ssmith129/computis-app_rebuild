import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RuleEngineTable } from "./rule-engine-table";
import { CreateRuleModal } from "./create-rule-modal";
import { RuleConflicts } from "./rule-conflicts";
import { Plus, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function RuleEngineContent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const ruleTabs = ["All", "Merge", "Income", "Expense", "Split"];

  return (
    <div className="app-content">
      {/* Sticky page header */}
      <div className="page-titlebar">
        <div className="p-6">
          <div className="space-y-1">
            <h1 className="text-display-lg font-bold text-foreground">
              Rule Engine
            </h1>
            <p className="text-muted-foreground">
              Configure and manage rules to classify and merge transactions
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            {/* Rule Type Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-auto"
            >
              <TabsList className="grid w-full grid-cols-5">
                {ruleTabs.map((tab) => (
                  <TabsTrigger key={tab} value={tab} className="text-body-md">
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: "Audit log coming soon" })}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Audit Log
              </Button>
              <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Rule
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Active Rules Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Rules</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <RuleEngineTable activeTab={activeTab} />
          </CardContent>
        </Card>

        {/* Rule Conflicts */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-heading-lg font-semibold">Rule Conflicts</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-auto p-0"
            >
              View All
            </Button>
          </div>
          <RuleConflicts />
        </Card>
      </div>

      {/* Create Rule Modal */}
      <CreateRuleModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
