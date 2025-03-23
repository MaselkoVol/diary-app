import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUp } from './interfaces/sign-up.interface';
import { SignIn } from './interfaces/sign-in.interface';
import { SessionInterface } from 'src/session/session.interface';
import { appConfig } from 'src/config/configuration';
import { DataSource, LessThan } from 'typeorm';
import { User } from 'src/users/user.entity';
import { I18nService } from 'nestjs-i18n';
import { EmailVerification } from '../email-verification.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { getExpirationDateWithoutTimeZone } from 'src/common/utils/get-expiration-date-without-time-zone';
import { getActivateAccountHTMLTemplateString } from 'src/common/utils/get-activatea-account-HTML-template-string';
import { getChangePasswordTemplateString } from 'src/common/utils/get-change-password-template-string';

@Injectable()
export class LocalAuthService {
  constructor(
    private dataSource: DataSource,
    private i18n: I18nService,
    private mailerService: MailerService
  ) {}
  private manager = this.dataSource.manager;

  async signUp({ name, email, password }: SignUp, session: SessionInterface) {
    // check if user already exists
    const userExists = await this.manager.findOneBy(User, { email });
    if (userExists) {
      throw new ConflictException(this.i18n.t('validation.AUTH_CONFLICT'));
    }

    // hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, appConfig.auth.passwordSalt());

    // put user into the database, isActive = false by default
    const user = this.manager.create(User, { name, email, password: hashedPassword });
    await this.manager.save(user);

    // delete limited amount of not active users from database
    const expirationDate = getExpirationDateWithoutTimeZone(appConfig.auth.notActiveUserMaxAge());
    await this.cleanupExpiredNotActiveUsers(expirationDate);

    session.userId = user.id;
  }

  async cleanupExpiredNotActiveUsers(expirationDate: Date) {
    // delete limited amount of not active users
    const expiredUsers = await this.manager.find(User, {
      where: { createdAt: LessThan(expirationDate), isActive: false },
      take: appConfig.auth.notActiveUserCleanupLimit(),
    });
    if (expiredUsers.length > 0) {
      await this.manager.remove(User, expiredUsers);
    }
  }

  // send email to activate account
  async sendActivateAccountVerification(session: SessionInterface) {
    const userId = session.userId;
    // get user from database
    const user = await this.manager.findOne(User, { where: { id: userId } });
    if (!user) throw new NotFoundException(this.i18n.t('validation.USER_NOT_FOUND'));
    // if user already active, throw an exception, in sendChangePasswordVerification function this is not the case
    if (user.isActive) throw new ConflictException(this.i18n.t('validation.ACCOUNT_ALREADY_ACTIVE'));

    // remove all previous tokens that belongs to user
    await this.manager.delete(EmailVerification, { userId: user.id });

    // generate secret for the email activation
    const token = crypto.randomBytes(appConfig.auth.verificationTokenLength()).toString('base64url');
    const emailVerification = this.manager.create(EmailVerification, { id: token, userId: user.id });
    await this.manager.save(emailVerification);

    const url = `${appConfig.common.clientURL()}/auth/local/activate-account?token=${token}`;
    await this.mailerService.sendMail({
      from: 'Volodymyr Maselko <volodymyr.a.maselko@gmail.com>',
      to: user.email,
      subject: 'Activate your account - Diary App',
      text: `Please verify your email by clicking the link: ${url}`,
      html: getActivateAccountHTMLTemplateString(url),
    });

    return token;
  }

  // send email to change password
  async sendChangePasswordVerification(session: SessionInterface) {
    const userId = session.userId;
    // get user from database
    const user = await this.manager.findOne(User, { where: { id: userId } });
    if (!user) throw new NotFoundException(this.i18n.t('validation.USER_NOT_FOUND'));

    // remove all previous tokens that belongs to user
    await this.manager.delete(EmailVerification, { userId: user.id });

    // generate secret for the email activation
    const token = crypto.randomBytes(appConfig.auth.verificationTokenLength()).toString('base64url');
    const emailVerification = this.manager.create(EmailVerification, { id: token, userId: user.id });
    await this.manager.save(emailVerification);

    const url = `${appConfig.common.clientURL()}/auth/local/change-password?token=${token}`;
    await this.mailerService.sendMail({
      from: 'Volodymyr Maselko <volodymyr.a.maselko@gmail.com>',
      to: user.email,
      subject: 'Change your password - Diary App',
      text: `Please verify your email by clicking the link: ${url}`,
      html: getChangePasswordTemplateString(url),
    });

    return token;
  }

  // activate account with token
  async activateAccount(token: string, session: SessionInterface) {
    await this.verifyEmail(token, session, async (user: User) => {
      // if user alredy active, return success
      if (user.isActive) return;

      // set user active to true
      user.isActive = true;
      await this.manager.save(User, user);
    });
  }

  // change password with token
  async changePassword(token: string, session: SessionInterface, newPassword: string) {
    await this.verifyEmail(token, session, async (user: User) => {
      const newPasswordHashed = await bcrypt.hash(newPassword, appConfig.auth.passwordSalt());
      const sameAsPrev = await bcrypt.compare(newPasswordHashed, user.password);

      if (sameAsPrev) throw new ConflictException(this.i18n.t('validation.SAME_PASSWORD'));

      // set new password
      user.password = newPasswordHashed;

      // if user changes password, he receives email, so he is active now
      if (!user.isActive) {
        user.isActive = true;
      }

      await this.manager.save(User, user);
      if (!session.isSignedIn) {
        session.isSignedIn = true;
      }
    });
  }

  // verify email and execute callback after this
  async verifyEmail(token: string, session: SessionInterface, callback: (user: User) => any) {
    const expirationDate = getExpirationDateWithoutTimeZone(appConfig.auth.verificationTokenMaxAge());

    // check if token exists
    const foundToken = await this.manager.findOne(EmailVerification, {
      where: { id: token },
    });
    if (!foundToken) throw new NotFoundException(this.i18n.t('validation.LINK_INVALID'));

    try {
      // check if token expired
      if (foundToken.createdAt < expirationDate) throw new ForbiddenException(this.i18n.t('validation.TOKEN_EXPIRED'));

      // check if user exists
      const foundUser = await this.manager.findOne(User, { where: { id: foundToken.userId } });
      if (!foundUser) throw new NotFoundException(this.i18n.t('validation.USER_NOT_FOUND'));

      await callback(foundUser);

      // delete user token
      await this.manager.remove(EmailVerification, foundToken);

      // set user signed in to true
      session.isSignedIn = true;
    } finally {
      // clean up limited quantity of expired tokens
      await this.cleanupExpiredVerificationTokens(expirationDate);
    }
  }

  // clean up limited quantity of expired tokens
  async cleanupExpiredVerificationTokens(expirationDate: Date) {
    const expiredTokens = await this.manager.find(EmailVerification, {
      where: { createdAt: LessThan(expirationDate) },
      take: appConfig.auth.verificationCleanupLimit(),
    });
    if (expiredTokens.length > 0) {
      await this.manager.remove(EmailVerification, expiredTokens);
    }
  }

  async signIn({ email, password }: SignIn, session: SessionInterface): Promise<'NOT_ACTIVE' | 'ACTIVE'> {
    // check if user email exists
    const user = await this.manager.findOneBy(User, { email });
    if (!user || !user.password) {
      throw new UnauthorizedException(this.i18n.t('validation.AUTH_CREDENTIALS_MISMATCH'));
    }

    // compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(this.i18n.t('validation.AUTH_CREDENTIALS_MISMATCH'));
    }

    session.userId = user.id;
    if (!user.isActive) {
      return 'NOT_ACTIVE';
    }
    // set user logged in to true
    session.isSignedIn = true;
    return 'ACTIVE';
  }
}
