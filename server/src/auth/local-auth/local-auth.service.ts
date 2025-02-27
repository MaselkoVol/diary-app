import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUp } from './interfaces/sign-up.interface';
import { SignIn } from './interfaces/sign-in.interface';
import { SessionInterface } from 'src/common/interfaces/session.interface';

@Injectable()
export class LocalAuthService {
  constructor(private prisma: PrismaService) {}

  async signUp({ name, email, password }: SignUp) {
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new ConflictException(`An account with this email already exists.`);
    }

    const salt = Number(process.env.PASSWORD_SALT_COUNT) || 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
  }

  async signIn({ email, password }: SignIn, session: SessionInterface) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    session.userId = user.id;
  }
}
