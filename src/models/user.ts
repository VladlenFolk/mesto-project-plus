import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import {
  defaultUserAbout, defaultUserAvatar, defaultUserName, MSG_ERROR_USER_PASS_WRONG,
} from '../services/constants';
import { IUser, UserModel } from '../services/interfaces';
import { emailValidator } from '../services/index';
import UnauthorizedError from '../errors/unauthorized-err';

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    default: defaultUserName,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: defaultUserAbout,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: defaultUserAvatar,
    validate: {
      validator(v: string) {
        return /^(http|https):\/\/(?:www\.|(?!www))[^ "]+\.([a-z]{2,})/.test(v);
      },
      message: 'URL не соответствует формату',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: emailValidator,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(MSG_ERROR_USER_PASS_WRONG));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(MSG_ERROR_USER_PASS_WRONG));
          }
          return user;
        });
    });
});

export default model<IUser, UserModel>('user', userSchema);
