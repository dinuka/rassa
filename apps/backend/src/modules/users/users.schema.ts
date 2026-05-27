import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { randomUUID } from "crypto";
import { HydratedDocument } from "mongoose";

import { UserRole } from "@repo/shared-types";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, default: () => randomUUID(), unique: true })
  id!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop()
  name?: string;

  @Prop()
  image?: string;

  @Prop({ required: true, type: String, enum: UserRole })
  role!: UserRole;

  @Prop({ default: false })
  onboardingComplete!: boolean;

  @Prop({
    type: [
      {
        provider: { type: String, enum: ["google", "linkedin"], required: true },
        providerAccountId: { type: String, required: true },
      },
    ],
    default: [],
    _id: false,
  })
  providers!: Array<{ provider: "google" | "linkedin"; providerAccountId: string }>;

  @Prop()
  refreshTokenHash?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
