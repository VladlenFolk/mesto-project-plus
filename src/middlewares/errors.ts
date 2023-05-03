import { Request, Response } from 'express';
import {
  STATUS_SERVER_ERROR,
} from '../services/constants';
import { IError } from '../services/interfaces';

const errorMiddleware = (err: IError, req: Request, res: Response) => {
  const { statusCode = STATUS_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === STATUS_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
};

export default errorMiddleware;
