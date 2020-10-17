import { RequestHandler } from 'express';
import joi from '@hapi/joi';
import { logger } from '../../../../util/logger';
import { signJWT, validatePassword } from '../../helpers/auth';
import { User } from '../../model';

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const schema = joi.object().keys({
    email: joi
      .string()
      .email()
      .required(),
    password: joi
      .string()
      .min(6)
      .required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).json({
      success: false,
      message: validation.error.details[0].message,
    });
  }

  try {
    const params = { email, password };
    const validatePasswordResponse = await validatePassword(params);
    if (!validatePasswordResponse.success || !validatePasswordResponse.user) {
      return res.status(401).json({ success: false, message: validatePasswordResponse.message });
    }
    const { user } = validatePasswordResponse;
    const token = signJWT(user._id, user.email, user.role);
    return res.status(200).json({
      success: true,
      message: 'Log in successful',
      token,
      data: { user },
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLogged: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.userID);
    return res.status(200).json({
      success: true,
      message: 'User fetched successful',
      data: user,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
