"use client";

import { useState, useCallback } from "react";
import { Button, Card, CardContent, Progress } from "@repo/ui";
import { Upload, FileText, X, Loader2, CheckCircle } from "lucide-react";
import type { CV } from "@repo/shared-types";

interface CVUploadStepProps {
  onDataExtracted: (data: Partial<CV>) => void;
  onNext: () => void;
  isLinkedIn?: boolean;
}

export function CVUploadStep({ onDataExtracted, onNext, isLinkedIn }: CVUploadStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
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

  const validateAndSetFile = (file: File) => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or DOCX file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    setFile(file);
    setError(null);
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cv/parse", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Failed to process CV");
      }

      const data = await response.json();
      setProgress(100);
      setIsComplete(true);
      onDataExtracted(data.cv);

      // Auto-advance after short delay
      setTimeout(() => {
        onNext();
      }, 1000);
    } catch (err) {
      setError("Failed to process your CV. Please try again.");
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setProgress(0);
    setIsComplete(false);
  };

  if (isLinkedIn) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div className="h-16 w-16 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center mx-auto">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Import from LinkedIn
            </h3>
            <p className="text-muted-foreground">
              We&apos;ll use your LinkedIn profile data to generate a professional CV
            </p>
          </div>
          <Button size="lg" className="w-full max-w-xs">
            Connect LinkedIn
          </Button>
          <p className="text-xs text-muted-foreground">
            We only read your public profile information
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="p-8">
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Upload className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upload your CV
            </h3>
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
            <p className="text-xs text-muted-foreground mt-4">
              Supports PDF and DOCX files up to 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!isProcessing && !isComplete && (
                <Button variant="ghost" size="icon" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              )}
              {isComplete && (
                <CheckCircle className="h-6 w-6 text-success" />
              )}
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processing CV...</span>
                  <span className="text-foreground font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {!isProcessing && !isComplete && (
              <Button onClick={processFile} className="w-full">
                <Loader2 className="h-4 w-4 mr-2" />
                Extract CV Data
              </Button>
            )}

            {isComplete && (
              <div className="text-center text-success">
                <p className="font-medium">CV processed successfully!</p>
                <p className="text-sm text-muted-foreground">Redirecting...</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-destructive text-center">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
