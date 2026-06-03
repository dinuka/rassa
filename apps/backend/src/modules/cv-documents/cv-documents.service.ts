import type { MultipartFile } from "@fastify/multipart";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Queue } from "bullmq";
import { randomUUID } from "crypto";
import { Model } from "mongoose";

import { FilesService } from "../files/files.service";
import { CV_PARSE_QUEUE } from "./cv-documents.constants";
import { CvParseJob, CvParseJobDocument, JobStatus } from "./cv-parse-job.schema";
import type { CvParseJobData } from "./cv-parse.processor";

@Injectable()
export class CvDocumentsService {
  private readonly logger = new Logger(CvDocumentsService.name);

  constructor(
    @InjectModel(CvParseJob.name) private readonly cvParseJobModel: Model<CvParseJobDocument>,
    @InjectQueue(CV_PARSE_QUEUE) private readonly cvParseQueue: Queue<CvParseJobData>,
    private readonly filesService: FilesService,
  ) {}

  async enqueueParseJob(file: MultipartFile): Promise<{ jobId: string }> {
    const buffer = await file.toBuffer();
    this.logger.debug(`Buffered file: filename=${file.filename} size=${buffer.length}B`);

    this.logger.debug(`Uploading CV to object storage: filename=${file.filename}`);
    const objectKey = await this.filesService.upload(buffer, file.filename, file.mimetype);
    this.logger.debug(`CV uploaded to object storage: key=${objectKey}`);

    const jobId = randomUUID();
    await this.cvParseJobModel.create({
      id: jobId,
      objectKey,
      filename: file.filename,
      mimetype: file.mimetype,
    });

    await this.cvParseQueue.add("parse", {
      jobId,
      objectKey,
      filename: file.filename,
      mimetype: file.mimetype,
    });
    this.logger.debug(`CV parse job enqueued: jobId=${jobId} filename=${file.filename}`);

    return { jobId };
  }

  async getJobStatus(
    jobId: string,
  ): Promise<{ status: JobStatus; result?: CvParseJob["result"]; error?: string }> {
    const job = await this.cvParseJobModel.findOne({ id: jobId }).lean();
    if (!job) throw new NotFoundException(`Job ${jobId} not found`);

    return { status: job.status, result: job.result, error: job.error };
  }
}
