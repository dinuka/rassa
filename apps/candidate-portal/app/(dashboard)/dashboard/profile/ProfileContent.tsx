"use client";

import { useRef, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Briefcase,
  Download,
  Edit2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Upload,
  UserCircle,
} from "lucide-react";

import { browserLogger } from "@repo/logger/browser";
import type { CandidateProfile, Education, Experience } from "@repo/shared-types";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@repo/ui";

import CVFormStep, { type CVFormStepHandle } from "@/app/(onboarding)/setup/steps/CVFormStep";
import apiFetch from "@/lib/apiFetch";

interface ProfileContentProps {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
  profile: CandidateProfile | undefined;
}

const EmptyProfile = () => (
  <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
    <UserCircle className="text-muted-foreground h-16 w-16" />
    <div>
      <h2 className="text-foreground text-xl font-semibold">No profile yet</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Complete the onboarding to set up your candidate profile.
      </p>
    </div>
    <Button asChild>
      <Link href="/onboarding/setup">Set up profile</Link>
    </Button>
  </div>
);

const ProfileView = ({
  profile,
  user,
  onEdit,
}: {
  profile: CandidateProfile;
  user: ProfileContentProps["user"];
  onEdit: () => void;
}) => {
  const profileStrength = (() => {
    let score = 0;
    if (profile.personalInfo.fullName) score += 20;
    if (profile.personalInfo.title) score += 10;
    if (profile.personalInfo.summary) score += 10;
    if (profile.experience.length > 0) score += 20;
    if (profile.education.length > 0) score += 15;
    if (profile.skills.length > 0) score += 15;
    if (profile.certifications && profile.certifications.length > 0) score += 10;
    return score;
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your professional information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={onEdit}>
            <Upload className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar src={user.image} alt={profile.personalInfo.fullName} size="xl" />
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-foreground text-xl font-bold">
                      {profile.personalInfo.fullName}
                    </h2>
                    {profile.personalInfo.title && (
                      <p className="text-primary text-lg">{profile.personalInfo.title}</p>
                    )}
                  </div>

                  <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      {profile.personalInfo.email}
                    </span>
                    {profile.personalInfo.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        {profile.personalInfo.phone}
                      </span>
                    )}
                    {profile.personalInfo.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {profile.personalInfo.location}
                      </span>
                    )}
                  </div>

                  {profile.personalInfo.summary && (
                    <p className="text-muted-foreground">{profile.personalInfo.summary}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {profile.experience.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="text-muted-foreground h-5 w-5" />
                  <CardTitle>Experience</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.experience.map((exp: Experience, index: number) => (
                  <div key={exp.id}>
                    {index > 0 && <Separator className="mb-6" />}
                    <div>
                      <h4 className="text-foreground font-semibold">{exp.title}</h4>
                      <p className="text-primary">{exp.company}</p>
                      <p className="text-muted-foreground text-sm">
                        {exp.location && `${exp.location} · `}
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-muted-foreground mt-2">{exp.description}</p>
                    )}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.highlights.map((highlight, i) => (
                          <li
                            key={i}
                            className="text-muted-foreground flex items-start gap-2 text-sm"
                          >
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
          )}

          {profile.education.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-muted-foreground h-5 w-5" />
                  <CardTitle>Education</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.education.map((edu: Education) => (
                  <div key={edu.id}>
                    <h4 className="text-foreground font-semibold">
                      {edu.degree} in {edu.field}
                    </h4>
                    <p className="text-primary">{edu.institution}</p>
                    <p className="text-muted-foreground text-sm">
                      {edu.startDate} – {edu.endDate ?? "Present"}
                      {edu.gpa && ` · GPA: ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {profile.skills.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Strength</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="h-24 w-24 -rotate-90 transform">
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
                  <span className="text-foreground absolute text-xl font-bold">
                    {profileStrength}%
                  </span>
                </div>
              </div>

              {profileStrength < 100 && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">
                    Complete these to improve your profile:
                  </p>
                  <ul className="space-y-2 text-sm">
                    {!profile.personalInfo.title && (
                      <li className="text-muted-foreground flex items-center gap-2">
                        <span className="bg-warning h-1.5 w-1.5 rounded-full" />
                        Add your job title
                      </li>
                    )}
                    {!profile.personalInfo.summary && (
                      <li className="text-muted-foreground flex items-center gap-2">
                        <span className="bg-warning h-1.5 w-1.5 rounded-full" />
                        Add a summary
                      </li>
                    )}
                    {(!profile.certifications || profile.certifications.length === 0) && (
                      <li className="text-muted-foreground flex items-center gap-2">
                        <span className="bg-warning h-1.5 w-1.5 rounded-full" />
                        Add certifications
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="text-primary h-5 w-5" />
                AI Enhancement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Let AI analyze and improve your profile for better job matches.
              </p>
              <Button className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Enhance with AI
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CV Versions</CardTitle>
              <CardDescription>Manage different versions of your CV</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                <div>
                  <p className="text-foreground text-sm font-medium">Main Profile</p>
                  <p className="text-muted-foreground text-xs">
                    Updated {new Date(profile.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge>Active</Badge>
              </div>
              <Button variant="outline" className="w-full" disabled>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate tailored CV
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ProfileContent = ({ user, profile: serverProfile }: ProfileContentProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<CandidateProfile> | undefined>(serverProfile);
  const [isSaving, setIsSaving] = useState(false);
  const formRef = useRef<CVFormStepHandle>(null);

  const handleSave = async () => {
    if (formRef.current && !formRef.current.validate()) return;

    setIsSaving(true);
    try {
      const res = await apiFetch("/api/candidate/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      }
    } catch (error) {
      browserLogger.error(error, "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setIsEditing(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-foreground text-2xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">Update your professional information</p>
          </div>
        </div>

        <CVFormStep
          ref={formRef}
          initialData={editData}
          onUpdate={setEditData}
          onNext={handleSave}
          user={user}
        />

        <div className="border-border flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            Save changes
          </Button>
        </div>
      </div>
    );
  }

  if (!serverProfile) {
    return <EmptyProfile />;
  }

  return (
    <ProfileView
      profile={serverProfile}
      user={user}
      onEdit={() => {
        setEditData(serverProfile);
        setIsEditing(true);
      }}
    />
  );
};

export default ProfileContent;
