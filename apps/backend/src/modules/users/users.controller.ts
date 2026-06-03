import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FastifyRequest } from "fastify";

import { UsersService } from "./users.service";

type AuthenticatedRequest = FastifyRequest & {
  user: { id: string; email: string; role: string };
};

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  async getMe(@Req() req: AuthenticatedRequest) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) return { error: "User not found" };
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      onboardingComplete: user.onboardingComplete,
    };
  }

  @Post("me/complete-onboarding")
  @UseGuards(AuthGuard("jwt"))
  async completeOnboarding(@Req() req: AuthenticatedRequest) {
    const user = await this.usersService.completeOnboarding(req.user.id);
    if (!user) return { error: "User not found" };
    return { success: true };
  }

  @Get("me/stats")
  @UseGuards(AuthGuard("jwt"))
  async getStats() {
    // Stub until cv-documents, applications, and invitations modules are implemented
    return {
      cvComplete: false,
      applicationsCount: 0,
      invitationsCount: 0,
      matchedJobs: 0,
    };
  }
}
