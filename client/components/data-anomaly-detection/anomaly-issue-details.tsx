import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  ArrowLeft,
  ExternalLink,
  Download,
  Plus,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface AnomalyIssueDetailsProps {
  issueId: string;
  onClose: () => void;
}

const issueData = {
  type: "Volume Spike",
  detected: "Oct 25, 2023",
  priority: "High",
  status: "Open",
  asset: "Bitcoin (BTC)",
  affected: "15 transactions",
  description:
    "This appears to be a legitimate set of transactions based on historical patterns for this wallet.",
  suggestion: "Mark as resolved after confirming with client.",
  confidence: 85,
};

const affectedTransactions = [
  {
    id: "1",
    date: "2022-08-14 09:15",
    type: "Receive",
    amount: "0.15 BTC",
    fmv: "$3,750.00",
    classification: "Income",
  },
  {
    id: "2",
    date: "2022-08-14 09:22",
    type: "Receive",
    amount: "0.25 BTC",
    fmv: "$6,250.00",
    classification: "Income",
  },
  {
    id: "3",
    date: "2022-08-14 10:05",
    type: "Receive",
    amount: "0.10 BTC",
    fmv: "$2,500.00",
    classification: "Income",
  },
  {
    id: "4",
    date: "2022-08-14 11:30",
    type: "Receive",
    amount: "0.08 BTC",
    fmv: "$2,000.00",
    classification: "Income",
  },
  {
    id: "5",
    date: "2022-08-14 14:20",
    type: "Receive",
    amount: "0.12 BTC",
    fmv: "$3,000.00",
    classification: "Income",
  },
];

const quickActions = [
  {
    title: "Bulk Classify",
    description: "Apply classification to all",
    icon: Plus,
    color: "text-success bg-success-bg hover:bg-success-bg/80",
  },
  {
    title: "Create Rule",
    description: "Avoid future issues",
    icon: Plus,
    color: "text-info bg-info-bg hover:bg-info-bg/80",
  },
  {
    title: "Update FMV",
    description: "Fix calculations",
    icon: RotateCcw,
    color: "text-amber-600 bg-amber-50 hover:bg-amber-100",
  },
  {
    title: "Export",
    description: "CSV or PDF",
    icon: Download,
    color: "text-purple-600 bg-purple-50 hover:bg-purple-100",
  },
];

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-error-bg text-error-text border-error/30";
    case "Medium":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Low":
      return "bg-info-bg text-info-text border-info/30";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-warning-bg text-warning-text border-warning/30";
    case "In Progress":
      return "bg-info-bg text-info-text border-info/30";
    case "Resolved":
      return "bg-success-bg text-success-text border-success/30";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export function AnomalyIssueDetails({
  issueId,
  onClose,
}: AnomalyIssueDetailsProps) {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(affectedTransactions.length / itemsPerPage);
  const paginatedTransactions = affectedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleResolve = () => {
    toast({
      title: "Issue Resolved",
      description: "Volume spike marked as resolved successfully.",
    });
    onClose();
  };

  const handleIgnore = () => {
    toast({
      title: "Issue Ignored",
      description: "This anomaly will be hidden from the list.",
    });
    onClose();
  };

  const handleApplyRecommendation = () => {
    toast({
      title: "Recommendation Applied",
      description:
        "AI suggestion has been implemented for all affected transactions.",
      duration: 3000,
    });
  };

  return (
    <div className="app-content">
      {/* Sticky Header with Actions */}
      <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onClose} className="h-9">
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-error-bg rounded-lg p-2">
                <TrendingUp className="h-5 w-5 text-error" />
              </div>
              <div>
                <h1 className="text-display-sm font-semibold text-gray-900 flex items-center gap-2">
                  Volume Spike Details
                </h1>
                <p className="text-body-md text-gray-500">
                  15 transactions • Bitcoin (BTC)
                </p>
              </div>
            </div>
          </div>

          {/* Primary Actions - Sticky */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleIgnore}
              className="h-9 border-gray-300 hover:bg-gray-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Ignore Issue
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleApplyRecommendation}
              className="h-9 w-fit bg-primary hover:bg-primary-hover text-white"
              aria-label="Apply AI recommendation"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Apply Recommendation
            </Button>
            <Button
              size="sm"
              onClick={handleResolve}
              className="h-9 bg-success hover:bg-success/90 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Resolved
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          {/* Issue Information Card - 25% on desktop */}
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 px-5 pt-5">
              <CardTitle className="text-heading-md font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-600" />
                Issue Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              <div className="space-y-1.5">
                <div className="text-caption font-medium text-gray-500 uppercase tracking-wide">
                  Type
                </div>
                <div className="text-body-md font-semibold text-gray-900">
                  {issueData.type}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-caption font-medium text-gray-500 uppercase tracking-wide">
                  Detected
                </div>
                <div className="text-body-md text-gray-700">
                  {issueData.detected}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-caption font-medium text-gray-500 uppercase tracking-wide">
                  Priority
                </div>
                <Badge
                  className={`border text-caption font-medium ${getPriorityStyles(issueData.priority)}`}
                >
                  {issueData.priority}
                </Badge>
              </div>
              <div className="space-y-1.5">
                <div className="text-caption font-medium text-gray-500 uppercase tracking-wide">
                  Status
                </div>
                <Badge
                  className={`border text-caption font-medium ${getStatusStyles(issueData.status)}`}
                >
                  {issueData.status}
                </Badge>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-caption text-gray-500">Affected</div>
                  <div className="text-body-md font-semibold text-gray-900">
                    {issueData.affected}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-caption text-gray-500">Asset</div>
                  <div className="text-body-md font-medium text-gray-900">
                    {issueData.asset}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendation Card - 25% on desktop */}
          <Card className="border-blue-200 shadow-sm bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 px-5 pt-5">
              <CardTitle className="text-heading-md font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              <div>
                <div className="text-caption font-medium text-gray-600 mb-1.5">
                  Analysis
                </div>
                <p className="text-body-md text-gray-700 leading-relaxed">
                  {issueData.description}
                </p>
              </div>
              <div>
                <div className="text-caption font-medium text-gray-600 mb-1.5">
                  Suggested Action
                </div>
                <p className="text-body-md text-gray-700 leading-relaxed">
                  {issueData.suggestion}
                </p>
              </div>
              <div className="pt-3 border-t border-blue-100">
                <div className="flex items-center justify-between">
                  <span className="text-caption font-medium text-gray-600">
                    Confidence Score
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success rounded-full transition-all"
                        style={{ width: `${issueData.confidence}%` }}
                      />
                    </div>
                    <span className="text-body-md font-bold text-gray-900">
                      {issueData.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card - 50% on desktop, spans 2 columns */}
          <Card className="md:col-span-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 px-5 pt-5">
              <CardTitle className="text-heading-md font-semibold text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={index}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 transition-all hover:scale-105 hover:shadow-md ${action.color.split(" ")[1]} ${action.color.split(" ")[2]}`}
                      onClick={() =>
                        toast({ title: `${action.title} initiated` })
                      }
                      aria-label={action.title}
                    >
                      <IconComponent
                        className={`h-5 w-5 ${action.color.split(" ")[0]}`}
                      />
                      <div className="text-center">
                        <div className="text-caption font-semibold text-gray-900">
                          {action.title}
                        </div>
                        <div className="text-caption text-gray-500 mt-0.5">
                          {action.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Affected Transactions - Full Width */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="px-5 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-heading-md font-semibold text-gray-900">
                  Affected Transactions
                </CardTitle>
                <p className="text-body-md text-gray-500 mt-1">
                  Showing {paginatedTransactions.length} of{" "}
                  {affectedTransactions.length} transactions
                </p>
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <ExternalLink className="h-4 w-4 mr-2" />
                Export List
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-caption font-semibold text-gray-600 px-5">
                      Date
                    </TableHead>
                    <TableHead className="text-caption font-semibold text-gray-600">
                      Type
                    </TableHead>
                    <TableHead className="text-caption font-semibold text-gray-600">
                      Amount
                    </TableHead>
                    <TableHead className="text-caption font-semibold text-gray-600">
                      FMV (USD)
                    </TableHead>
                    <TableHead className="text-caption font-semibold text-gray-600">
                      Classification
                    </TableHead>
                    <TableHead className="text-caption font-semibold text-gray-600 text-right px-5">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-body-md text-gray-900 px-5">
                        {transaction.date}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-info-bg text-info-text border-info/30 border text-caption">
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-body-md font-semibold text-gray-900">
                        {transaction.amount}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-success-bg text-success-text border-success/30 border text-caption">
                          {transaction.fmv}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-warning-bg text-warning-text border-warning/30 border text-caption">
                          {transaction.classification}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                          aria-label="View transaction details"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-9"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-9 w-9 p-0"
                    >
                      {page}
                    </Button>
                  ),
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="h-9"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
