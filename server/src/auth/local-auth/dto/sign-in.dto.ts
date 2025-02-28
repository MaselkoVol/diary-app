import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';
export class SignInDto {
  @IsEmail({}, { message: i18n('validation.INVALID') })
  email: string;

  @IsString({ message: i18n('validation.NOT_STRING') })
  @IsNotEmpty({
    message: i18n('validation.EMPTY'),
  })
  @MaxLength(100, {
    message: i18n('validation.MAX_LEN'),
  })
  password: string;
}
