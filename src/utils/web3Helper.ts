import { ethers } from 'ethers';
import { provider } from './ethersSetup';
import logger from '../config/logger';

// ----------- Get Transaction Timestamp
export const getTransactionTimestamp = async (
  transactionHash: string,
): Promise<number | undefined> => {
  try {
    // Get transaction details
    const transaction = await provider.getTransaction(transactionHash);
    // Get block details
    const block = await provider.getBlock(transaction.blockNumber as any);
    return block.timestamp;
  } catch (error) {
    logger.error('Error fetching transaction timestamp:', error);
  }
};

// ----------- Format Amount
export function formatAmount(amount: number, decimals: number): string {
  const formattedAmount = ethers.utils.formatUnits(amount.toString(), decimals);
  return formattedAmount;
}

export default {
  formatAmount,
  getTransactionTimestamp,
};
