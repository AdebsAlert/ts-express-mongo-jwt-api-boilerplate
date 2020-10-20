import express from 'express';
import { getUsers } from '../controllers';
import { Auth } from '../controllers/auth';
import { authenticated } from '../../../middleware/auth';

const userRouter = express.Router();

userRouter.post('/auth/login', Auth.login);
userRouter.post('/auth/register', Auth.register);
userRouter.post('/auth/confirm-email', Auth.confirmEmail);
userRouter.post('/auth/forgot-password', Auth.forgotPassword);
userRouter.get('/auth/me', authenticated(['user']), Auth.getLogged);
userRouter.get('/', authenticated(['user']), getUsers);

export { userRouter };
