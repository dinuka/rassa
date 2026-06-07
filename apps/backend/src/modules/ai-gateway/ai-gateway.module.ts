import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { AiGatewayService } from "./ai-gateway.service";

@Module({
  imports: [HttpModule],
  providers: [AiGatewayService],
  exports: [AiGatewayService],
})
export class AiGatewayModule {}
