import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { FastifyRequest } from "fastify";

import { CvDocumentsService } from "./cv-documents.service";

const ALLOWED_MIMETYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

@Controller("cv-documents")
export class CvDocumentsController {
  private readonly logger = new Logger(CvDocumentsController.name);

  constructor(private readonly cvDocumentsService: CvDocumentsService) {}

  @Post("parse")
  @UseGuards(AuthGuard("jwt"))
  async parse(@Req() req: FastifyRequest) {
    if (!req.isMultipart()) {
      throw new BadRequestException("Request must be multipart/form-data");
    }

    const file = await req.file();
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    if (!ALLOWED_MIMETYPES.has(file.mimetype)) {
      throw new BadRequestException("Only PDF and DOCX files are supported");
    }

    this.logger.debug(
      `CV parse request received: filename=${file.filename} mimetype=${file.mimetype}`,
    );

    return this.cvDocumentsService.enqueueParseJob(file);
  }

  @Get("parse/:jobId/status")
  @UseGuards(AuthGuard("jwt"))
  async getParseStatus(@Param("jobId") jobId: string) {
    this.logger.debug(`CV parse status requested: jobId=${jobId}`);
    return this.cvDocumentsService.getJobStatus(jobId);
  }
}
