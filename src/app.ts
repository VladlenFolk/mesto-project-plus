import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/uesrs';
import cardsRouter from './routes/cards';
import { IRequestCustom } from './interfaces/request';

const { PORT = 3000, SERVER = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(SERVER);

app.use((req: Request, res: Response, next: NextFunction) => {
  const reqCustom = req as IRequestCustom;
  reqCustom.user = {
    _id: '644b776cb0912193e55be3fc',
  };
  next();
});

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

app.listen(PORT);
