import { IsString } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class VerifyTokenDto {
  @IsString({ message: i18n('validation.NOT_STRING') })
  token: string;
}
