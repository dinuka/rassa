process.env.MONGODB_URI = "mongodb://localhost:27017/test";
process.env.JWT_SECRET = "test-secret";

import { createHash } from "crypto";

import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import Redis from "ioredis";

import { UserRole } from "@repo/shared-types";

import { UsersService } from "../users/users.service";

import { AuthService } from "./auth.service";
import { OAuthCallbackDto } from "./dto/oauth-callback.dto";

jest.mock("ioredis");

describe("AuthService", () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let redis: Redis;

  const mockUser = {
    id: "test-uuid",
    email: "test@example.com",
    name: "Test User",
    role: UserRole.CANDIDATE,
    onboardingComplete: true,
    refreshTokenHash: null,
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findOrCreate: jest.fn(),
    updateRefreshTokenHash: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue("signed-token"),
    verify: jest.fn(),
  };

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: "REDIS_CLIENT", useValue: mockRedis },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    redis = module.get<Redis>("REDIS_CLIENT");
  });

  describe("oauthCallback", () => {
    it("should create a new user and return tokens", async () => {
      const dto: OAuthCallbackDto = {
        provider: "google",
        providerAccountId: "google-id-123",
        email: "new@example.com",
        name: "New User",
        portalSource: UserRole.CANDIDATE,
      };

      mockUsersService.findOrCreate.mockResolvedValue(mockUser);

      const result = await service.oauthCallback(dto);

      expect(result.accessToken).toBe("signed-token");
      expect(result.refreshToken).toBe("signed-token");
      expect(result.user).toEqual(
        expect.objectContaining({
          email: "test@example.com",
          role: UserRole.CANDIDATE,
        }),
      );
      expect(mockUsersService.findOrCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "new@example.com",
          role: UserRole.CANDIDATE,
        }),
      );
    });

    it("should return tokens for existing user", async () => {
      const dto: OAuthCallbackDto = {
        provider: "google",
        providerAccountId: "google-id-123",
        email: "existing@example.com",
        portalSource: UserRole.CANDIDATE,
      };

      mockUsersService.findOrCreate.mockResolvedValue(mockUser);

      const result = await service.oauthCallback(dto);

      expect(result.accessToken).toBe("signed-token");
      expect(result.user.email).toBe("test@example.com");
    });

    it("should reject admin sign-in for non-existent users", async () => {
      const dto: OAuthCallbackDto = {
        provider: "google",
        providerAccountId: "admin-google-id",
        email: "admin@example.com",
        portalSource: UserRole.ADMIN,
      };

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.oauthCallback(dto)).rejects.toThrow(ForbiddenException);
      expect(mockUsersService.findOrCreate).not.toHaveBeenCalled();
    });

    it("should reject admin sign-in for non-admin users", async () => {
      const dto: OAuthCallbackDto = {
        provider: "google",
        providerAccountId: "admin-google-id",
        email: "user@example.com",
        portalSource: UserRole.ADMIN,
      };

      mockUsersService.findByEmail.mockResolvedValue({ ...mockUser, role: UserRole.CANDIDATE });

      await expect(service.oauthCallback(dto)).rejects.toThrow(ForbiddenException);
    });

    it("should allow admin sign-in for existing admin users", async () => {
      const dto: OAuthCallbackDto = {
        provider: "google",
        providerAccountId: "admin-google-id",
        email: "admin@example.com",
        portalSource: UserRole.ADMIN,
      };

      const adminUser = { ...mockUser, role: UserRole.ADMIN };
      mockUsersService.findByEmail.mockResolvedValue(adminUser);

      const result = await service.oauthCallback(dto);

      expect(result.accessToken).toBe("signed-token");
      expect(result.user.role).toBe(UserRole.ADMIN);
    });

    it("should reject a company user signing in to the candidate portal", async () => {
      const dto: OAuthCallbackDto = {
        provider: "google",
        providerAccountId: "google-id-456",
        email: "company@example.com",
        portalSource: UserRole.CANDIDATE,
      };

      mockUsersService.findOrCreate.mockResolvedValue({ ...mockUser, role: UserRole.COMPANY });

      await expect(service.oauthCallback(dto)).rejects.toThrow(ForbiddenException);
    });

    it("should reject a candidate user signing in to the company portal", async () => {
      const dto: OAuthCallbackDto = {
        provider: "google",
        providerAccountId: "google-id-123",
        email: "candidate@example.com",
        portalSource: UserRole.COMPANY,
      };

      mockUsersService.findOrCreate.mockResolvedValue({ ...mockUser, role: UserRole.CANDIDATE });

      await expect(service.oauthCallback(dto)).rejects.toThrow(ForbiddenException);
    });

    it("should reject an admin user signing in to the candidate portal", async () => {
      const dto: OAuthCallbackDto = {
        provider: "google",
        providerAccountId: "google-id-admin",
        email: "admin@example.com",
        portalSource: UserRole.CANDIDATE,
      };

      mockUsersService.findOrCreate.mockResolvedValue({ ...mockUser, role: UserRole.ADMIN });

      await expect(service.oauthCallback(dto)).rejects.toThrow(ForbiddenException);
    });

    it("should allow a candidate user signing in to the candidate portal", async () => {
      const dto: OAuthCallbackDto = {
        provider: "google",
        providerAccountId: "google-id-123",
        email: "candidate@example.com",
        portalSource: UserRole.CANDIDATE,
      };

      mockUsersService.findOrCreate.mockResolvedValue({ ...mockUser, role: UserRole.CANDIDATE });

      const result = await service.oauthCallback(dto);

      expect(result.accessToken).toBe("signed-token");
    });

    it("should allow a company user signing in to the company portal", async () => {
      const dto: OAuthCallbackDto = {
        provider: "google",
        providerAccountId: "google-id-456",
        email: "company@example.com",
        portalSource: UserRole.COMPANY,
      };

      const companyUser = { ...mockUser, role: UserRole.COMPANY };
      mockUsersService.findOrCreate.mockResolvedValue(companyUser);

      const result = await service.oauthCallback(dto);

      expect(result.accessToken).toBe("signed-token");
      expect(result.user.role).toBe(UserRole.COMPANY);
    });
  });

  describe("refresh", () => {
    it("should issue new tokens for valid refresh token", async () => {
      const refreshToken = "valid-refresh-token";
      const tokenHash = createHash("sha256").update(refreshToken).digest("hex");
      mockRedis.get.mockResolvedValue(null);
      mockJwtService.verify.mockReturnValue({ sub: "test-uuid", exp: 9999999999 });
      mockUsersService.findById.mockResolvedValue({ ...mockUser, refreshTokenHash: tokenHash });

      const result = await service.refresh(refreshToken);

      expect(result.accessToken).toBe("signed-token");
    });

    it("should reject revoked refresh token", async () => {
      mockRedis.get.mockResolvedValue("1");

      await expect(service.refresh("revoked-token")).rejects.toThrow(UnauthorizedException);
    });

    it("should reject invalid refresh token", async () => {
      mockRedis.get.mockResolvedValue(null);
      mockJwtService.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(service.refresh("invalid-token")).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("logout", () => {
    it("should revoke the refresh token", async () => {
      mockJwtService.verify.mockReturnValue({ sub: "test-uuid", exp: 9999999999 });
      mockUsersService.findById.mockResolvedValue(mockUser);

      await service.logout("valid-refresh-token");

      expect(mockRedis.set).toHaveBeenCalled();
      expect(mockUsersService.updateRefreshTokenHash).toHaveBeenCalledWith("test-uuid", null);
    });

    it("should not throw for invalid token during logout", async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(service.logout("invalid-token")).resolves.not.toThrow();
    });
  });
});
