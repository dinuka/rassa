import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Job } from "bullmq";
import { Model } from "mongoose";

import { AiGatewayService } from "../ai-gateway/ai-gateway.service";
import { FilesService } from "../files/files.service";
import { CV_PARSE_QUEUE } from "./cv-documents.constants";
import { CvParseJob, CvParseJobDocument, JobStatus } from "./cv-parse-job.schema";

export interface CvParseJobData {
  jobId: string;
  objectKey: string;
  filename: string;
  mimetype: string;
}

@Processor(CV_PARSE_QUEUE)
export class CvParseProcessor extends WorkerHost {
  private readonly logger = new Logger(CvParseProcessor.name);

  constructor(
    @InjectModel(CvParseJob.name) private readonly cvParseJobModel: Model<CvParseJobDocument>,
    private readonly filesService: FilesService,
    private readonly aiGatewayService: AiGatewayService,
  ) {
    super();
  }

  async process(job: Job<CvParseJobData>): Promise<void> {
    const { jobId, objectKey, filename, mimetype } = job.data;
    this.logger.debug(`Processing CV parse job: jobId=${jobId} filename=${filename}`);

    try {
      const buffer = await this.filesService.download(objectKey);
      this.logger.debug(
        `Downloaded file from object storage: jobId=${jobId} size=${buffer.length}B`,
      );

      const result = await this.aiGatewayService.parseCv(buffer, filename, mimetype);
      this.logger.debug(`AI service parse complete: jobId=${jobId}`);

      await this.cvParseJobModel.updateOne({ id: jobId }, { status: JobStatus.DONE, result });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`CV parse job failed: jobId=${jobId} error=${message}`);
      await this.cvParseJobModel.updateOne(
        { id: jobId },
        { status: JobStatus.FAILED, error: message },
      );
    }
  }
}
