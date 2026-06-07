"use client";

import { useState } from "react";

import { ArrowLeft, ArrowRight, Check, FileText, Upload } from "lucide-react";

import { browserLogger } from "@repo/logger/browser";
import type { CV } from "@repo/shared-types";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LinkedInIcon,
  Progress,
} from "@repo/ui";

import apiFetch from "@/lib/apiFetch";

import CVFormStep from "./steps/CVFormStep";
import CVPreviewStep from "./steps/CVPreviewStep";
import CVUploadStep from "./steps/CVUploadStep";

type SetupMethod = "upload" | "linkedin" | "manual" | undefined;

interface SetupWizardProps {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
}

const steps = [
  { id: 1, name: "Choose Method", description: "How would you like to set up your CV?" },
  { id: 2, name: "Add Details", description: "Provide your information" },
  { id: 3, name: "Review & Complete", description: "Review and finalize your profile" },
];

const MethodSelection = ({ onSelect }: { onSelect: (method: SetupMethod) => void }) => (
  <div className="grid gap-4 md:grid-cols-3">
    <Card
      className="hover:border-primary/50 hover:bg-card/80 group cursor-pointer transition-all"
      onClick={() => onSelect("upload")}
    >
      <CardHeader className="pb-2 text-center">
        <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors">
          <Upload className="text-primary h-7 w-7" />
        </div>
        <CardTitle className="text-lg">Upload CV</CardTitle>
        <CardDescription>
          Upload your existing CV and we&apos;ll extract the details
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground text-xs">Supports PDF, DOCX formats</p>
      </CardContent>
    </Card>

    <Card className="group relative cursor-not-allowed opacity-60 transition-all">
      <CardHeader className="pb-2 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0A66C2]/10">
          <LinkedInIcon size={28} />
        </div>
        <CardTitle className="text-lg">Import from LinkedIn</CardTitle>
        <CardDescription>Generate a CV from your LinkedIn profile</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground text-xs">Coming soon</p>
      </CardContent>
    </Card>

    <Card
      className="hover:border-primary/50 hover:bg-card/80 group cursor-pointer transition-all"
      onClick={() => onSelect("manual")}
    >
      <CardHeader className="pb-2 text-center">
        <div className="bg-success/10 group-hover:bg-success/20 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors">
          <FileText className="text-success h-7 w-7" />
        </div>
        <CardTitle className="text-lg">Build from Scratch</CardTitle>
        <CardDescription>Create your CV using our guided form</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground text-xs">Full control over your profile</p>
      </CardContent>
    </Card>
  </div>
);

const SetupWizard = ({ user }: SetupWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [method, setMethod] = useState<SetupMethod>(undefined);
  const [cvData, setCvData] = useState<Partial<CV> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
      if (currentStep === 2 && isEditing) {
        setIsEditing(false);
        setCurrentStep(3);
        return;
      }
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) {
        setMethod(undefined);
        setIsEditing(false);
      }
      if (currentStep === 3) {
        setIsEditing(false);
      }
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cvData,
          userId: user.id,
        }),
      });

      if (response.ok) {
        await apiFetch("/api/user/complete-onboarding", { method: "POST" });
        window.location.href = "/dashboard";
      }
    } catch (error) {
      browserLogger.error(error, "Failed to save CV");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-2 ${
                currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
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

      <div className="min-h-[400px]">
        {currentStep === 1 && <MethodSelection onSelect={handleMethodSelect} />}

        {currentStep === 2 && isEditing && (
          <CVFormStep
            initialData={cvData}
            onUpdate={handleCVDataUpdate}
            onNext={handleNext}
            user={user}
          />
        )}

        {currentStep === 2 && !isEditing && method === "upload" && (
          <CVUploadStep onDataExtracted={handleCVDataUpdate} onNext={handleNext} />
        )}

        {currentStep === 2 && !isEditing && method === "linkedin" && (
          <CVUploadStep onDataExtracted={handleCVDataUpdate} onNext={handleNext} isLinkedIn />
        )}

        {currentStep === 2 && !isEditing && method === "manual" && (
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
            onEdit={() => {
              setIsEditing(true);
              setCurrentStep(2);
            }}
          />
        )}
      </div>

      <div className="border-border flex justify-between border-t pt-4">
        <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {currentStep === 3 ? (
          <Button onClick={handleComplete} isLoading={isLoading}>
            Complete Setup
            <Check className="ml-2 h-4 w-4" />
          </Button>
        ) : currentStep === 2 ? (
          <Button onClick={handleNext} disabled={!cvData}>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : undefined}
      </div>
    </div>
  );
};

export default SetupWizard;
