"use client";

import { useState } from "react";

import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  MapPin,
  MessageSquare,
  Share2,
  Sparkles,
} from "lucide-react";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Separator } from "@repo/ui";

interface JobDetailContentProps {
  jobId: string;
}

const getJob = (id: string) => ({
  id,
  title: "Senior Frontend Engineer",
  company: "TechCorp Inc.",
  companyDescription:
    "TechCorp is a leading technology company focused on building innovative solutions for enterprise customers. We're backed by top-tier investors and have a team of 500+ employees across 10 offices globally.",
  location: "San Francisco, CA",
  type: "Full-time",
  remote: true,
  matchScore: 92,
  salary: { min: 150000, max: 180000 },
  skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker"],
  matchedSkills: ["React", "TypeScript", "Node.js"],
  missingSkills: ["GraphQL", "AWS", "Docker"],
  postedAt: "2024-01-10",
  deadline: "2024-02-15",
  description: `We are looking for a Senior Frontend Engineer to join our growing team. You will be responsible for building and maintaining our web applications, working closely with our design and product teams.

## Responsibilities
- Lead the development of new features and improvements to our web platform
- Collaborate with designers to implement pixel-perfect UIs
- Write clean, maintainable, and well-tested code
- Mentor junior developers and participate in code reviews
- Contribute to architectural decisions and technical strategy

## Requirements
- 5+ years of experience in frontend development
- Strong proficiency in React and TypeScript
- Experience with modern state management solutions
- Familiarity with GraphQL and REST APIs
- Understanding of web performance optimization
- Excellent communication and collaboration skills

## Nice to Have
- Experience with AWS services
- Knowledge of Docker and containerization
- Previous experience in a leadership role
- Contributions to open source projects`,
  benefits: [
    "Competitive salary and equity",
    "Health, dental, and vision insurance",
    "Flexible work arrangements",
    "Unlimited PTO",
    "Learning and development budget",
    "Home office stipend",
  ],
});

const JobDetailContent = ({ jobId }: JobDetailContentProps) => {
  const job = getJob(jobId);
  const [isSaved, setIsSaved] = useState(false);

  const formatSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  };

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/jobs"
        className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="bg-muted flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl">
                  <Building2 className="text-muted-foreground h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h1 className="text-foreground text-2xl font-bold">{job.title}</h1>
                  <p className="text-muted-foreground text-lg">{job.company}</p>
                  <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatSalary(job.salary.min, job.salary.max)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.type}
                    </span>
                    {job.remote && <Badge variant="secondary">Remote</Badge>}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button size="lg" className="flex-1">
                  Apply Now
                </Button>
                <Button variant="outline" size="lg" onClick={() => setIsSaved(!isSaved)}>
                  {isSaved ? (
                    <BookmarkCheck className="text-primary h-5 w-5" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About the Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm prose-invert max-w-none">
                {job.description.split("\n").map((paragraph, i) => {
                  if (paragraph.startsWith("## ")) {
                    return (
                      <h3 key={i} className="text-foreground mt-6 mb-3 text-lg font-semibold">
                        {paragraph.replace("## ", "")}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith("- ")) {
                    return (
                      <li key={i} className="text-muted-foreground ml-4">
                        {paragraph.replace("- ", "")}
                      </li>
                    );
                  }
                  if (paragraph.trim()) {
                    return (
                      <p key={i} className="text-muted-foreground mb-4">
                        {paragraph}
                      </p>
                    );
                  }
                  return undefined;
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {job.benefits.map((benefit, i) => (
                  <div key={i} className="text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="text-success h-4 w-4 flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About {job.company}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{job.companyDescription}</p>
              <Button variant="outline" className="mt-4">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Company Website
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary h-5 w-5" />
                Match Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="h-28 w-28 -rotate-90 transform">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${job.matchScore * 3.02} 302`}
                      className="text-success"
                    />
                  </svg>
                  <span className="text-foreground absolute text-2xl font-bold">
                    {job.matchScore}%
                  </span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  Excellent match for your profile
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h4 className="text-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                    <CheckCircle className="text-success h-4 w-4" />
                    Skills You Have ({job.matchedSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {job.matchedSkills.map((skill) => (
                      <Badge key={skill} variant="success">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                    <AlertCircle className="text-warning h-4 w-4" />
                    Skills to Develop ({job.missingSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {job.missingSkills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/tools/cv-tailor?jobId=${jobId}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Tailor CV for This Job
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/tools/cover-letter?jobId=${jobId}`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Generate Cover Letter
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/tools/interview-prep?jobId=${jobId}`}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Prepare for Interview
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-muted-foreground space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Posted</span>
                  <span className="text-foreground">January 10, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Deadline</span>
                  <span className="text-foreground">February 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Applicants</span>
                  <span className="text-foreground">47 people</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetailContent;
