"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Progress,
  Badge,
} from "@repo/ui";
import { X, Link as LinkIcon, FileText, Loader2, Target, CheckCircle, AlertCircle } from "lucide-react";

interface ExternalJobMatcherProps {
  onClose: () => void;
}

interface MatchResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export function ExternalJobMatcher({ onClose }: ExternalJobMatcherProps) {
  const [mode, setMode] = useState<"url" | "text">("url");
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - in real implementation, this would call the AI service
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock result
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
    } catch (err) {
      setError("Failed to analyze job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setJobUrl("");
    setJobDescription("");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              {/* Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={mode === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("url")}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Job URL
                </Button>
                <Button
                  variant={mode === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("text")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Job Description
                </Button>
              </div>

              {/* Input */}
              {mode === "url" ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Job Posting URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://linkedin.com/jobs/..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports LinkedIn, Indeed, Glassdoor, and most job boards
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Job Description
                  </label>
                  <textarea
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isLoading || (mode === "url" ? !jobUrl : !jobDescription)}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Analyze Match
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Match Result */}
              <div className="text-center space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
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
                  <span className="absolute text-3xl font-bold text-foreground">
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

              {/* Skills Analysis */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
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
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-warning" />
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

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
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
}
