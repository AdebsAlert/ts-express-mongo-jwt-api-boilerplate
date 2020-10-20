/**
 * User Schema API
 */

import mongoose, { HookNextFunction } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUserSchema extends mongoose.Document {
  email: string;
  password: string;
  firstname?: string | null;
  lasname?: string | null;
  role?: string;
  emailVerified?: boolean;
}

export const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    firstname: {
      type: String,
      default: null,
    },
    lastname: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

type comparePasswordFunction = (password: string) => Promise<boolean>;

const comparePassword: comparePasswordFunction = async function(this: IUser, password) {
  try {
    const validPassword = await bcrypt.compare(password, this.password);
    return validPassword;
  } catch (error) {
    console.error(error);
    return error;
  }
};
userSchema.methods.comparePassword = comparePassword;

export interface IUser extends IUserSchema {
  comparePassword: comparePasswordFunction;
}

userSchema.pre<IUser>('save', async function save(next: HookNextFunction) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export const User = mongoose.model<IUser>('User', userSchema);
