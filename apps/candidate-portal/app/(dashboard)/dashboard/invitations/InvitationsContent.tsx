"use client";

import { useState } from "react";

import Link from "next/link";

import {
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  MessageSquare,
  XCircle,
} from "lucide-react";

import { Avatar, Badge, Button, Card, CardContent, Progress } from "@repo/ui";

interface Invitation {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary: { min: number; max: number };
  matchScore: number;
  message: string;
  recruiterName: string;
  receivedAt: string;
  status: "pending" | "accepted" | "declined";
}

const mockInvitations: Invitation[] = [
  {
    id: "1",
    jobTitle: "Senior React Developer",
    company: "Innovation Labs",
    location: "Remote",
    salary: { min: 140000, max: 170000 },
    matchScore: 94,
    message:
      "Hi! We were impressed by your profile and think you'd be a great fit for our team. We're building cutting-edge products and would love to chat.",
    recruiterName: "Sarah Johnson",
    receivedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: "2",
    jobTitle: "Frontend Team Lead",
    company: "Tech Giants Inc.",
    location: "San Francisco, CA",
    salary: { min: 180000, max: 220000 },
    matchScore: 88,
    message:
      "Your experience with React and team leadership caught our attention. We have an exciting opportunity to lead our frontend team.",
    recruiterName: "Michael Chen",
    receivedAt: "1 day ago",
    status: "pending",
  },
  {
    id: "3",
    jobTitle: "Staff Engineer",
    company: "Cloud Solutions",
    location: "Seattle, WA",
    salary: { min: 200000, max: 250000 },
    matchScore: 82,
    message:
      "We're looking for experienced engineers to help scale our platform. Your background is exactly what we need.",
    recruiterName: "Emily Davis",
    receivedAt: "3 days ago",
    status: "pending",
  },
];

const InvitationsContent = () => {
  const [invitations, setInvitations] = useState(mockInvitations);
  const [processingId, setProcessingId] = useState<string | undefined>(undefined);

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "accepted" as const } : inv)),
    );
    setProcessingId(undefined);
  };

  const handleDecline = async (id: string) => {
    setProcessingId(id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "declined" as const } : inv)),
    );
    setProcessingId(undefined);
  };

  const pendingInvitations = invitations.filter((inv) => inv.status === "pending");
  const respondedInvitations = invitations.filter((inv) => inv.status !== "pending");

  const formatSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Invitations</h1>
        <p className="text-muted-foreground">Companies that want to connect with you</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-primary text-2xl font-bold">{pendingInvitations.length}</p>
            <p className="text-muted-foreground text-sm">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-success text-2xl font-bold">
              {invitations.filter((i) => i.status === "accepted").length}
            </p>
            <p className="text-muted-foreground text-sm">Accepted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground text-2xl font-bold">
              {invitations.filter((i) => i.status === "declined").length}
            </p>
            <p className="text-muted-foreground text-sm">Declined</p>
          </CardContent>
        </Card>
      </div>

      {pendingInvitations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-foreground text-lg font-semibold">
            Pending Invitations ({pendingInvitations.length})
          </h2>

          {pendingInvitations.map((invitation) => (
            <Card key={invitation.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="bg-muted flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl">
                        <Building2 className="text-muted-foreground h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-foreground text-lg font-semibold">
                          {invitation.jobTitle}
                        </h3>
                        <p className="text-muted-foreground">{invitation.company}</p>

                        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {invitation.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {formatSalary(invitation.salary.min, invitation.salary.max)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {invitation.receivedAt}
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={invitation.matchScore}
                            className="w-16"
                            size="sm"
                            variant={invitation.matchScore >= 90 ? "success" : "default"}
                          />
                          <span className="text-foreground text-sm font-semibold">
                            {invitation.matchScore}%
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs">Match</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 mt-4 rounded-lg p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Avatar alt={invitation.recruiterName} size="sm" />
                        <span className="text-foreground text-sm font-medium">
                          {invitation.recruiterName}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">{invitation.message}</p>
                    </div>
                  </div>

                  <div className="flex flex-row gap-2 md:w-40 md:flex-col">
                    <Button
                      onClick={() => handleAccept(invitation.id)}
                      disabled={processingId === invitation.id}
                      className="flex-1"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDecline(invitation.id)}
                      disabled={processingId === invitation.id}
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                    <Button variant="ghost" className="flex-1">
                      <Eye className="mr-2 h-4 w-4" />
                      View Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {respondedInvitations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-foreground text-lg font-semibold">Previous Invitations</h2>

          <Card>
            <CardContent className="divide-border divide-y p-0">
              {respondedInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center gap-4 p-4 opacity-75">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                    <Building2 className="text-muted-foreground h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-foreground truncate font-medium">{invitation.jobTitle}</h4>
                    <p className="text-muted-foreground truncate text-sm">{invitation.company}</p>
                  </div>
                  <Badge variant={invitation.status === "accepted" ? "success" : "secondary"}>
                    {invitation.status === "accepted" ? "Accepted" : "Declined"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {invitations.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="text-foreground text-lg font-semibold">No invitations yet</h3>
            <p className="text-muted-foreground mx-auto mt-1 max-w-sm">
              Complete your profile to increase your chances of getting noticed by companies
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/dashboard/profile">Complete Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvitationsContent;
