import mongoose from 'mongoose';
import { TTransaction } from './@types/transaction';

const { Schema, model } = mongoose;

const transactionSchema = new Schema({
  transactionHash: {
    type: String,
    required: true,
    unique: true,
  },
  pool: {
    type: Schema.Types.ObjectId,
    ref: 'Pool',
  },
  sender: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  amount0: {
    type: Number,
    required: true,
  },
  amount1: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: String,
  },
});

export const Transaction = model<TTransaction>(
  'Transaction',
  transactionSchema,
);
export default Transaction;
