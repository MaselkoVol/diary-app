import { PickType } from '@nestjs/mapped-types';
import { SignUpDto } from './sign-up.dto';

export class PasswordDto extends PickType(SignUpDto, ['password'] as const) {}
