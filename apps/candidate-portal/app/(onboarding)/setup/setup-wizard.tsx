"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from "@repo/ui";
import { Upload, FileText, Linkedin, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { CVUploadStep } from "./steps/cv-upload-step";
import { CVFormStep } from "./steps/cv-form-step";
import { CVPreviewStep } from "./steps/cv-preview-step";
import type { CV } from "@repo/shared-types";

type SetupMethod = "upload" | "linkedin" | "manual" | null;

interface SetupWizardProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const steps = [
  { id: 1, name: "Choose Method", description: "How would you like to set up your CV?" },
  { id: 2, name: "Add Details", description: "Provide your information" },
  { id: 3, name: "Review & Complete", description: "Review and finalize your profile" },
];

export function SetupWizard({ user }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [method, setMethod] = useState<SetupMethod>(null);
  const [cvData, setCvData] = useState<Partial<CV> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMethodSelect = (selectedMethod: SetupMethod) => {
    setMethod(selectedMethod);
    setCurrentStep(2);
  };

  const handleCVDataUpdate = (data: Partial<CV>) => {
    setCvData(data);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) {
        setMethod(null);
      }
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cvData,
          userId: user.id,
        }),
      });

      if (response.ok) {
        // Mark onboarding as complete
        await fetch("/api/user/complete-onboarding", { method: "POST" });
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Failed to save CV:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-2 ${
                currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep > step.id
                    ? "bg-success text-success-foreground"
                    : currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className="hidden sm:inline">{step.name}</span>
            </div>
          ))}
        </div>
        <Progress value={(currentStep / steps.length) * 100} size="sm" />
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <MethodSelection onSelect={handleMethodSelect} />
        )}

        {currentStep === 2 && method === "upload" && (
          <CVUploadStep
            onDataExtracted={handleCVDataUpdate}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && method === "linkedin" && (
          <CVUploadStep
            onDataExtracted={handleCVDataUpdate}
            onNext={handleNext}
            isLinkedIn
          />
        )}

        {currentStep === 2 && method === "manual" && (
          <CVFormStep
            initialData={cvData}
            onUpdate={handleCVDataUpdate}
            onNext={handleNext}
            user={user}
          />
        )}

        {currentStep === 3 && (
          <CVPreviewStep
            data={cvData}
            onEdit={() => setCurrentStep(2)}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {currentStep === 3 ? (
          <Button onClick={handleComplete} isLoading={isLoading}>
            Complete Setup
            <Check className="h-4 w-4 ml-2" />
          </Button>
        ) : currentStep === 2 ? (
          <Button onClick={handleNext} disabled={!cvData}>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function MethodSelection({ onSelect }: { onSelect: (method: SetupMethod) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card
        className="cursor-pointer hover:border-primary/50 hover:bg-card/80 transition-all group"
        onClick={() => onSelect("upload")}
      >
        <CardHeader className="text-center pb-2">
          <div className="mx-auto h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <Upload className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-lg">Upload CV</CardTitle>
          <CardDescription>
            Upload your existing CV and we&apos;ll extract the details
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-xs text-muted-foreground">
            Supports PDF, DOCX formats
          </p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:border-primary/50 hover:bg-card/80 transition-all group"
        onClick={() => onSelect("linkedin")}
      >
        <CardHeader className="text-center pb-2">
          <div className="mx-auto h-14 w-14 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center mb-4 group-hover:bg-[#0A66C2]/20 transition-colors">
            <Linkedin className="h-7 w-7 text-[#0A66C2]" />
          </div>
          <CardTitle className="text-lg">Import from LinkedIn</CardTitle>
          <CardDescription>
            Generate a CV from your LinkedIn profile
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-xs text-muted-foreground">
            Quick and easy setup
          </p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:border-primary/50 hover:bg-card/80 transition-all group"
        onClick={() => onSelect("manual")}
      >
        <CardHeader className="text-center pb-2">
          <div className="mx-auto h-14 w-14 rounded-xl bg-success/10 flex items-center justify-center mb-4 group-hover:bg-success/20 transition-colors">
            <FileText className="h-7 w-7 text-success" />
          </div>
          <CardTitle className="text-lg">Build from Scratch</CardTitle>
          <CardDescription>
            Create your CV using our guided form
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-xs text-muted-foreground">
            Full control over your profile
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
