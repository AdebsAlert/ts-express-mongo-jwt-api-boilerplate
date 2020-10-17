import { RequestHandler } from 'express';
import { logger } from '../../../../util/logger';

export const forgotPassword: RequestHandler = async (_req, res) => {
  try {
    return;
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: error });
  }
};
