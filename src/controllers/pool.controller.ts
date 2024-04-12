/* eslint-disable @typescript-eslint/no-unused-vars */
import logger from '../config/logger';
import { factory, alchemy } from '../utils/ethersSetup';
import { isNil } from 'lodash';
import * as poolService from '../services/pool.service';
import * as tokenService from '../services/token.service';
import dayjs from 'dayjs';
import { TPool } from '../models/@types/pool';
import { TokenMetadataResponse } from 'alchemy-sdk';
import { Request, Response } from 'express';

// --------------- Get All Pools
export const getAllPools = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const [err, pools] = await poolService.getAll();

    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Something went wrong',
        error: err,
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Pools fetched successfully',
      data: pools,
    });
  } catch (error) {
    logger.error('Error fetching pools:', error);
    return res.status(500).json({
      status: false,
      message: 'Something went wrong',
      error: error,
    });
  }
};

// --------------- Get live pool create event
export const getLivePoolCreateEvent = async (socket: any): Promise<void> => {
  logger.info('watching for PoolCreated event');
  await factory.on(
    'PoolCreated',
    (
      token0: string,
      token1: string,
      fee: number,
      tickSpacing: number,
      poolAddress: string,
      info: any,
    ) =>
      handlePoolCreate({
        token0,
        token1,
        fee,
        tickSpacing,
        poolAddress,
        info,
        socket,
      }),
  );
};

// --------------- Handle Pool Create
const handlePoolCreate = async ({
  token0,
  token1,
  fee,
  tickSpacing,
  poolAddress,
  info,
  socket,
}: {
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  poolAddress: string;
  info: any;
  socket: any;
}): Promise<any> => {
  const token0Metadata: TokenMetadataResponse =
    await alchemy.core.getTokenMetadata(token0);
  const token1Metadata: TokenMetadataResponse =
    await alchemy.core.getTokenMetadata(token1);

  if (token0Metadata && token1Metadata) {
    const tokenZeroId = await getTokenIdOrCreate(token0, token0Metadata);
    const tokenOneId = await getTokenIdOrCreate(token1, token1Metadata);

    if (tokenZeroId && tokenOneId) {
      const pool = await createPool(poolAddress, tokenZeroId, tokenOneId);
      if (pool?._id) {
        const [err, poolData] = await poolService.getById(pool?._id);

        if (err) return null;
        logger.info('Emitted poolCreated event');
        socket.emit('poolCreated', { pool: poolData });
      }
    }
    return null;
  }
  return null;
};

// --------------- Get Token Id or Create
const getTokenIdOrCreate = async (
  tokenAddress: string,
  metadata: TokenMetadataResponse,
): Promise<string | null> => {
  const [errToken, token] = await tokenService.getByAddress(tokenAddress);

  if (errToken) {
    logger.error('Error fetching token by address:', errToken);
    return null;
  }

  if (isNil(token)) {
    const [createError, newToken] = await tokenService.create({
      address: tokenAddress,
      tokenName: metadata?.name,
      logo: metadata?.logo,
      decimals: metadata?.decimals,
    });
    if (newToken) {
      logger.info('Token created successfully:', newToken);
      return newToken?._id;
    }
    if (createError) {
      logger.error('Error creating token:', createError);
      return null;
    }
  }
  return token?._id;
};

// --------------- Create Pool
const createPool = async (
  poolAddress: string,
  tokenZeroId: string,
  tokenOneId: string,
): Promise<TPool> => {
  const [errorCreatePool, newPool] = await poolService.create({
    address: poolAddress,
    token0: tokenZeroId,
    token1: tokenOneId,
    createdAt: dayjs().toISOString(),
  });
  if (newPool) {
    logger.info('Pool created successfully:', newPool);
    return newPool;
  }
  return errorCreatePool;
};

export default {
  getAllPools,
  getLivePoolCreateEvent,
};
