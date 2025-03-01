import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private i18n: I18nService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.session || !('userId' in request.session) || !request.session.userId) {
      throw new ForbiddenException(this.i18n.t('validation.ACCOUNT_FORBIDDEN'));
    }

    return true;
  }
}
