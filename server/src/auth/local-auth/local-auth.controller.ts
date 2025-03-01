import { Body, Controller, Post, Session } from '@nestjs/common';
import { LocalAuthService } from './local-auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SessionInterface } from 'src/session/session.interface';

@Controller('auth/local')
export class LocalAuthController {
  constructor(private authService: LocalAuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
    return { message: 'User created successfully' };
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Session() session: SessionInterface) {
    await this.authService.signIn(signInDto, session);
    return { message: 'Signed in successfully' };
  }
}
