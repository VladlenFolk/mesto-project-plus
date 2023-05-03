import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IRequestCustom } from '../services/interfaces';
import UnauthorizedError from '../errors/unauthorized-err';
import { MSG_ERROR_UNAUTHORIZED } from '../services/constants';

// eslint-disable-next-line consistent-return
export default (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(MSG_ERROR_UNAUTHORIZED);
  }
  const token = authorization.replace('Bearer ', '');
  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, 'super-strong-secret') as jwt.JwtPayload;
  } catch (err) {
    throw new UnauthorizedError(MSG_ERROR_UNAUTHORIZED);
  }

  req.user = { _id: payload._id };

  next();
};
