"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Progress,
  Badge,
} from "@repo/ui";
import {
  Briefcase,
  FileText,
  Mail,
  Target,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Building2,
} from "lucide-react";

interface DashboardContentProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  stats: {
    cvComplete: boolean;
    applicationsCount: number;
    invitationsCount: number;
    matchedJobs: number;
  };
}

// Mock data for recent job matches
const recentMatches = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    matchScore: 92,
    salary: "$150k - $180k",
    postedAt: "2 days ago",
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    matchScore: 87,
    salary: "$120k - $150k",
    postedAt: "3 days ago",
  },
  {
    id: "3",
    title: "React Developer",
    company: "Digital Agency",
    location: "New York, NY",
    matchScore: 85,
    salary: "$130k - $160k",
    postedAt: "5 days ago",
  },
];

// Mock data for recent applications
const recentApplications = [
  {
    id: "1",
    title: "Software Engineer",
    company: "Google",
    status: "interview",
    appliedAt: "1 week ago",
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "Meta",
    status: "screening",
    appliedAt: "2 weeks ago",
  },
];

const statusColors = {
  applied: "secondary",
  screening: "warning",
  interview: "default",
  offer: "success",
  rejected: "destructive",
} as const;

export function DashboardContent({ user, stats }: DashboardContentProps) {
  const firstName = user.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your job search
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/tools">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Tools
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/jobs">
              Browse Jobs
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Matched Jobs"
          value={stats.matchedJobs}
          description="Jobs matching your profile"
          icon={Target}
          trend="+5 this week"
          href="/dashboard/jobs"
        />
        <StatCard
          title="Applications"
          value={stats.applicationsCount}
          description="Active applications"
          icon={FileText}
          href="/dashboard/applications"
        />
        <StatCard
          title="Invitations"
          value={stats.invitationsCount}
          description="Pending invitations"
          icon={Mail}
          highlight={stats.invitationsCount > 0}
          href="/dashboard/invitations"
        />
        <StatCard
          title="Profile Strength"
          value="85%"
          description="Complete your profile"
          icon={TrendingUp}
          href="/dashboard/profile"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Job Matches */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Top Job Matches</CardTitle>
              <CardDescription>Jobs that best match your profile</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/jobs">
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMatches.map((job) => (
                <Link
                  key={job.id}
                  href={`/dashboard/jobs/${job.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                >
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {job.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {job.company} &middot; {job.location}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{job.salary}</span>
                      <span>&middot;</span>
                      <Clock className="h-3 w-3" />
                      <span>{job.postedAt}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={job.matchScore}
                        className="w-16"
                        size="sm"
                        variant={job.matchScore >= 90 ? "success" : job.matchScore >= 80 ? "default" : "warning"}
                      />
                      <span className="text-sm font-medium text-foreground w-10">
                        {job.matchScore}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Match</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Applications</CardTitle>
            <CardDescription>Your latest application activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.length > 0 ? (
                recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/dashboard/applications/${app.id}`}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm truncate">
                        {app.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {app.company}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant={statusColors[app.status as keyof typeof statusColors]} className="text-xs">
                          {app.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {app.appliedAt}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No applications yet</p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href="/dashboard/jobs">Start applying</Link>
                  </Button>
                </div>
              )}
            </div>
            
            {recentApplications.length > 0 && (
              <Button variant="ghost" size="sm" className="w-full mt-4" asChild>
                <Link href="/dashboard/applications">
                  View all applications
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI-Powered Tools</CardTitle>
          <CardDescription>Enhance your job search with AI assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <QuickActionCard
              title="Tailor Your CV"
              description="Generate a customized CV for any job description"
              icon={FileText}
              href="/dashboard/tools/cv-tailor"
            />
            <QuickActionCard
              title="Cover Letter"
              description="Create compelling cover letters in seconds"
              icon={Mail}
              href="/dashboard/tools/cover-letter"
            />
            <QuickActionCard
              title="Interview Prep"
              description="Practice with AI-generated interview questions"
              icon={Sparkles}
              href="/dashboard/tools/interview-prep"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  highlight,
  href,
}: {
  title: string;
  value: number | string;
  description: string;
  icon: typeof Target;
  trend?: string;
  highlight?: boolean;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className={`hover:border-primary/50 transition-colors cursor-pointer ${highlight ? "border-primary/50 bg-primary/5" : ""}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            {trend && (
              <Badge variant="secondary" className="text-xs">
                {trend}
              </Badge>
            )}
            {highlight && (
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  description: string;
  icon: typeof FileText;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
    >
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
