"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Progress,
  Avatar,
} from "@repo/ui";
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
} from "lucide-react";

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

// Mock data
const mockInvitations: Invitation[] = [
  {
    id: "1",
    jobTitle: "Senior React Developer",
    company: "Innovation Labs",
    location: "Remote",
    salary: { min: 140000, max: 170000 },
    matchScore: 94,
    message: "Hi! We were impressed by your profile and think you'd be a great fit for our team. We're building cutting-edge products and would love to chat.",
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
    message: "Your experience with React and team leadership caught our attention. We have an exciting opportunity to lead our frontend team.",
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
    message: "We're looking for experienced engineers to help scale our platform. Your background is exactly what we need.",
    recruiterName: "Emily Davis",
    receivedAt: "3 days ago",
    status: "pending",
  },
];

export function InvitationsContent() {
  const [invitations, setInvitations] = useState(mockInvitations);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "accepted" as const } : inv))
    );
    setProcessingId(null);
  };

  const handleDecline = async (id: string) => {
    setProcessingId(id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "declined" as const } : inv))
    );
    setProcessingId(null);
  };

  const pendingInvitations = invitations.filter((inv) => inv.status === "pending");
  const respondedInvitations = invitations.filter((inv) => inv.status !== "pending");

  const formatSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Invitations</h1>
        <p className="text-muted-foreground">
          Companies that want to connect with you
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{pendingInvitations.length}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">
              {invitations.filter((i) => i.status === "accepted").length}
            </p>
            <p className="text-sm text-muted-foreground">Accepted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">
              {invitations.filter((i) => i.status === "declined").length}
            </p>
            <p className="text-sm text-muted-foreground">Declined</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Pending Invitations ({pendingInvitations.length})
          </h2>
          
          {pendingInvitations.map((invitation) => (
            <Card key={invitation.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Company Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {invitation.jobTitle}
                        </h3>
                        <p className="text-muted-foreground">{invitation.company}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
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

                      {/* Match Score */}
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={invitation.matchScore}
                            className="w-16"
                            size="sm"
                            variant={invitation.matchScore >= 90 ? "success" : "default"}
                          />
                          <span className="text-sm font-semibold text-foreground">
                            {invitation.matchScore}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Match</p>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mt-4 p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar alt={invitation.recruiterName} size="sm" />
                        <span className="text-sm font-medium text-foreground">
                          {invitation.recruiterName}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invitation.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col gap-2 md:w-40">
                    <Button
                      onClick={() => handleAccept(invitation.id)}
                      disabled={processingId === invitation.id}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDecline(invitation.id)}
                      disabled={processingId === invitation.id}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                    <Button variant="ghost" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Responded Invitations */}
      {respondedInvitations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Previous Invitations
          </h2>
          
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {respondedInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center gap-4 p-4 opacity-75"
                >
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {invitation.jobTitle}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {invitation.company}
                    </p>
                  </div>
                  <Badge
                    variant={invitation.status === "accepted" ? "success" : "secondary"}
                  >
                    {invitation.status === "accepted" ? "Accepted" : "Declined"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {invitations.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              No invitations yet
            </h3>
            <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
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
}
