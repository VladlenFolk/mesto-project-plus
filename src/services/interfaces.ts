import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Document, Model } from 'mongoose';

export interface IRequestCustom extends Request {
  user?: {
    _id?: string | JwtPayload;
  };
}

export interface IUser extends Document {
  name?: string;
  about?: string;
  avatar?: string;
  email: string;
  password: string;
}
export interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) =>
  Promise<Document<unknown, any, IUser>>
}

export interface IError {
  statusCode?: number;
  message: string;
  code?: number;
  name?: string;
}
