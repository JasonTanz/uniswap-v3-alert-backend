import Pool from '../models/pool.model';
import logger from '../config/logger';
import { TPoolCreatePayload } from './@types/pool';
import { ServiceResponse } from './@types/common';
import { TPool } from '../models/@types/pool';

// --------------- Create Pool
const create = async (
  payload: TPoolCreatePayload,
): Promise<ServiceResponse<TPool>> => {
  try {
    const newPool = new Pool({
      ...payload,
    });
    await newPool.save();
    logger.info('Pool created successfully:', newPool);
    return [null, newPool];
  } catch (error) {
    logger.error('Error creating pool:', error);
    return [error, null];
  }
};

// --------------- Get All Pools
const getAll = async (): Promise<ServiceResponse<TPool[]>> => {
  try {
    const pools = await Pool.find()
      .populate('token0')
      .populate('token1')
      .populate('transactions')
      .sort({ createdAt: -1 })
      .exec();
    logger.info('Fetch all pools');
    return [null, pools];
  } catch (error) {
    logger.error('Error fetching pools:', error);
    return [error, null];
  }
};

// --------------- Get Pool by Id
const getById = async (id: string): Promise<ServiceResponse<any>> => {
  try {
    const pool = await Pool.findOne({ _id: id })
      .populate('token0')
      .populate('token1')
      .populate('transactions')
      .exec();
    logger.info('Fetch pool by id:', id);
    return [null, pool];
  } catch (error) {
    logger.error('Error fetching pool by id:', error);

    return [error, null];
  }
};

// --------------- Add Transaction to Pool
const addTransaction = async (
  poolId: string,
  transactionId: string,
): Promise<ServiceResponse<TPool>> => {
  try {
    const [error, pool] = await getById(poolId);
    if (pool) {
      pool.transactions.push(transactionId);
      await pool.save();
      logger.info('Transaction added to pool:', transactionId);
      return [null, pool];
    }
    logger.error('Error adding transaction to pool:', error);
    return [error, null];
  } catch (error) {
    logger.error('Error adding transaction to pool:', error);
    return [error, null];
  }
};

export { create, addTransaction, getById, getAll };
