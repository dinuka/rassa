import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import env from "./config/env";
import { AiGatewayModule } from "./modules/ai-gateway/ai-gateway.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CandidatesModule } from "./modules/candidates/candidates.module";
import { CvDocumentsModule } from "./modules/cv-documents/cv-documents.module";
import { FilesModule } from "./modules/files/files.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env", "../../.env"] }),
    MongooseModule.forRoot(env.mongodbUri),
    BullModule.forRoot({ connection: { host: env.redisHost, port: env.redisPort } }),
    UsersModule,
    AuthModule,
    CandidatesModule,
    FilesModule,
    AiGatewayModule,
    CvDocumentsModule,
  ],
})
export class AppModule {}
