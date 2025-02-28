import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { appConfig } from 'src/config/configuration';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class SignUpDto {
  @IsString({ message: i18n('validation.NOT_STRING') })
  @MinLength(appConfig.auth.nameMinLen(), {
    message: i18n('validation.MIN_LEN'),
  })
  @MaxLength(appConfig.auth.nameMaxLen(), {
    message: i18n('validation.MAX_LEN'),
  })
  name: string;

  @IsEmail({}, { message: i18n('validation.INVALID') })
  email: string;

  @IsString({ message: i18n('validation.NOT_STRING') })
  @MinLength(appConfig.auth.passwordMinLen(), {
    message: i18n('validation.MIN_LEN'),
  })
  @MaxLength(appConfig.auth.passwordMaxLen(), {
    message: i18n('validation.MAX_LEN'),
  })
  password: string;
}
