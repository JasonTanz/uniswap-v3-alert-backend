import logger from '../config/logger';
import { size } from 'lodash';
import { ethers } from 'ethers';
import { poolArtifact, provider } from '../utils/ethersSetup';
import { formatAmount, getTransactionTimestamp } from '../utils/web3Helper';
import { TPool } from '../models/@types/pool';
import { Request, Response } from 'express';
import * as poolService from '../services/pool.service';
import * as transactionService from '../services/transaction.service';

// --------------- Get All Transactions
export const getAllTransactions = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const [err, transactions] = await transactionService.getAll();
    if (err) {
      logger.error('Error fetching transactions:', err);
      return res.status(500).json({ error: 'Error fetching transactions' });
    }
    return res.status(200).json({
      status: true,
      message: 'transactions fetched successfully',
      data: transactions,
    });
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    return res.status(500).json({
      status: false,
      message: 'Something went wrong',
      error: error,
    });
  }
};

// --------------- Get live transaction event
export const getLiveTransactionsEvent = async (socket: any): Promise<any> => {
  try {
    const [err, pools] = await poolService.getAll();

    if (err) {
      logger.error('Error fetching pools:', err);
      return null;
    }

    if (!pools || size(pools) === 0) {
      logger.info('No pools found');
      return;
    }

    console.log('pools', pools);
    logger.info('Watching live swap event pool');
    for (const pool of pools) {
      await watchPoolSwaps(pool, socket);
    }
  } catch (error) {
    logger.error('Error fetching pools:', error);
  }
};

// --------------- Watch Pool Swaps
const watchPoolSwaps = async (pool: TPool, socket: any): Promise<void> => {
  try {
    const { token0, token1, address, _id } = pool;
    const poolContract = new ethers.Contract(
      address,
      poolArtifact.abi,
      provider,
    );

    await poolContract.on(
      'Swap',
      async (
        sender,
        recipient,
        amount0,
        amount1,
        args,
        args1,
        args2,
        { transactionHash },
      ) => {
        await handleSwapEvent({
          sender,
          recipient,
          amount0,
          amount1,
          transactionHash,
          poolId: _id,
          token0,
          token1,
          socket,
        });
      },
    );
  } catch (error) {
    logger.error('Error watching pool swaps:', error);
  }
};

// --------------- Handle Swap Event
const handleSwapEvent = async ({
  sender,
  recipient,
  amount0,
  amount1,
  transactionHash,
  poolId,
  token0,
  token1,
  socket,
}: any): Promise<any> => {
  console.log('Swap Event:');
  console.log('Sender:', sender);
  console.log('Recipient:', recipient);
  console.log('Amount0In:', formatAmount(amount0, 18));
  console.log('Amount1In:', formatAmount(amount1, 18));
  console.log('Transaction:', transactionHash);
  try {
    const formattedAmount0 = formatAmount(amount0, token0.decimals || 18);
    const formattedAmount1 = formatAmount(amount1, token1.decimals || 18);

    const timestamp = await getTransactionTimestamp(transactionHash);

    if (!timestamp) return null;

    const newTransactionData = {
      transactionHash,
      pool: poolId,
      sender,
      recipient,
      amount0: formattedAmount0,
      amount1: formattedAmount1,
      timestamp: new Date(timestamp * 1000).toISOString(),
    };

    const [errorTransaction, newTransaction] =
      await transactionService.create(newTransactionData);

    if (errorTransaction) return null;

    const [err, addedTransaction] = await poolService.addTransaction(
      poolId,
      newTransaction._id,
    );

    if (addedTransaction) {
      logger.info('Transaction added to pool:', newTransaction);

      const [err, transactionData] = await transactionService.getById(
        newTransaction?._id,
      );
      if (err) return null;
      logger.info('Emitting new swap event');
      socket.emit('newSwapEvent', { transaction: transactionData });
    }

    if (err) {
      logger.error('Error adding transaction to pool:', err);
      return null;
    }
  } catch (error) {
    logger.error('Error creating transaction:', error);
    return null;
  }
};

export default {
  getLiveTransactionsEvent,
};
