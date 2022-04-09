import { AuthService } from './auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class authGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req, accessToken } = this.authService.getTokensFromContext(context);
    if (!accessToken) return false;
    const verified = this.authService.jwtVerification(accessToken);
    if (verified.message)
      throw new UnauthorizedException(`${verified.message}`);
    await this.authService.findUser(verified.userId);
    req.user = verified.userId;
    return true;
  }
}
