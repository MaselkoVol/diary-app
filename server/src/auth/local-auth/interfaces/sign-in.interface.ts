import { SignUp } from './sign-up.interface';

export type SignIn = Pick<SignUp, 'email' | 'password'>;
