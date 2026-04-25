import mongoose, { Schema, Types } from 'mongoose';

export interface Advert {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  isSale: boolean;
  image?: string;
  tags?: string[];
}

const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    unique: true,
  },
  price: {
    type: String,
    select: false,
  },
  isSale: {
    type: Boolean,
  },
  image: {
    type: String,
  },
  tags: {
    type: [String],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
});

export const Advert = mongoose.model('Advert', userSchema, 'adverts');
