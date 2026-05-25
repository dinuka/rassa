"use client";

import { useState } from "react";

import Link from "next/link";

import { Building2, ChevronRight, Clock, GripVertical, MessageSquare, Plus } from "lucide-react";

import { Badge, Button, Card, CardContent, Progress } from "@repo/ui";

type ApplicationStatus = "applied" | "screening" | "interview" | "offer" | "rejected" | "withdrawn";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  status: ApplicationStatus;
  appliedAt: string;
  matchScore: number;
  lastUpdate: string;
  nextStep?: string;
  cvVersion?: string;
  coverLetter?: boolean;
}

const statusConfig: Record<
  ApplicationStatus,
  {
    label: string;
    color: string;
    variant: "default" | "secondary" | "success" | "warning" | "destructive";
  }
> = {
  applied: { label: "Applied", color: "bg-secondary", variant: "secondary" },
  screening: { label: "Screening", color: "bg-warning", variant: "warning" },
  interview: { label: "Interview", color: "bg-primary", variant: "default" },
  offer: { label: "Offer", color: "bg-success", variant: "success" },
  rejected: { label: "Rejected", color: "bg-destructive", variant: "destructive" },
  withdrawn: { label: "Withdrawn", color: "bg-muted", variant: "secondary" },
};

const columns: { id: ApplicationStatus; title: string }[] = [
  { id: "applied", title: "Applied" },
  { id: "screening", title: "Screening" },
  { id: "interview", title: "Interview" },
  { id: "offer", title: "Offer" },
];

const mockApplications: Application[] = [
  {
    id: "1",
    jobTitle: "Senior Frontend Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    status: "interview",
    appliedAt: "2024-01-05",
    matchScore: 92,
    lastUpdate: "2 days ago",
    nextStep: "Technical interview on Jan 20",
    cvVersion: "Tailored CV v2",
    coverLetter: true,
  },
  {
    id: "2",
    jobTitle: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    status: "screening",
    appliedAt: "2024-01-08",
    matchScore: 87,
    lastUpdate: "1 day ago",
    nextStep: "Awaiting response",
    cvVersion: "General CV",
    coverLetter: true,
  },
  {
    id: "3",
    jobTitle: "React Developer",
    company: "Digital Agency",
    location: "New York, NY",
    status: "applied",
    appliedAt: "2024-01-10",
    matchScore: 85,
    lastUpdate: "3 hours ago",
    cvVersion: "Tailored CV v3",
    coverLetter: false,
  },
  {
    id: "4",
    jobTitle: "Software Engineer",
    company: "Enterprise Co.",
    location: "Austin, TX",
    status: "offer",
    appliedAt: "2023-12-20",
    matchScore: 78,
    lastUpdate: "Yesterday",
    nextStep: "Review offer details",
    cvVersion: "Tailored CV v1",
    coverLetter: true,
  },
  {
    id: "5",
    jobTitle: "Frontend Lead",
    company: "FinTech Corp",
    location: "Chicago, IL",
    status: "rejected",
    appliedAt: "2023-12-15",
    matchScore: 72,
    lastUpdate: "1 week ago",
    cvVersion: "General CV",
    coverLetter: true,
  },
];

type ViewMode = "kanban" | "list";

const ApplicationCard = ({
  application,
  onDragStart,
  isDragging,
}: {
  application: Application;
  onDragStart: () => void;
  isDragging: boolean;
}) => (
  <Card
    draggable
    onDragStart={onDragStart}
    className={`cursor-grab transition-all active:cursor-grabbing ${
      isDragging ? "scale-95 opacity-50" : "hover:border-primary/50"
    }`}
  >
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <GripVertical className="text-muted-foreground mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <Link
            href={`/dashboard/applications/${application.id}`}
            className="text-foreground hover:text-primary block truncate font-medium transition-colors"
          >
            {application.jobTitle}
          </Link>
          <p className="text-muted-foreground truncate text-sm">{application.company}</p>

          <div className="mt-2 flex items-center gap-2">
            <Progress
              value={application.matchScore}
              className="w-12"
              size="sm"
              variant={application.matchScore >= 80 ? "success" : "default"}
            />
            <span className="text-muted-foreground text-xs">{application.matchScore}%</span>
          </div>

          {application.nextStep && (
            <p className="text-primary mt-2 truncate text-xs">{application.nextStep}</p>
          )}

          <div className="text-muted-foreground mt-3 flex items-center gap-2 text-xs">
            <Clock className="h-3 w-3" />
            {application.lastUpdate}
            {application.coverLetter && (
              <>
                <span>&middot;</span>
                <MessageSquare className="h-3 w-3" />
                Cover Letter
              </>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ApplicationsContent = () => {
  const [applications, setApplications] = useState(mockApplications);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [draggedApp, setDraggedApp] = useState<string | undefined>(undefined);

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return applications.filter((app) => app.status === status);
  };

  const handleDragStart = (appId: string) => {
    setDraggedApp(appId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: ApplicationStatus) => {
    if (draggedApp) {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === draggedApp ? { ...app, status, lastUpdate: "Just now" } : app,
        ),
      );
      setDraggedApp(undefined);
    }
  };

  const stats = {
    total: applications.length,
    active: applications.filter((a) => !["rejected", "withdrawn"].includes(a.status)).length,
    interviews: applications.filter((a) => a.status === "interview").length,
    offers: applications.filter((a) => a.status === "offer").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">Track and manage your job applications</p>
        </div>
        <div className="flex gap-2">
          <div className="border-input flex overflow-hidden rounded-lg border">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-2 text-sm ${viewMode === "kanban" ? "bg-muted" : "hover:bg-muted/50"}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 text-sm ${viewMode === "list" ? "bg-muted" : "hover:bg-muted/50"}`}
            >
              List
            </button>
          </div>
          <Button asChild>
            <Link href="/dashboard/jobs">
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-foreground text-2xl font-bold">{stats.total}</p>
            <p className="text-muted-foreground text-sm">Total Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-foreground text-2xl font-bold">{stats.active}</p>
            <p className="text-muted-foreground text-sm">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-primary text-2xl font-bold">{stats.interviews}</p>
            <p className="text-muted-foreground text-sm">Interviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-success text-2xl font-bold">{stats.offers}</p>
            <p className="text-muted-foreground text-sm">Offers</p>
          </CardContent>
        </Card>
      </div>

      {viewMode === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className="w-80 flex-shrink-0"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground font-semibold">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {getApplicationsByStatus(column.id).length}
                  </Badge>
                </div>
              </div>

              <div className="bg-muted/30 min-h-[200px] space-y-3 rounded-lg p-2">
                {getApplicationsByStatus(column.id).map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onDragStart={() => handleDragStart(app.id)}
                    isDragging={draggedApp === app.id}
                  />
                ))}

                {getApplicationsByStatus(column.id).length === 0 && (
                  <div className="text-muted-foreground py-8 text-center text-sm">
                    No applications
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-border divide-y">
              {applications.map((app) => (
                <Link
                  key={app.id}
                  href={`/dashboard/applications/${app.id}`}
                  className="hover:bg-muted/50 flex items-center gap-4 p-4 transition-colors"
                >
                  <div className="bg-muted flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                    <Building2 className="text-muted-foreground h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-foreground truncate font-medium">{app.jobTitle}</h4>
                    <p className="text-muted-foreground truncate text-sm">
                      {app.company} &middot; {app.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={statusConfig[app.status].variant}>
                      {statusConfig[app.status].label}
                    </Badge>
                    <span className="text-muted-foreground text-sm">{app.lastUpdate}</span>
                    <ChevronRight className="text-muted-foreground h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationsContent;
