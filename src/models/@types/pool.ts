import { TToken } from './token';
import { TTransaction } from './transaction';

export type TPool = {
  address: string;
  token0: TToken;
  token1: TToken;
  transactions: TTransaction[];
  _id?: string;
  createdAt?: string;
};
