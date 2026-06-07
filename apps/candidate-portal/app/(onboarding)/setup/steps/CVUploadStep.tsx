"use client";

import { useCallback, useState } from "react";

import { CheckCircle, FileText, Loader2, Sparkles, Upload, X } from "lucide-react";

import type { CV } from "@repo/shared-types";
import { Button, Card, CardContent, LinkedInIcon, cn } from "@repo/ui";

import apiFetch from "@/lib/apiFetch";
import clientEnv from "@/lib/clientEnv";

interface CVUploadStepProps {
  onDataExtracted: (data: Partial<CV>) => void;
  onNext: () => void;
  isLinkedIn?: boolean;
}

const CVUploadStep = ({ onDataExtracted, onNext, isLinkedIn }: CVUploadStepProps) => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isComplete, setIsComplete] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (f: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(f.type)) {
      setError("Please upload a PDF or DOCX file");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    setFile(f);
    setError(undefined);
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const submitRes = await apiFetch("/api/cv/parse", { method: "POST", body: formData });
      if (!submitRes.ok) throw new Error("Failed to submit CV");

      const { jobId } = (await submitRes.json()) as { jobId: string };
      setProgress(20);

      const cv = await pollForResult(jobId);
      setProgress(100);
      setIsComplete(true);
      onDataExtracted(cv);

      setTimeout(() => {
        onNext();
      }, 1000);
    } catch {
      setError("Failed to process your CV. Please try again.");
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const pollForResult = async (jobId: string): Promise<Partial<CV>> => {
    const MAX_ATTEMPTS = clientEnv.cvParseMaxAttempts;
    const INTERVAL_MS = clientEnv.cvParseIntervalMs;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));

      const res = await apiFetch(`/api/cv/parse/status/${jobId}`);
      if (!res.ok) throw new Error("Failed to poll CV parse status");

      const data = (await res.json()) as { status: string; result?: Partial<CV>; error?: string };

      if (data.status === "done" && data.result) {
        return data.result;
      }
      if (data.status === "failed") {
        throw new Error(data.error ?? "CV parse failed");
      }

      const progressStep = 100 / MAX_ATTEMPTS;
      setProgress(Math.min(20 + Math.round((attempt + 1) * progressStep), 90));
    }

    throw new Error("CV processing timed out");
  };

  const removeFile = () => {
    setFile(undefined);
    setError(undefined);
    setProgress(0);
    setIsComplete(false);
  };

  const getStage = (pct: number): { label: string; stage: number } => {
    if (pct <= 25) return { label: "Uploading file…", stage: 0 };
    if (pct <= 50) return { label: "Reading document…", stage: 1 };
    if (pct <= 75) return { label: "Extracting experience & skills…", stage: 2 };
    return { label: "Finalising your profile…", stage: 3 };
  };

  if (isLinkedIn) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="space-y-6 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-[#0A66C2]/10">
            <LinkedInIcon size={32} />
          </div>
          <div>
            <h3 className="text-foreground mb-2 text-xl font-semibold">Import from LinkedIn</h3>
            <p className="text-muted-foreground">
              We&apos;ll use your LinkedIn profile data to generate a professional CV
            </p>
          </div>
          <Button size="lg" className="w-full max-w-xs">
            Connect LinkedIn
          </Button>
          <p className="text-muted-foreground text-xs">
            We only read your public profile information
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardContent className="p-8">
        {!file ? (
          <div
            className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="bg-muted mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl">
              <Upload className="text-muted-foreground h-7 w-7" />
            </div>
            <h3 className="text-foreground mb-2 text-lg font-semibold">Upload your CV</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your file here, or click to browse
            </p>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="cv-upload"
            />
            <label htmlFor="cv-upload">
              <Button variant="outline" asChild>
                <span>Browse Files</span>
              </Button>
            </label>
            <p className="text-muted-foreground mt-4 text-xs">
              Supports PDF and DOCX files up to 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-muted/50 flex items-center gap-4 rounded-lg p-4">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <FileText className="text-primary h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate font-medium">{file.name}</p>
                <p className="text-muted-foreground text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!isProcessing && !isComplete && (
                <Button variant="ghost" size="icon" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              )}
              {isComplete && <CheckCircle className="text-success h-6 w-6" />}
            </div>

            {isProcessing && (
              <div className="space-y-3">
                <style>{`
                  @keyframes shimmer {
                    0% { background-position: 200% center; }
                    100% { background-position: -200% center; }
                  }
                  .animate-shimmer {
                    animation: shimmer 1.8s linear infinite;
                  }
                `}</style>

                <div className="flex items-center gap-2">
                  <Sparkles className="text-primary h-4 w-4 animate-pulse" />
                  <span className="text-muted-foreground text-sm transition-all duration-500">
                    {getStage(progress).label}
                  </span>
                </div>

                <div className="bg-secondary relative h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${progress}%`,
                      background:
                        "linear-gradient(90deg, var(--color-primary) 0%, oklch(0.75 0.2 259) 100%)",
                    }}
                  >
                    <div className="animate-shimmer absolute inset-0 rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)] bg-[length:200%_100%]" />
                  </div>
                </div>

                <div className="flex justify-between px-0.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-all duration-500",
                        getStage(progress).stage >= i ? "bg-primary scale-110" : "bg-secondary",
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {!isProcessing && !isComplete && (
              <Button onClick={processFile} className="w-full">
                <Loader2 className="mr-2 h-4 w-4" />
                Extract CV Data
              </Button>
            )}

            {isComplete && (
              <div className="text-success text-center">
                <p className="font-medium">CV processed successfully!</p>
                <p className="text-muted-foreground text-sm">Redirecting...</p>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-destructive mt-4 text-center text-sm">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default CVUploadStep;
