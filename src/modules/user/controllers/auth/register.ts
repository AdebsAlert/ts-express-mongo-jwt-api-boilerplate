import { RequestHandler } from 'express';
import joi from '@hapi/joi';
import { User } from '../../model';
import { logger } from '../../../../util/logger';
import { generateToken, storeTokenAndDataInRedis } from '../../helpers/auth';

export const register: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const schema = joi.object().keys({
    email: joi
      .string()
      .email()
      .required(),
    password: joi
      .string()
      .min(6)
      .required()
      .strict(),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).json({
      success: false,
      message: validation.error.details[0].message,
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await (await User.create({ email, password })).toObject();
    const token = generateToken();
    await storeTokenAndDataInRedis(token, ['token', token, 'userId', user._id.toString()]);
    delete user.password;

    return res.status(200).json({
      success: true,
      message: `User registered successfully`,
      data: { user },
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: error });
  }
};
