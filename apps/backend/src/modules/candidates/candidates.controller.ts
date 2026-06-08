import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { FastifyRequest } from "fastify";

import { CandidatesService } from "./candidates.service";
import { SaveProfileDto } from "./dto/save-profile.dto";

type AuthenticatedRequest = FastifyRequest & {
  user: { id: string; email: string; role: string };
};

@Controller("candidate")
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post("profile")
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createProfile(@Req() req: AuthenticatedRequest, @Body() dto: SaveProfileDto) {
    return this.candidatesService.createProfile(req.user.id, dto);
  }

  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  async getProfile(@Req() req: AuthenticatedRequest) {
    return this.candidatesService.getProfile(req.user.id);
  }

  @Put("profile")
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateProfile(@Req() req: AuthenticatedRequest, @Body() dto: SaveProfileDto) {
    return this.candidatesService.updateProfile(req.user.id, dto);
  }
}
