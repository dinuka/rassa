import { Injectable, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";
import * as Minio from "minio";
import { extname } from "path";

import env from "../../config/env";

const streamToBuffer = async (stream: NodeJS.ReadableStream): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string));
  }
  return Buffer.concat(chunks);
};

@Injectable()
export class FilesService implements OnModuleInit {
  private readonly client = new Minio.Client({
    endPoint: env.minioEndpoint,
    port: env.minioPort,
    useSSL: false,
    accessKey: env.minioAccessKey,
    secretKey: env.minioSecretKey,
  });

  async onModuleInit() {
    const exists = await this.client.bucketExists(env.minioBucket);
    if (!exists) {
      await this.client.makeBucket(env.minioBucket);
    }
  }

  async upload(buffer: Buffer, originalName: string, mimetype: string): Promise<string> {
    const ext = extname(originalName) || ".bin";
    const objectKey = `${randomUUID()}${ext}`;

    await this.client.putObject(env.minioBucket, objectKey, buffer, buffer.length, {
      "Content-Type": mimetype,
    });

    return objectKey;
  }

  async download(objectKey: string): Promise<Buffer> {
    const stream = await this.client.getObject(env.minioBucket, objectKey);
    return streamToBuffer(stream);
  }
}
