import { Request, Response } from 'express';
import { IRequestCustom } from '../interfaces/request';
import Card from '../models/cards';
import {
  STATUS_NOT_FOUND,
  STATUS_BAD_REQUEST,
  STATUS_SERVER_ERROR,
  MSG_ERROR_GENERIC,
  MSG_ERROR_INVALID_DATA,
  MSG_ERROR_INVALID_CARD_ID,
  MSG_CARD_NOT_FOUND,
  MSG_CARD_DELETED,
  VALIDATION_ERROR,
  OBJECT_ID,
} from '../constants/index';

export const getCards = (_req: Request, res: Response) => Card.find({})
  .then((card) => res.send(card))
  .catch(() => res.status(STATUS_SERVER_ERROR).send({ message: MSG_ERROR_GENERIC }));

export const createCard = (req: IRequestCustom, res: Response) => {
  const { name, link } = req.body;
  const _id = req.user?._id;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return res.status(STATUS_BAD_REQUEST).send({
          message: MSG_ERROR_INVALID_DATA,
        });
      }
      return res.status(STATUS_SERVER_ERROR).send({ message: MSG_ERROR_GENERIC });
    });
};

export const deleteCard = (req: IRequestCustom, res: Response) => {
  const id = req.params.cardId;
  return Card.findByIdAndDelete(id)
    .then((card) => {
      if (!card) {
        return res
          .status(STATUS_NOT_FOUND)
          .send({ message: MSG_CARD_NOT_FOUND });
      }
      return res.send({ message: MSG_CARD_DELETED });
    })
    .catch(() => res.status(STATUS_SERVER_ERROR).send({ message: MSG_ERROR_GENERIC }));
};

export const addLikeCard = (req: IRequestCustom, res: Response) => {
  const _id = req.user?._id;
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(STATUS_BAD_REQUEST).send({ message: MSG_CARD_NOT_FOUND });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.kind === OBJECT_ID) {
        return res.status(STATUS_BAD_REQUEST).send({ message: MSG_ERROR_INVALID_CARD_ID });
      }
      return res.status(STATUS_SERVER_ERROR).send({ message: MSG_ERROR_GENERIC });
    });
};

export const deleteLikeCard = (req: IRequestCustom, res: Response) => {
  const _id = req.user?._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(STATUS_NOT_FOUND).send({ message: MSG_CARD_NOT_FOUND });
      }
      return res.send(updatedCard);
    })
    .catch((err) => {
      if (err.kind === OBJECT_ID) {
        return res.status(STATUS_BAD_REQUEST).send({ message: MSG_ERROR_INVALID_CARD_ID });
      }
      return res.status(STATUS_SERVER_ERROR).send({ message: MSG_ERROR_GENERIC });
    });
};
