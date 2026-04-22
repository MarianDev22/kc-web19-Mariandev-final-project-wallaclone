import { Request, Response, NextFunction } from 'express';
import { authBodyValidator } from './authBodyValidator';
import { User } from '../../models/User';
import bcrypt from 'bcrypt';

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = authBodyValidator.parse(req.body);
    //rever uso de Promise.all para simplificar código
    const user = await User.findOne({
      email: email,
    });
    if (user) {
      throw new Error('a user with this email already exists');
    }

    const user1 = await User.findOne({
      username: username,
    });
    if (user1) {
      throw new Error(`The username ${username} is taken`);
    }

    //hashear contraseña y guardar usuario
    const hashedPassword = await bcrypt.hash(password, 7);
    const newUser = new User({ username, email, password: hashedPassword });

    const createdUser = await newUser.save();

    // esta es la respuesta que tenemos que acordar con Sara de como la vamos a estructurar?
    res.status(201).json({
      content: 'Usuario registrado correctamente',
    });
  } catch (error) {
    next(error);
  }
};
