import { IsEmail, IsEnum, IsOptional, IsString, IsUrl } from "class-validator";

import { UserRole } from "@repo/shared-types";

export class OAuthCallbackDto {
  @IsString()
  provider!: "google" | "linkedin";

  @IsString()
  providerAccountId!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsEnum(UserRole)
  portalSource!: UserRole;
}
