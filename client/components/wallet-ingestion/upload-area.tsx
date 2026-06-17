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
        <div className="space-y-6 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-warning-bg">
              <FileSpreadsheet className="size-8 text-warning" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-display-sm font-bold text-foreground">
              Upload CSV Files
            </h2>
            <p className="mt-2 text-muted-foreground">
              Drag and drop your exchange or wallet CSV files here, or click to
              browse your files
            </p>
          </div>

          {/* Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 transition-colors",
              isDragOver
                ? "border-blue-400 bg-blue-50"
                : "border-border bg-background",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="size-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-body-md text-muted-foreground">
                  Drag files here or click to browse
                </p>
                <p className="text-caption text-muted-foreground">
                  Supported formats: CSV, XLSX
                </p>
              </div>
              <div className="flex justify-center">
                <label htmlFor="file-upload">
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
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
              <h3 className="mb-3 text-body-md font-medium text-foreground">
                Selected Files:
              </h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded bg-muted p-2"
                  >
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="size-4" />
                      <span className="text-body-md">{file.name}</span>
                    </div>
                    <span className="text-caption text-muted-foreground">
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
