"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Progress,
} from "@repo/ui";
import {
  Plus,
  Building2,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  MoreHorizontal,
  GripVertical,
  ChevronRight,
} from "lucide-react";

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

const statusConfig: Record<ApplicationStatus, { label: string; color: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" }> = {
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

// Mock data
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

export function ApplicationsContent() {
  const [applications, setApplications] = useState(mockApplications);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [draggedApp, setDraggedApp] = useState<string | null>(null);

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
          app.id === draggedApp ? { ...app, status, lastUpdate: "Just now" } : app
        )
      );
      setDraggedApp(null);
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
          <p className="text-muted-foreground">
            Track and manage your job applications
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border border-input rounded-lg overflow-hidden">
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
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-primary">{stats.interviews}</p>
            <p className="text-sm text-muted-foreground">Interviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-success">{stats.offers}</p>
            <p className="text-sm text-muted-foreground">Offers</p>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      {viewMode === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {getApplicationsByStatus(column.id).length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 min-h-[200px] p-2 rounded-lg bg-muted/30">
                {getApplicationsByStatus(column.id).map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onDragStart={() => handleDragStart(app.id)}
                    isDragging={draggedApp === app.id}
                  />
                ))}

                {getApplicationsByStatus(column.id).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No applications
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {applications.map((app) => (
                <Link
                  key={app.id}
                  href={`/dashboard/applications/${app.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {app.jobTitle}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {app.company} &middot; {app.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={statusConfig[app.status].variant}>
                      {statusConfig[app.status].label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {app.lastUpdate}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ApplicationCard({
  application,
  onDragStart,
  isDragging,
}: {
  application: Application;
  onDragStart: () => void;
  isDragging: boolean;
}) {
  return (
    <Card
      draggable
      onDragStart={onDragStart}
      className={`cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? "opacity-50 scale-95" : "hover:border-primary/50"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <Link
              href={`/dashboard/applications/${application.id}`}
              className="font-medium text-foreground hover:text-primary transition-colors block truncate"
            >
              {application.jobTitle}
            </Link>
            <p className="text-sm text-muted-foreground truncate">
              {application.company}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <Progress
                value={application.matchScore}
                className="w-12"
                size="sm"
                variant={application.matchScore >= 80 ? "success" : "default"}
              />
              <span className="text-xs text-muted-foreground">
                {application.matchScore}%
              </span>
            </div>

            {application.nextStep && (
              <p className="text-xs text-primary mt-2 truncate">
                {application.nextStep}
              </p>
            )}

            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
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
}
