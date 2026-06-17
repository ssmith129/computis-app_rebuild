import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { WalletIngestionTabs } from "./wallet-ingestion-tabs";
import { UploadArea } from "./upload-area";
import { SupportedExchanges } from "./supported-exchanges";
import { RecentUploads } from "./recent-uploads";
import { ValidationStep } from "./validation-step";
import { SchemaMappingStep } from "./schema-mapping-step";
import { ReviewImportStep } from "./review-import-step";

interface UploadedFile {
  name: string;
  size: number;
  uploadDate: string;
  status: "uploaded" | "validated" | "mapped" | "imported";
}

export function WalletIngestionContent() {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  // Create placeholder file data when user clicks on validation tabs without uploading
  useEffect(() => {
    if (
      (activeTab === "validate" ||
        activeTab === "mapping" ||
        activeTab === "review") &&
      !uploadedFile
    ) {
      setUploadedFile({
        name: "sample-transactions.csv",
        size: 87552, // ~85.4 KB
        uploadDate: new Date().toISOString(),
        status: "uploaded",
      });
    }
  }, [activeTab, uploadedFile]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleValidationNext = () => {
    if (uploadedFile) {
      setUploadedFile({ ...uploadedFile, status: "validated" });
    }
    setActiveTab("mapping");
  };

  const handleMappingNext = () => {
    if (uploadedFile) {
      setUploadedFile({ ...uploadedFile, status: "mapped" });
    }
    setActiveTab("review");
  };

  const handleMappingBack = () => {
    setActiveTab("validate");
  };

  const handleReviewBack = () => {
    setActiveTab("mapping");
  };

  const handleImport = () => {
    if (uploadedFile) {
      setUploadedFile({ ...uploadedFile, status: "imported" });
    }
    // Could redirect to transactions page or show success message
    console.log("Import completed successfully!");
  };

  const handleReprocess = () => {
    // Reset file status and regenerate validation
    if (uploadedFile) {
      setUploadedFile({ ...uploadedFile, status: "uploaded" });
    }
  };

  return (
    <div className="app-content">
      {/* Header */}
      <div className="page-titlebar">
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/wallets">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="space-y-1">
              <h1 className="text-display-lg font-bold text-foreground">
                Wallet Ingestion
              </h1>
              <p className="text-muted-foreground">
                Upload, validate, and map CSV data for seamless integration
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-6">
          <WalletIngestionTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {activeTab === "upload" && (
            <>
              <UploadArea />
              <SupportedExchanges />
              <RecentUploads />
            </>
          )}
          {activeTab === "validate" && uploadedFile && (
            <ValidationStep
              fileName={uploadedFile.name}
              onNext={handleValidationNext}
              onReprocess={handleReprocess}
            />
          )}
          {activeTab === "mapping" && uploadedFile && (
            <SchemaMappingStep
              fileName={uploadedFile.name}
              onNext={handleMappingNext}
              onBack={handleMappingBack}
            />
          )}
          {activeTab === "review" && uploadedFile && (
            <ReviewImportStep
              fileName={uploadedFile.name}
              onBack={handleReviewBack}
              onImport={handleImport}
            />
          )}
        </div>
      </div>
    </div>
  );
}
