import { Joi, celebrate } from 'celebrate';

const loginSchema = Joi.object().keys({
  email: Joi.string().email(),
  password: Joi.string().required().min(8),
});
const signupSchema = Joi.object().keys({
  email: Joi.string().email(),
  password: Joi.string().required().min(8),
});

const userByIdSchema = Joi.object().keys({
  userId: Joi.string().alphanum().length(24),
});
const updateUserSchema = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  about: Joi.string().required().min(2).max(200),
});
const updateAvatarSchema = Joi.object().keys({
  avatar: Joi.string().required().uri(),
});

const createCardSchema = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  link: Joi.string().required().uri(),
});
const idCardSchema = Joi.object().keys({
  cardId: Joi.string().alphanum().length(24),
});

export const loginValidate = celebrate({ body: loginSchema });
export const signupValidate = celebrate({ body: signupSchema });

export const getUserByIdValidate = celebrate({ params: userByIdSchema });
export const updateUserValidate = celebrate({ body: updateUserSchema });
export const updateAvatarValidate = celebrate({ body: updateAvatarSchema });

export const createCardValidate = celebrate({ body: createCardSchema });
export const idCardValidate = celebrate({ params: idCardSchema });
