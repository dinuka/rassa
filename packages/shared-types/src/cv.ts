import { z } from "zod";

export const LinkSchema = z.object({
  name: z.string(),
  href: z.string().url("Must be a valid URL (include https://)"),
});

export const PersonalInfoSchema = z.object({
  fullName: z.string(),
  email: z.string().email("Must be a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^\+?[1-9]\d{6,14}$/.test(v.replace(/[\s\-().]/g, "")),
      "Must be a valid phone number (e.g. +44 7700 900000)",
    ),
  location: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  links: z.array(LinkSchema).optional(),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  title: z.string(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
});

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string().optional(),
  date: z.string().optional(),
});

export const CvSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fileName: z.string().optional(),
  version: z.number().optional(),
  isActive: z.boolean().optional(),
  personalInfo: PersonalInfoSchema,
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(z.string()),
  projects: z.array(ProjectSchema).optional(),
  certifications: z.array(CertificationSchema).optional(),
  extraCurricular: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  normalized: z.any().optional(),
});

export type CvLink = z.infer<typeof LinkSchema>;
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Cv = z.infer<typeof CvSchema>;

export type CV = Cv;
