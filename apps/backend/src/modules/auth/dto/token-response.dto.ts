import { UserRole } from "@repo/shared-types";

export class TokenResponseDto {
  accessToken!: string;
  refreshToken!: string;
  user!: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role: UserRole;
    onboardingComplete: boolean;
  };
}
