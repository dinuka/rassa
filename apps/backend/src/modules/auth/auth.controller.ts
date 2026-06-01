import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { OAuthCallbackDto } from "./dto/oauth-callback.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("oauth-callback")
  async oauthCallback(@Body() dto: OAuthCallbackDto) {
    return this.authService.oauthCallback(dto);
  }

  @Post("refresh")
  async refresh(@Body("refreshToken") refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post("logout")
  async logout(@Body("refreshToken") refreshToken: string) {
    await this.authService.logout(refreshToken);
    return { success: true };
  }
}
