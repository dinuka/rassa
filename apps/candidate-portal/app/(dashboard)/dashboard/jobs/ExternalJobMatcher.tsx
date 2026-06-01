"use client";

import { useState } from "react";

import {
  AlertCircle,
  CheckCircle,
  FileText,
  Link as LinkIcon,
  Loader2,
  Target,
  X,
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@repo/ui";

interface ExternalJobMatcherProps {
  onClose: () => void;
}

interface MatchResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

const ExternalJobMatcher = ({ onClose }: ExternalJobMatcherProps) => {
  const [mode, setMode] = useState<"url" | "text">("url");
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setResult({
        matchScore: 78,
        matchedSkills: ["React", "TypeScript", "Node.js", "Git"],
        missingSkills: ["Kubernetes", "AWS", "GraphQL"],
        recommendations: [
          "Consider adding AWS certifications to strengthen your profile",
          "GraphQL experience would significantly improve your match",
          "Your React expertise aligns well with this role",
        ],
      });
    } catch {
      setError("Failed to analyze job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(undefined);
    setJobUrl("");
    setJobDescription("");
    setError(undefined);
  };

  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Match External Job</CardTitle>
            <CardDescription>
              Paste a job URL or description to see how well you match
            </CardDescription>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          {!result ? (
            <>
              <div className="flex gap-2">
                <Button
                  variant={mode === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("url")}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Job URL
                </Button>
                <Button
                  variant={mode === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("text")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Job Description
                </Button>
              </div>

              {mode === "url" ? (
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">Job Posting URL</label>
                  <Input
                    type="url"
                    placeholder="https://linkedin.com/jobs/..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                  />
                  <p className="text-muted-foreground text-xs">
                    Supports LinkedIn, Indeed, Glassdoor, and most job boards
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">Job Description</label>
                  <textarea
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                    className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full resize-none rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                  />
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg p-3 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={isLoading || (mode === "url" ? !jobUrl : !jobDescription)}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-4 w-4" />
                    Analyze Match
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4 text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="h-32 w-32 -rotate-90 transform">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${result.matchScore * 3.52} 352`}
                      className={
                        result.matchScore >= 80
                          ? "text-success"
                          : result.matchScore >= 60
                            ? "text-primary"
                            : "text-warning"
                      }
                    />
                  </svg>
                  <span className="text-foreground absolute text-3xl font-bold">
                    {result.matchScore}%
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {result.matchScore >= 80
                    ? "Great match! You're well-suited for this role."
                    : result.matchScore >= 60
                      ? "Good match with some skill gaps to address."
                      : "This role may require additional skills development."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-foreground flex items-center gap-2 text-sm font-medium">
                    <CheckCircle className="text-success h-4 w-4" />
                    Matching Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchedSkills.map((skill) => (
                      <Badge key={skill} variant="success">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-foreground flex items-center gap-2 text-sm font-medium">
                    <AlertCircle className="text-warning h-4 w-4" />
                    Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingSkills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-foreground text-sm font-medium">Recommendations</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="text-muted-foreground flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Analyze Another
                </Button>
                <Button className="flex-1">Tailor CV for This Job</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExternalJobMatcher;
