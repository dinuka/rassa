import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CandidateProfile, CandidateProfileDocument } from "./candidate-profile.schema";
import { SaveProfileDto } from "./dto/save-profile.dto";

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(CandidateProfile.name)
    private readonly profileModel: Model<CandidateProfileDocument>,
  ) {}

  async createProfile(userId: string, dto: SaveProfileDto): Promise<CandidateProfileDocument> {
    const existing = await this.profileModel.findOne({ userId }).lean();
    if (existing) throw new ConflictException("Profile already exists");

    return this.profileModel.create({ userId, ...dto });
  }

  async getProfile(userId: string): Promise<CandidateProfileDocument> {
    const profile = await this.profileModel.findOne({ userId }).lean();
    if (!profile) throw new NotFoundException("Profile not found");
    return profile as CandidateProfileDocument;
  }

  async updateProfile(userId: string, dto: SaveProfileDto): Promise<CandidateProfileDocument> {
    const profile = await this.profileModel
      .findOneAndUpdate({ userId }, { $set: dto }, { new: true })
      .lean();
    if (!profile) throw new NotFoundException("Profile not found");
    return profile as CandidateProfileDocument;
  }
}
