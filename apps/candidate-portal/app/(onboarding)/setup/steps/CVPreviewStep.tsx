"use client";

import {
  Award,
  Briefcase,
  Edit2,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Star,
} from "lucide-react";

import type { CV } from "@repo/shared-types";
import { Badge, Button, Card, CardContent } from "@repo/ui";

interface CVPreviewStepProps {
  data: Partial<CV> | undefined;
  onEdit: () => void;
}

const CVPreviewStep = ({ data, onEdit }: CVPreviewStepProps) => {
  if (!data) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No CV data to preview</p>
          <Button variant="outline" onClick={onEdit} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { personalInfo, experience, education, skills, projects, certifications, extraCurricular } =
    data;

  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="space-y-8 p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-foreground text-2xl font-bold">
              {personalInfo?.fullName || "Your Name"}
            </h2>
            {personalInfo?.title && (
              <p className="text-primary mt-1 text-lg">{personalInfo.title}</p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>

        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
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
          {personalInfo?.links &&
            personalInfo.links.length > 0 &&
            personalInfo.links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                {link.name}
              </a>
            ))}
        </div>

        {personalInfo?.summary && (
          <div>
            <h3 className="text-foreground mb-2 text-sm font-semibold tracking-wider uppercase">
              Summary
            </h3>
            <p className="text-muted-foreground">{personalInfo.summary}</p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div>
            <h3 className="text-foreground mb-4 flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
              <Briefcase className="h-4 w-4" />
              Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-border border-l-2 pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-foreground font-medium">{exp.title}</h4>
                      <p className="text-primary">{exp.company}</p>
                      {exp.location && (
                        <p className="text-muted-foreground text-sm">{exp.location}</p>
                      )}
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-muted-foreground mt-2 text-sm">{exp.description}</p>
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
            </div>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div>
            <h3 className="text-foreground mb-4 flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
              <Rocket className="h-4 w-4" />
              Projects
            </h3>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="border-border border-l-2 pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-foreground font-medium">{proj.name}</h4>
                      {proj.role && <p className="text-primary text-sm">{proj.role}</p>}
                    </div>
                    {(proj.startDate || proj.endDate) && (
                      <span className="text-muted-foreground text-sm">
                        {proj.startDate}{" "}
                        {proj.endDate ? `- ${proj.current ? "Present" : proj.endDate}` : ""}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-muted-foreground mt-2 text-sm">{proj.description}</p>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {proj.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div>
            <h3 className="text-foreground mb-4 flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
              <GraduationCap className="h-4 w-4" />
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-border border-l-2 pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-foreground font-medium">
                        {edu.degree} in {edu.field}
                      </h4>
                      <p className="text-primary">{edu.institution}</p>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div>
            <h3 className="text-foreground mb-4 flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
              <Award className="h-4 w-4" />
              Certifications
            </h3>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="border-border border-l-2 pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-foreground font-medium">{cert.name}</h4>
                      {cert.issuer && <p className="text-primary text-sm">{cert.issuer}</p>}
                    </div>
                    {cert.date && (
                      <span className="text-muted-foreground text-sm">{cert.date}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div>
            <h3 className="text-foreground mb-3 text-sm font-semibold tracking-wider uppercase">
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

        {extraCurricular && extraCurricular.length > 0 && (
          <div>
            <h3 className="text-foreground mb-3 flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
              <Star className="h-4 w-4" />
              Extra-Curricular
            </h3>
            <ul className="space-y-1">
              {extraCurricular.map((item, i) => (
                <li key={i} className="text-muted-foreground flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-border border-t pt-4 text-center">
          <p className="text-muted-foreground text-sm">
            Your CV looks great! Click{" "}
            <span className="text-foreground font-medium">Complete Setup</span> to start exploring
            opportunities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVPreviewStep;
