import express from 'express'
import { signupController } from '../controllers/authentication/signupController';
import { loginController } from '../controllers/authentication/loginController';

export const authenticationRouter = express.Router();

//Authentication
authenticationRouter.post('/register', signupController);
authenticationRouter.post('/login', loginController);