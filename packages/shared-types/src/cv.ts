import { z } from "zod";

export const CvSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fileName: z.string(),
  skills: z.array(z.string()),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string(),
  })),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.number(),
  })),
  normalized: z.any().optional(),
});

export type Cv = z.infer<typeof CvSchema>;
