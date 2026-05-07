import express from 'express';
import { signupController } from '../controllers/authentication/signupController';
import { loginController } from '../controllers/authentication/loginController';
import { logoutController } from '../controllers/authentication/logoutController';
import { updateUserController } from '../controllers/authentication/updateUserController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const authenticationRouter = express.Router();

//Authentication
authenticationRouter.post('/register', signupController);
authenticationRouter.post('/login', loginController);
authenticationRouter.post('/logout', authMiddleware, logoutController);
authenticationRouter.patch('/me', authMiddleware, updateUserController);
