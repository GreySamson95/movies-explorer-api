const authRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');

authRouter.post('/signin', celebrate({ // Авторизация пользователя
  body: Joi.object().keys({
    email: Joi
      .string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi
      .string()
      .required(),
  }).unknown(true),
}), login);
authRouter.post('/signup', celebrate({ // Регистрация пользователя
  body: Joi.object().keys({
    name: Joi
      .string()
      .required()
      .min(2).max(30),
    email: Joi
      .string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi
      .string()
      .required(),
  }).unknown(true),
}), createUser);

module.exports = authRouter;
