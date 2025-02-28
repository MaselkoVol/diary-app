import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignUp } from './interfaces/sign-up.interface';
import { SignIn } from './interfaces/sign-in.interface';
import { SessionInterface } from 'src/common/interfaces/session.interface';
import { appConfig } from 'src/config/configuration';
import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class LocalAuthService {
  constructor(private dataSource: DataSource) {}
  private manager = this.dataSource.manager;

  async signUp({ name, email, password }: SignUp) {
    // check if user already exists
    const userExists = await this.manager.findOneBy(User, { email });
    if (userExists) {
      throw new ConflictException(`An account with this email already exists.`);
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
