import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { Alchemy, Network } from 'alchemy-sdk';
const factoryArtifact = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json');
const poolArtifact = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json');

dotenv.config();
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ETHERS_PROVIDER_URL,
);

const config = {
  apiKey: process.env.ALCHEMY_API_KEY || '',
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(config);

const factoryAddress = process.env.FACTORY_ADDRESS || '';

const factory = new ethers.Contract(
  factoryAddress,
  factoryArtifact.abi,
  provider,
);

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(
      `Connected to Ethereum network. Current block number: ${blockNumber}`,
    );
  })
  .catch((error) => {
    console.error('Error connecting to Ethereum network:', error);
  });

export {
  factoryArtifact,
  poolArtifact,
  factoryAddress,
  provider,
  factory,
  alchemy,
};

export default provider;
