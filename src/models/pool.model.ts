import mongoose from 'mongoose';
import { TPool } from './@types/pool';

const { Schema, model } = mongoose;

export const poolSchema = new Schema<TPool>({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  token0: {
    type: Schema.Types.ObjectId,
    ref: 'Token',
    required: true,
  },
  token1: {
    type: Schema.Types.ObjectId,
    ref: 'Token',
    required: true,
  },
  createdAt: {
    type: String,
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ],
});

export const Pool = model<TPool>('Pool', poolSchema);
export default Pool;
