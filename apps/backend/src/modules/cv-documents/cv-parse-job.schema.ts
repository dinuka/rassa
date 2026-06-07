import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { randomUUID } from "crypto";
import { HydratedDocument } from "mongoose";

import { ParsedCvDto } from "./dto/parsed-cv.dto";

export enum JobStatus {
  PENDING = "pending",
  DONE = "done",
  FAILED = "failed",
}

export type CvParseJobDocument = HydratedDocument<CvParseJob>;

@Schema({ timestamps: true })
export class CvParseJob {
  @Prop({ type: String, default: () => randomUUID(), unique: true })
  id!: string;

  @Prop({ required: true, type: String, enum: JobStatus, default: JobStatus.PENDING })
  status!: JobStatus;

  @Prop({ required: true })
  objectKey!: string;

  @Prop({ required: true })
  filename!: string;

  @Prop({ required: true })
  mimetype!: string;

  @Prop({ type: Object })
  result?: ParsedCvDto;

  @Prop()
  error?: string;
}

export const CvParseJobSchema = SchemaFactory.createForClass(CvParseJob);
