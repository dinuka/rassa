import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import env from "./config/env";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "../../.env" }),
    MongooseModule.forRoot(env.mongodbUri),
    BullModule.forRoot({ connection: { host: env.redisHost, port: env.redisPort } }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
