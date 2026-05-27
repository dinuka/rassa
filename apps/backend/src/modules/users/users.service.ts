import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { UserRole } from "@repo/shared-types";

import { User, UserDocument } from "./users.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | undefined> {
    return (await this.userModel.findOne({ email }).exec()) ?? undefined;
  }

  async findById(id: string): Promise<UserDocument | undefined> {
    return (await this.userModel.findOne({ id }).exec()) ?? undefined;
  }

  async findByProvider(provider: string, providerAccountId: string): Promise<UserDocument | undefined> {
    return (
      (await this.userModel
        .findOne({ providers: { $elemMatch: { provider, providerAccountId } } })
        .exec()) ?? undefined
    );
  }

  async findOrCreate(params: {
    email: string;
    name?: string;
    image?: string;
    provider: string;
    providerAccountId: string;
    role: UserRole;
  }): Promise<UserDocument> {
    let user = await this.findByProvider(params.provider, params.providerAccountId);
    if (user) return user;

    user = await this.findByEmail(params.email);
    if (user) {
      user.providers.push({
        provider: params.provider as "google" | "linkedin",
        providerAccountId: params.providerAccountId,
      });
      user.name ??= params.name;
      user.image ??= params.image;
      return user.save();
    }

    return this.userModel.create({
      email: params.email,
      name: params.name,
      image: params.image,
      role: params.role,
      onboardingComplete: false,
      providers: [{
        provider: params.provider as "google" | "linkedin",
        providerAccountId: params.providerAccountId,
      }],
    });
  }

  async completeOnboarding(userId: string): Promise<UserDocument | undefined> {
    return (
      (await this.userModel.findOneAndUpdate(
        { id: userId },
        { $set: { onboardingComplete: true } },
        { new: true },
      )) ?? undefined
    );
  }

  async updateRefreshTokenHash(userId: string, hash?: string): Promise<void> {
    await this.userModel.updateOne({ id: userId }, { $set: { refreshTokenHash: hash } }).exec();
  }
}
