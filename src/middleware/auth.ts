import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import { APP_SECRET } from '../util/config';
import { logger } from '../util/logger';
import { ROLES } from '../util/constants';
import { User } from '../modules/user/model';

export async function handleauthenticated(req: Request, res: Response, next: NextFunction, roles: Array<string>) {
  const { authorization } = req.headers;

  const schema = Joi.object()
    .keys({
      authorization: Joi.string()
        .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
        .required()
        .error(new Error('Invalid bearer token.')),
    })
    .unknown(true);

  const validation = schema.validate(req.headers);
  if (validation.error) {
    return res.status(400).json({
      success: false,
      message: validation.error.message,
    });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [, token] = authorization!.split('Bearer ');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decoded: any;
    try {
      decoded = jwt.verify(token, APP_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token',
      });
    }

    // see if user is authorized to do the action
    if (!roles.includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token',
      });
    }
    req.userID = user._id;
    req.userEmail = user.email;
    req.role = decoded.role;

    return next();
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: error });
  }
}

export const authenticated = (roles = ROLES) => (req: Request, res: Response, next: NextFunction) =>
  handleauthenticated(req, res, next, roles);
