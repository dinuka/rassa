import { z } from "zod";

export const PersonalInfoSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  location: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
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
  createdAt: z.string(),
  updatedAt: z.string(),
  normalized: z.any().optional(),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Cv = z.infer<typeof CvSchema>;

export type CV = Cv;
