"use client";

import Link from "next/link";

import {
  ArrowRight,
  Briefcase,
  Building2,
  Clock,
  FileText,
  Mail,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from "@repo/ui";

interface DashboardContentProps {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
  stats: {
    cvComplete: boolean;
    applicationsCount: number;
    invitationsCount: number;
    matchedJobs: number;
  };
}

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

const StatCard = ({
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
}) => (
  <Link href={href}>
    <Card
      className={`hover:border-primary/50 cursor-pointer transition-colors ${highlight ? "border-primary/50 bg-primary/5" : ""}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
            <Icon className="text-muted-foreground h-5 w-5" />
          </div>
          {trend && (
            <Badge variant="secondary" className="text-xs">
              {trend}
            </Badge>
          )}
          {highlight && <span className="bg-primary h-2 w-2 animate-pulse rounded-full" />}
        </div>
        <div className="mt-4">
          <p className="text-foreground text-2xl font-bold">{value}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  description: string;
  icon: typeof FileText;
  href: string;
}) => (
  <Link
    href={href}
    className="border-border hover:border-primary/50 hover:bg-muted/50 group flex items-center gap-4 rounded-lg border p-4 transition-all"
  >
    <div className="bg-primary/10 group-hover:bg-primary/20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-colors">
      <Icon className="text-primary h-6 w-6" />
    </div>
    <div>
      <h4 className="text-foreground group-hover:text-primary font-medium transition-colors">
        {title}
      </h4>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </Link>
);

const DashboardContent = ({ user, stats }: DashboardContentProps) => {
  const firstName = user.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold md:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your job search
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/tools">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Tools
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/jobs">
              Browse Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Top Job Matches</CardTitle>
              <CardDescription>Jobs that best match your profile</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/jobs">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMatches.map((job) => (
                <Link
                  key={job.id}
                  href={`/dashboard/jobs/${job.id}`}
                  className="border-border hover:bg-muted/50 group flex items-center gap-4 rounded-lg border p-4 transition-colors"
                >
                  <div className="bg-muted flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                    <Building2 className="text-muted-foreground h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-foreground group-hover:text-primary truncate font-medium transition-colors">
                        {job.title}
                      </h4>
                    </div>
                    <p className="text-muted-foreground truncate text-sm">
                      {job.company} &middot; {job.location}
                    </p>
                    <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                      <span>{job.salary}</span>
                      <span>&middot;</span>
                      <Clock className="h-3 w-3" />
                      <span>{job.postedAt}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={job.matchScore}
                        className="w-16"
                        size="sm"
                        variant={
                          job.matchScore >= 90
                            ? "success"
                            : job.matchScore >= 80
                              ? "default"
                              : "warning"
                        }
                      />
                      <span className="text-foreground w-10 text-sm font-medium">
                        {job.matchScore}%
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">Match</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

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
                    className="hover:bg-muted/50 flex items-start gap-3 rounded-lg p-3 transition-colors"
                  >
                    <div className="bg-muted flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                      <Briefcase className="text-muted-foreground h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-foreground truncate text-sm font-medium">{app.title}</h4>
                      <p className="text-muted-foreground truncate text-xs">{app.company}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge
                          variant={statusColors[app.status as keyof typeof statusColors]}
                          className="text-xs"
                        >
                          {app.status}
                        </Badge>
                        <span className="text-muted-foreground text-xs">{app.appliedAt}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center">
                  <FileText className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
                  <p className="text-muted-foreground text-sm">No applications yet</p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href="/dashboard/jobs">Start applying</Link>
                  </Button>
                </div>
              )}
            </div>

            {recentApplications.length > 0 && (
              <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
                <Link href="/dashboard/applications">
                  View all applications
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

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
};

export default DashboardContent;
