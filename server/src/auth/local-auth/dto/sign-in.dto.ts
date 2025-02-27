import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: `Email should be valid` })
  email: string;

  @IsString({ message: `Password should be a string` })
  @IsNotEmpty({
    message: `Password should be not empty`,
  })
  @MaxLength(100, {
    message: `Password should be maximum ${100} characters long`,
  })
  password: string;
}
