import multipart from "@fastify/multipart";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";
import env from "./config/env";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });

  app.setGlobalPrefix("api");
  app.enableCors({ origin: env.corsOrigin });

  await app.listen(env.port);
}
bootstrap();
