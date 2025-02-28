import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { appConfig } from 'src/config/configuration';

export class SignUpDto {
  @IsString({ message: `Name should be a string` })
  @MinLength(appConfig.auth.nameMinLen(), {
    message: `Name should be at least ${appConfig.auth.nameMinLen()} characters long`,
  })
  @MaxLength(appConfig.auth.nameMaxLen(), {
    message: `Name should be maximum ${appConfig.auth.nameMaxLen()} characters long`,
  })
  name: string;

  @IsEmail({}, { message: `Email should be valid` })
  email: string;

  @IsString({ message: `Password should be a string` })
  @MinLength(appConfig.auth.passwordMinLen(), {
    message: `Password should be at least ${appConfig.auth.passwordMinLen()} characters long`,
  })
  @MaxLength(appConfig.auth.passwordMaxLen(), {
    message: `Password should be maximum ${appConfig.auth.passwordMaxLen()} characters long`,
  })
  password: string;
}
