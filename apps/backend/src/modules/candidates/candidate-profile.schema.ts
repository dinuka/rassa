import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { randomUUID } from "crypto";
import { HydratedDocument } from "mongoose";

export type CandidateProfileDocument = HydratedDocument<CandidateProfile>;

@Schema({ timestamps: true })
export class CandidateProfile {
  @Prop({ type: String, default: () => randomUUID(), unique: true })
  id!: string;

  @Prop({ required: true, type: String, unique: true })
  userId!: string;

  @Prop({ required: true, type: Object })
  personalInfo!: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    title?: string;
    summary?: string;
    links?: Array<{ name: string; href: string }>;
  };

  @Prop({ type: [Object], _id: false, default: [] })
  experience!: Array<{
    id: string;
    company: string;
    title: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    highlights?: string[];
  }>;

  @Prop({ type: [Object], _id: false, default: [] })
  education!: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
  }>;

  @Prop({ type: [String], default: [] })
  skills!: string[];

  @Prop({ type: [Object], _id: false })
  projects?: Array<{
    id: string;
    name: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    technologies?: string[];
  }>;

  @Prop({ type: [Object], _id: false })
  certifications?: Array<{
    id: string;
    name: string;
    issuer?: string;
    date?: string;
  }>;

  @Prop({ type: [String] })
  extraCurricular?: string[];
}

export const CandidateProfileSchema = SchemaFactory.createForClass(CandidateProfile);
