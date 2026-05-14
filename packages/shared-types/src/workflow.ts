import { z } from "zod";

export const WorkflowStatusSchema = z.enum(["pending", "running", "completed", "failed"]);

export type WorkflowStatus = z.infer<typeof WorkflowStatusSchema>;

export const WorkflowSchema = z.object({
  id: z.string(),
  type: z.string(),
  status: WorkflowStatusSchema,
  payload: z.any(),
  result: z.any().optional(),
  error: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Workflow = z.infer<typeof WorkflowSchema>;
