import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CandidateProfile, CandidateProfileSchema } from "./candidate-profile.schema";
import { CandidatesController } from "./candidates.controller";
import { CandidatesService } from "./candidates.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CandidateProfile.name, schema: CandidateProfileSchema }]),
  ],
  controllers: [CandidatesController],
  providers: [CandidatesService],
  exports: [CandidatesService],
})
export class CandidatesModule {}
