import { z } from "zod";

export const JobSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  title: z.string(),
  description: z.string(),
  requiredSkills: z.array(z.string()),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
});

export type Job = z.infer<typeof JobSchema>;
