import mongoose, { Schema, Types } from 'mongoose';

export interface User {
  _id: Types.ObjectId;
  email: string;
  username: string;
  password?: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    select: false,
  },
});

export const User = mongoose.model('User', userSchema, 'users');
