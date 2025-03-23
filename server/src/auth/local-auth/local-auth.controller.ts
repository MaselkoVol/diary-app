import { Body, Controller, Post, Query, Session } from '@nestjs/common';
import { LocalAuthService } from './local-auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SessionInterface } from 'src/session/session.interface';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { PasswordDto } from './dto/password.dto';

@Controller('auth/local')
export class LocalAuthController {
  constructor(private authService: LocalAuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto, @Session() session: SessionInterface) {
    await this.authService.signUp(signUpDto, session);
    return { message: 'signed up successfully' };
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Session() session: SessionInterface) {
    const res = await this.authService.signIn(signInDto, session);
    if (res === 'NOT_ACTIVE') {
      return { message: 'signed in successfully, but account is not active', userType: res };
    }
    return { message: 'signed in successfully' };
  }

  @Post('send/activate-account')
  async sendActivateAccount(@Session() session: SessionInterface) {
    const token = await this.authService.sendActivateAccountVerification(session);
    return { message: token };
  }

  @Post('activate-account')
  async activateAccount(@Query() verifyTokenDto: VerifyTokenDto, @Session() session: SessionInterface) {
    await this.authService.activateAccount(verifyTokenDto.token, session);
    return { message: 'Account activated successfully' };
  }

  @Post('send/change-password')
  async sendChangePassword(@Session() session: SessionInterface) {
    const token = await this.authService.sendChangePasswordVerification(session);
    return { message: token };
  }

  @Post('change-password')
  async changePassword(
    @Body() passwordDto: PasswordDto,
    @Query() verifyTokenDto: VerifyTokenDto,
    @Session() session: SessionInterface
  ) {
    await this.authService.changePassword(verifyTokenDto.token, session, passwordDto.password);
    return { message: 'Password changed successfully' };
  }
}
