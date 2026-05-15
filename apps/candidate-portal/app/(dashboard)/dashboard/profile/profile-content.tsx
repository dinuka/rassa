"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Input,
  Avatar,
  Progress,
  Separator,
} from "@repo/ui";
import {
  Edit2,
  Save,
  X,
  Plus,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Download,
  Upload,
  Eye,
  Sparkles,
} from "lucide-react";
import type { CV } from "@repo/shared-types";

interface ProfileContentProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  cv: CV | null;
}

// Mock CV data if none exists
const mockCV: CV = {
  id: "1",
  userId: "1",
  version: 1,
  isActive: true,
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: "Senior Frontend Engineer",
    summary: "Experienced software engineer with 8+ years of expertise in building scalable web applications. Passionate about creating intuitive user experiences and mentoring junior developers. Strong background in React, TypeScript, and modern frontend technologies.",
  },
  experience: [
    {
      id: "1",
      company: "TechCorp Inc.",
      title: "Senior Frontend Engineer",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: "",
      current: true,
      description: "Leading frontend development for the core product team. Architected and implemented a new design system used across 5 products.",
      highlights: ["Led team of 4 engineers", "Improved performance by 40%"],
    },
    {
      id: "2",
      company: "StartupXYZ",
      title: "Frontend Developer",
      location: "Remote",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      description: "Built and maintained React applications for B2B SaaS platform.",
      highlights: ["Shipped 20+ features", "Reduced bundle size by 50%"],
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2014",
      endDate: "2018",
      gpa: "3.8",
    },
  ],
  skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker", "Git", "Agile", "Team Leadership"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function ProfileContent({ user, cv: serverCV }: ProfileContentProps) {
  const [cv] = useState<CV>(serverCV || mockCV);
  const [isEditing, setIsEditing] = useState(false);

  const profileStrength = 85; // Calculate based on filled fields

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your CV and professional information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Update CV
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar
                  src={user.image}
                  alt={cv.personalInfo.fullName}
                  size="xl"
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {cv.personalInfo.fullName}
                    </h2>
                    <p className="text-lg text-primary">{cv.personalInfo.title}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      {cv.personalInfo.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      {cv.personalInfo.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {cv.personalInfo.location}
                    </span>
                  </div>

                  <p className="text-muted-foreground">{cv.personalInfo.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Experience</CardTitle>
              </div>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {cv.experience.map((exp, index) => (
                <div key={exp.id}>
                  {index > 0 && <Separator className="mb-6" />}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-foreground">{exp.title}</h4>
                      <p className="text-primary">{exp.company}</p>
                      <p className="text-sm text-muted-foreground">
                        {exp.location} &middot; {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground mt-2">{exp.description}</p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Education</CardTitle>
              </div>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cv.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {edu.degree} in {edu.field}
                    </h4>
                    <p className="text-primary">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground">
                      {edu.startDate} - {edu.endDate}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Skills</CardTitle>
              <Button variant="ghost" size="sm">
                <Edit2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {cv.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Strength */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Strength</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${profileStrength * 2.51} 251`}
                      className="text-success"
                    />
                  </svg>
                  <span className="absolute text-xl font-bold text-foreground">
                    {profileStrength}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Complete these to improve your profile:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                    Add certifications
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                    Add portfolio links
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* AI Enhancement */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Enhancement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Let AI analyze and improve your profile for better job matches.
              </p>
              <Button className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Enhance with AI
              </Button>
            </CardContent>
          </Card>

          {/* CV Versions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CV Versions</CardTitle>
              <CardDescription>Manage different versions of your CV</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground text-sm">Main CV</p>
                  <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-foreground text-sm">Frontend Focus</p>
                  <p className="text-xs text-muted-foreground">Tailored for frontend roles</p>
                </div>
                <Button variant="ghost" size="sm">Use</Button>
              </div>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New Version
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
