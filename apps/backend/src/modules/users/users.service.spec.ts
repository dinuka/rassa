import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

import { UserRole } from "@repo/shared-types";

import { User } from "./users.schema";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let service: UsersService;
  let mockUserModel: {
    findOne: jest.Mock;
    create: jest.Mock;
    findOneAndUpdate: jest.Mock;
    updateOne: jest.Mock;
  };

  const mockUser = {
    id: "test-uuid",
    email: "test@example.com",
    name: "Test User",
    role: UserRole.CANDIDATE,
    onboardingComplete: false,
    providers: [{ provider: "google", providerAccountId: "google-id-123" }],
  };

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      findOneAndUpdate: jest.fn(),
      updateOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe("findByEmail", () => {
    it("should find a user by email", async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      const result = await service.findByEmail("test@example.com");
      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    });

    it("should return undefined when user not found", async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      const result = await service.findByEmail("nonexistent@example.com");
      expect(result).toBeUndefined();
    });
  });

  describe("findById", () => {
    it("should find a user by id", async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      const result = await service.findById("test-uuid");
      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ id: "test-uuid" });
    });
  });

  describe("findOrCreate", () => {
    it("should find existing user by provider", async () => {
      mockUserModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      const result = await service.findOrCreate({
        email: "test@example.com",
        provider: "google",
        providerAccountId: "google-id-123",
        role: UserRole.CANDIDATE,
      });
      expect(result).toEqual(mockUser);
    });

    it("should find existing user by email and link provider", async () => {
      const savedUser = {
        ...mockUser,
        providers: [
          { provider: "google" as const, providerAccountId: "google-id-123" },
          { provider: "google" as const, providerAccountId: "google-id-456" },
        ],
      };
      const userWithoutProvider = {
        ...mockUser,
        providers: [{ provider: "google", providerAccountId: "google-id-123" }] as Array<{ provider: "google" | "linkedin"; providerAccountId: string }>,
        save: jest.fn().mockResolvedValue(savedUser),
      };
      mockUserModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(undefined),
      });
      mockUserModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(userWithoutProvider),
      });
      const result = await service.findOrCreate({
        email: "test@example.com",
        provider: "google",
        providerAccountId: "google-id-456",
        role: UserRole.CANDIDATE,
      });
      expect(result.providers).toContainEqual({
        provider: "google",
        providerAccountId: "google-id-456",
      });
    });

    it("should create a new user", async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(undefined),
      });
      mockUserModel.create.mockResolvedValue(mockUser);
      const result = await service.findOrCreate({
        email: "new@example.com",
        name: "New User",
        provider: "google",
        providerAccountId: "google-new",
        role: UserRole.CANDIDATE,
      });
      expect(result).toEqual(mockUser);
      expect(mockUserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "new@example.com",
          role: UserRole.CANDIDATE,
        }),
      );
    });
  });

  describe("completeOnboarding", () => {
    it("should set onboardingComplete to true", async () => {
      const updatedUser = { ...mockUser, onboardingComplete: true };
      mockUserModel.findOneAndUpdate.mockResolvedValue(updatedUser);
      const result = await service.completeOnboarding("test-uuid");
      expect(result?.onboardingComplete).toBe(true);
      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: "test-uuid" },
        { $set: { onboardingComplete: true } },
        { new: true },
      );
    });
  });

  describe("updateRefreshTokenHash", () => {
    it("should update refresh token hash", async () => {
      mockUserModel.updateOne.mockReturnValue({ exec: jest.fn().mockResolvedValue({}) });
      await service.updateRefreshTokenHash("test-uuid", "hash-value");
      expect(mockUserModel.updateOne).toHaveBeenCalledWith(
        { id: "test-uuid" },
        { $set: { refreshTokenHash: "hash-value" } },
      );
    });
  });
});
