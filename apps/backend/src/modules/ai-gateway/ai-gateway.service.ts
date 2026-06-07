import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import env from "../../config/env";
import { ParsedCvDto } from "../cv-documents/dto/parsed-cv.dto";

@Injectable()
export class AiGatewayService {
  private readonly logger = new Logger(AiGatewayService.name);

  constructor(private readonly http: HttpService) {}

  async parseCv(buffer: Buffer, filename: string, mimetype: string): Promise<ParsedCvDto> {
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buffer)], { type: mimetype }), filename);

    this.logger.debug(
      `Calling AI service: POST ${env.aiServiceUrl}/api/cv/analyze filename=${filename} size=${buffer.length}B`,
    );

    const { data } = await firstValueFrom(
      this.http.post<ParsedCvDto>(`${env.aiServiceUrl}/api/cv/analyze`, form),
    );

    this.logger.debug(`AI service response received: filename=${filename}`);

    return data;
  }
}
