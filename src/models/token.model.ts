import mongoose from 'mongoose';
import { TToken } from './@types/token';

const { Schema, model } = mongoose;

export const tokenSchema = new Schema<TToken>({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  tokenName: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  decimals: {
    type: Number,
  },
});

export const Token = model<TToken>('Token', tokenSchema);
export default Token;
