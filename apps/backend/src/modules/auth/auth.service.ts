import { ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash } from "crypto";
import Redis from "ioredis";

import { UserRole } from "@repo/shared-types";

import env from "@/config/env";

import { UserDocument } from "../users/users.schema";
import { UsersService } from "../users/users.service";
import { OAuthCallbackDto } from "./dto/oauth-callback.dto";
import { TokenResponseDto } from "./dto/token-response.dto";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject("REDIS_CLIENT") private redis: Redis,
  ) {}

  async oauthCallback(dto: OAuthCallbackDto): Promise<TokenResponseDto> {
    if (dto.portalSource === UserRole.ADMIN) {
      const user = await this.usersService.findByEmail(dto.email);
      if (!user || user.role !== UserRole.ADMIN) {
        throw new ForbiddenException("Admin access denied");
      }
      return this.generateTokens(user);
    }

    const user = await this.usersService.findOrCreate({
      email: dto.email,
      name: dto.name,
      image: dto.image,
      provider: dto.provider,
      providerAccountId: dto.providerAccountId,
      role: dto.portalSource,
    });

    if (user.role !== dto.portalSource) {
      throw new ForbiddenException("Access denied for this portal");
    }

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string): Promise<TokenResponseDto> {
    const revoked = await this.redis.get(`revoked:${hashToken(refreshToken)}`);
    if (revoked) {
      throw new UnauthorizedException("Refresh token revoked");
    }

    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const tokenHash = hashToken(refreshToken);
      if (user.refreshTokenHash !== tokenHash) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const ttl = Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
      if (ttl > 0) {
        await this.redis.set(`revoked:${hashToken(refreshToken)}`, "1", "EX", ttl);
      }

      const user = await this.usersService.findById(payload.sub);
      if (user) {
        await this.usersService.updateRefreshTokenHash(user.id);
      }
    } catch {
      // Ignore invalid tokens during logout
    }
  }

  private async generateTokens(user: UserDocument): Promise<TokenResponseDto> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: env.jwtExpiration,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: env.jwtRefreshExpiration,
    });

    const tokenHash = hashToken(refreshToken);
    await this.usersService.updateRefreshTokenHash(user.id, tokenHash);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        onboardingComplete: user.onboardingComplete ?? false,
      },
    };
  }
}
