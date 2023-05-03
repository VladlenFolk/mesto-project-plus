import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IRequestCustom } from '../services/interfaces';
import User from '../models/user';
import {
  MSG_ERROR_USER_NOT_FOUND,
} from '../services/constants';
import { handleOperationalErrors } from '../services/index';
import NotFoundError from '../errors/not-found-err';

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'strict',
        })
        .send({ token });
    })
    .catch(next);
};

export const getUsers = (_req: Request, res: Response, next: NextFunction) => User.find({})
  .then((user) => res.send(user))
  .catch(next);

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MSG_ERROR_USER_NOT_FOUND);
      }
      return res.send(user);
    })
    .catch((err) => {
      handleOperationalErrors(err, next);
    });
};

export const getCurrentUser = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction,
) => {
  const _id = req.user?._id;
  return User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MSG_ERROR_USER_NOT_FOUND);
      }
      return res.send(user);
    })
    .catch((err) => {
      handleOperationalErrors(err, next);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      handleOperationalErrors(err, next);
    });
};

export const updateUser = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  const _id = req.user?._id;
  return User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MSG_ERROR_USER_NOT_FOUND);
      }
      return res.send(user);
    })
    .catch((err) => {
      handleOperationalErrors(err, next);
    });
};

export const updateAvatar = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  const _id = req.user?._id;
  return User.findByIdAndUpdate(
    _id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MSG_ERROR_USER_NOT_FOUND);
      }
      return res.send(user);
    })
    .catch(next);
};
