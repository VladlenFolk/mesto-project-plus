import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import usersRouter from './routes/uesrs';
import cardsRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorMiddleware from './middlewares/errors';
import { loginValidate, signupValidate } from './services/validation';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { PORT = 3000, SERVER = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(SERVER);

app.use(requestLogger);

app.post('/signin', loginValidate, login);
app.post('/signup', signupValidate, createUser);

app.use(auth);

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorMiddleware);

app.listen(PORT);
