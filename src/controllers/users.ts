import { Request, Response } from 'express';
import { IRequestCustom } from '../interfaces/request';
import User from '../models/user';
import {
  STATUS_NOT_FOUND,
  STATUS_BAD_REQUEST,
  STATUS_SERVER_ERROR,
  MSG_ERROR_GENERIC,
  MSG_ERROR_INVALID_USER_DATA,
  MSG_ERROR_USER_NOT_FOUND,
  MSG_ERROR_INVALID_AVATAR_DATA,
  VALIDATION_ERROR,
  MSG_ERROR_INVALID_CREATE_USER_DATA,
} from '../constants/index';

export const getUsers = (_req: Request, res: Response) => User.find({})
  .then((user) => res.send(user))
  .catch(() => res.status(STATUS_SERVER_ERROR).send({ message: MSG_ERROR_GENERIC }));

export const getUser = (req: Request, res: Response) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      return res
        .status(STATUS_NOT_FOUND)
        .send({ message: MSG_ERROR_USER_NOT_FOUND });
    }
    return res.send(user);
  })
  .catch(() => res.status(STATUS_SERVER_ERROR).send({ message: MSG_ERROR_GENERIC }));

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return res.status(STATUS_BAD_REQUEST).send({
          message: MSG_ERROR_INVALID_CREATE_USER_DATA,
        });
      }
      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: MSG_ERROR_GENERIC });
    });
};

export const updateUser = (req: IRequestCustom, res: Response) => {
  const { name, about } = req.body;
  const _id = req.user?._id;
  return User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(STATUS_NOT_FOUND)
          .send({ message: MSG_ERROR_USER_NOT_FOUND });
      } if (!name || !about) {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: MSG_ERROR_INVALID_USER_DATA });
      }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === VALIDATION_ERROR) {
        return res.status(STATUS_BAD_REQUEST).send({
          message: MSG_ERROR_INVALID_USER_DATA,
        });
      }
      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: MSG_ERROR_GENERIC });
    });
};

export const updateAvatar = (req: IRequestCustom, res: Response) => {
  const { avatar } = req.body;
  const _id = req.user?._id;
  return User.findByIdAndUpdate(
    _id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(STATUS_NOT_FOUND)
          .send({ message: MSG_ERROR_USER_NOT_FOUND });
      } if (!avatar) {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: MSG_ERROR_INVALID_AVATAR_DATA });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return res.status(STATUS_BAD_REQUEST).send({
          message: MSG_ERROR_INVALID_AVATAR_DATA,
        });
      }
      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: MSG_ERROR_GENERIC });
    });
};
