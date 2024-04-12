import logger from '../config/logger';
import Token from '../models/token.model';

//--------------- Create Token
const create = async (payload: any): Promise<any> => {
  try {
    const newToken = new Token({
      ...payload,
    });
    await newToken.save();
    logger.info('Token created successfully:', newToken);
    return [null, newToken];
  } catch (error) {
    logger.error('Error creating token:', error);
    return [error, null];
  }
};

//--------------- Get Token by address
const getByAddress = async (address: string): Promise<any> => {
  try {
    const token = await Token.findOne({ address }).exec();
    logger.info('Fetch token by address:', address);
    return [null, token];
  } catch (error) {
    logger.error('Error fetching token by address:', error);

    return [error, null];
  }
};

export { create, getByAddress };
