import { RequestHandler } from 'express';
import joi from '@hapi/joi';
import { User } from '../../model';
import { logger } from '../../../../util/logger';
import { generateEmailConfirmationToken, decodeEmailConfirmationToken } from '../../helpers/auth';
import { sendMail } from '../../../../util/email';
import Mustache from 'mustache';
import fs from 'fs';
const ConfirmEmailTemp = fs.readFileSync('./src/html/user.confirm.email.html');

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
    const token = generateEmailConfirmationToken(user._id);

    // send the onboarding email to the user after successful signup
    // send emails
    const actionURL = process.env.ADMIN_WEB_BASE_URL;
    const view = {
      actionURL,
      token,
    };

    const output = Mustache.render(`${ConfirmEmailTemp}`, view);
    sendMail(email, `Confirm your email address`, `${output}`);

    delete user.password;

    return res.status(200).json({
      success: true,
      message: `User registered successfully. Confirm email address`,
      data: { user },
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: error });
  }
};

export const confirmEmail: RequestHandler = async (req, res) => {
  const { token } = req.body;
  const schema = joi.object().keys({
    token: joi.string().required(),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).json({
      success: false,
      message: validation.error.details[0].message,
    });
  }

  try {
    const decodedUser = decodeEmailConfirmationToken(token);

    if (decodedUser) {
      const user = await User.findById(decodedUser._id);

      if (!user) {
        return res.status(400).json({
          success: false,
          message: `Email could not be confirmed`,
        });
      } else {
        if (user.emailVerified) {
          return res.status(400).json({
            success: false,
            message: `Email has already been confirmed. Please login`,
          });
        }

        // verify the email
        user.emailVerified = true;
        user.save();

        return res.status(200).json({
          success: true,
          message: `Email confirmed successfully!. Please login`,
          data: { user },
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: `Email could not be confirmed`,
      });
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: error });
  }
};
