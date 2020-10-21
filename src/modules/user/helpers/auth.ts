import jwt from 'jsonwebtoken';
import { USER_TOKEN_EXPIRATION_IN_SECONDS } from '../../../util/constants';
import { APP_SECRET } from '../../../util/config';
import { IUser, User } from '../model';
import { asyncClient, getRedisKey, saveMultipleItemsInRedis } from '../../../util/redis';

interface IValidatePasswordResponse {
  success: boolean;
  message?: string;
  user?: IUser;
}

export function generateEmailConfirmationToken(userID: string): string {
  return jwt.sign(
    {
      _id: userID,
    },
    APP_SECRET,
    {
      expiresIn: USER_TOKEN_EXPIRATION_IN_SECONDS,
    },
  );
}

export function decodeEmailConfirmationToken(token: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let decoded: any;
  // eslint-disable-next-line prefer-const
  decoded = jwt.verify(token, APP_SECRET);
  return decoded;
}

export function signJWT(userID: string, userEmail: string, role: string | undefined) {
  return jwt.sign(
    {
      _id: userID,
      email: userEmail,
      role,
    },
    APP_SECRET,
    {
      expiresIn: USER_TOKEN_EXPIRATION_IN_SECONDS,
    },
  );
}

export async function storeTokenAndDataInRedis(token: string, records: Array<string>): Promise<number> {
  const key = getRedisKey(token);
  return await saveMultipleItemsInRedis(key, records);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function findTokenAndDataInRedis(token: string): Promise<any> {
  const key = getRedisKey(token);
  return await asyncClient.hmgetall(key);
}

type validatePasswordInput = {
  email: string;
  password: string;
};

export const getUser = async ({ email }: { email: string }): Promise<IUser | null> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await User.findOne({ email }).select('+password');
  return user;
};

export const validatePassword = async ({
  email,
  password,
}: validatePasswordInput): Promise<IValidatePasswordResponse> => {
  try {
    const user = await getUser({ email });
    if (!user) {
      return {
        success: false,
        message: 'Invalid login credential',
      };
    }
    if (!user.password) {
      return { success: false, message: 'You have not set a password' };
    }
    if (!user.emailVerified) {
      return { success: false, message: 'Please confirm your email address' };
    }
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return {
        success: false,
        message: 'Invalid login credential',
      };
    }
    const userObj = user.toObject();
    delete userObj.password;
    return {
      success: true,
      user: userObj,
    };
  } catch (error) {
    return error;
  }
};
