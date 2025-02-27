import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString({ message: `Name should be a string` })
  @MinLength(3, { message: `Name should be at least ${30} characters long` })
  @MaxLength(30, { message: `Name should be maximum ${30} characters long` })
  name: string;

  @IsEmail({}, { message: `Email should be valid` })
  email: string;

  @IsString({ message: `Password should be a string` })
  @MinLength(8, {
    message: `Password should be at least ${8} characters long`,
  })
  @MaxLength(100, {
    message: `Password should be maximum ${100} characters long`,
  })
  password: string;
}
