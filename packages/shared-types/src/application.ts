import { z } from "zod";

export const ApplicationSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  candidateId: z.string(),
  cvId: z.string(),
  status: z.enum(["pending", "reviewing", "interview", "rejected", "accepted"]),
  matchScore: z.number().optional(),
  createdAt: z.string(),
});

export type Application = z.infer<typeof ApplicationSchema>;
