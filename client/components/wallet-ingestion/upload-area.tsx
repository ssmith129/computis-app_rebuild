import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadArea() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) =>
        file.type === "text/csv" ||
        file.name.endsWith(".csv") ||
        file.name.endsWith(".xlsx"),
    );

    setUploadedFiles((prev) => [...prev, ...files]);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        setUploadedFiles((prev) => [...prev, ...files]);
      }
    },
    [],
  );

  return (
    <Card className="border border-border">
      <CardContent className="p-6">
        {/* Main Upload Section */}
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-warning-bg rounded-full flex items-center justify-center">
              <FileSpreadsheet className="w-8 h-8 text-warning" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Upload CSV Files
            </h2>
            <p className="text-muted-foreground mt-2">
              Drag and drop your exchange or wallet CSV files here, or click to
              browse your files
            </p>
          </div>

          {/* Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 transition-colors",
              isDragOver
                ? "border-info bg-info-bg"
                : "border-border bg-background",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Drag files here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: CSV, XLSX
                </p>
              </div>
              <div className="flex justify-center">
                <label htmlFor="file-upload">
                  <Button className="bg-warning hover:bg-warning text-black">
                    Select Files
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".csv,.xlsx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-foreground mb-3">
                Selected Files:
              </h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-muted p-2 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
