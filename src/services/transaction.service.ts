import Transaction from '../models/transaction.model';
import logger from '../config/logger';
import { ServiceResponse } from './@types/common';

// --------------- Get All Transactions
const getAll = async (): Promise<ServiceResponse<any[]>> => {
  try {
    const transactions = await Transaction.find().populate('pool').exec();
    logger.info('Fetch all transactions');
    return [null, transactions];
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    return [error, null];
  }
};

// --------------- Get Transactions by Pool Id
const getByPoolId = async (poolId: string): Promise<ServiceResponse<any>> => {
  try {
    const transactions = await Transaction.findOne({ pool: poolId })
      .populate('pool')
      .exec();
    logger.info('Fetch all transactions by pool id:', poolId);
    return [null, transactions];
  } catch (error) {
    logger.error('Error fetching transactions by pool id:', error);
    return [error, null];
  }
};

//  --------------- Create Transaction
const create = async (payload: any): Promise<any> => {
  try {
    const newTransaction = new Transaction({
      ...payload,
    });
    await newTransaction.save();
    logger.info('Transaction created successfully:', newTransaction);
    return [null, newTransaction];
  } catch (error) {
    logger.error('Error creating pool:', error);
    return [error, null];
  }
};

// --------------- Get Transaction by Id
const getById = async (id: string): Promise<ServiceResponse<any>> => {
  try {
    const transaction = await Transaction.findOne({ _id: id })
      .populate('pool')
      .exec();
    logger.info('Fetch transaction by id:', id);
    return [null, transaction];
  } catch (error) {
    logger.error('Error fetching transaction by id:', error);

    return [error, null];
  }
};

export { create, getById, getAll, getByPoolId };
