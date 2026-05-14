import { z } from "zod";

export const MatchResultSchema = z.object({
  jobId: z.string(),
  candidateId: z.string(),
  semanticScore: z.number().min(0).max(1),
  skillScore: z.number().min(0).max(1),
  experienceScore: z.number().min(0).max(1),
  overallScore: z.number().min(0).max(1),
  reasoning: z.string().optional(),
});

export type MatchResult = z.infer<typeof MatchResultSchema>;
