import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AiGatewayModule } from "../ai-gateway/ai-gateway.module";
import { FilesModule } from "../files/files.module";
import { CV_PARSE_QUEUE } from "./cv-documents.constants";
import { CvDocumentsController } from "./cv-documents.controller";
import { CvDocumentsService } from "./cv-documents.service";
import { CvParseJob, CvParseJobSchema } from "./cv-parse-job.schema";
import { CvParseProcessor } from "./cv-parse.processor";

@Module({
  imports: [
    FilesModule,
    AiGatewayModule,
    MongooseModule.forFeature([{ name: CvParseJob.name, schema: CvParseJobSchema }]),
    BullModule.registerQueue({ name: CV_PARSE_QUEUE }),
  ],
  controllers: [CvDocumentsController],
  providers: [CvDocumentsService, CvParseProcessor],
})
export class CvDocumentsModule {}
