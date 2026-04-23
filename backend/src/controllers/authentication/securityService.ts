import bcrypt from 'bcrypt';
import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { string } from 'zod';

export const securityService = {
  hashPassword: (clearpassword: string) => {
    const hashedPassword = '';

    return hashedPassword;
  },

  generateJWT: (user: User) => {
    const secret = process.env.JWT_SECRET
    const token = jwt.sign({userId: {_id.Types.ObjectId}, secret ,{
        expiresIn: '1h',
    });
    return token;
  },
};
