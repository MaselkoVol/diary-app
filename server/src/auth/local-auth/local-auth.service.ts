import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignUp } from './interfaces/sign-up.interface';
import { SignIn } from './interfaces/sign-in.interface';
import { SessionInterface } from 'src/common/interfaces/session.interface';
import { appConfig } from 'src/config/configuration';
import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class LocalAuthService {
  constructor(
    private dataSource: DataSource,
    private i18n: I18nService
  ) {}
  private manager = this.dataSource.manager;

  async signUp({ name, email, password }: SignUp) {
    // check if user already exists
    const userExists = await this.manager.findOneBy(User, { email });
    if (userExists) {
      throw new ConflictException(this.i18n.t('validation.EMAIL_CONFLICT', { lang: 'uk' }));
    }

    // hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, appConfig.auth.passwordSalt());

    // put user into the database, isActive = false by default
    const user = this.manager.create(User, { name, email, password: hashedPassword });
    await this.manager.save(user);
  }

  async signIn({ email, password }: SignIn, session: SessionInterface) {
    // check if user email exists
    const user = await this.manager.findOneBy(User, { email });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    session.userId = user.id;
  }
}
