import express from 'express'
import { signupController } from '../controllers/authentication/signupController';

export const router = express.Router();

//Authentication
router.post('/signup', signupController);