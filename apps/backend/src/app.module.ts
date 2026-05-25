import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import env from "./config/env";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "../../.env" }),
    MongooseModule.forRoot(env.mongodbUri),
    BullModule.forRoot({ connection: { host: env.redisHost, port: env.redisPort } }),
  ],
})
export class AppModule {}
