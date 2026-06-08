import { z } from "zod";

import {
  CertificationSchema,
  EducationSchema,
  ExperienceSchema,
  PersonalInfoSchema,
  ProjectSchema,
} from "./profile";

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

export type Cv = z.infer<typeof CvSchema>;
export type CV = Cv;
