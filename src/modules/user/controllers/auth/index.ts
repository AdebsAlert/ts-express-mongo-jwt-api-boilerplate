import { login, getLogged } from './login';
import { register, confirmEmail } from './register';
import { forgotPassword } from './password';

export const Auth = {
  login,
  register,
  forgotPassword,
  getLogged,
  confirmEmail,
};
