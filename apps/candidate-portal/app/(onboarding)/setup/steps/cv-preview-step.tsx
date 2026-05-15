"use client";

import { Button, Card, CardContent, Badge } from "@repo/ui";
import { Edit2, Mail, Phone, MapPin, Briefcase, GraduationCap } from "lucide-react";
import type { CV } from "@repo/shared-types";

interface CVPreviewStepProps {
  data: Partial<CV> | null;
  onEdit: () => void;
}

export function CVPreviewStep({ data, onEdit }: CVPreviewStepProps) {
  if (!data) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No CV data to preview</p>
          <Button variant="outline" onClick={onEdit} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { personalInfo, experience, education, skills } = data;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8 space-y-8">
        {/* Header with edit button */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {personalInfo?.fullName || "Your Name"}
            </h2>
            {personalInfo?.title && (
              <p className="text-lg text-primary mt-1">{personalInfo.title}</p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {personalInfo?.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-4 w-4" />
              {personalInfo.email}
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-4 w-4" />
              {personalInfo.phone}
            </div>
          )}
          {personalInfo?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {personalInfo.location}
            </div>
          )}
        </div>

        {/* Summary */}
        {personalInfo?.summary && (
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
              Summary
            </h3>
            <p className="text-muted-foreground">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-border pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-foreground">{exp.title}</h4>
                      <p className="text-primary">{exp.company}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-border pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-foreground">
                        {edu.degree} in {edu.field}
                      </h4>
                      <p className="text-primary">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Completion message */}
        <div className="pt-4 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Your CV looks great! Click <span className="text-foreground font-medium">Complete Setup</span> to start exploring opportunities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
