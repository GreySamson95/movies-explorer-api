const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { returnMovies, createMovie, deleteMovie } = require('../controllers/movies');

const regex = /^(https?:\/\/)?(w{3,}.)?([a-z0-9-]+\.)+([a-z]{2,})\/?([a-z0-9-._~:/?#[\]@!$&'()*+,;=]){0,}/i; // Регулярное выражение для проверки URL

movieRouter.get('/', returnMovies); // возвращает все сохранённые пользователем фильмы

movieRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi // страна создания фильма. Обязательное поле-строка.
      .string()
      .required(),
    director: Joi // режиссёр фильма. Обязательное поле-строка.
      .string()
      .required(),
    duration: Joi // длительность фильма. Обязательное поле-число.
      .number()
      .required(),
    year: Joi // год выпуска фильма. Обязательное поле-строка.
      .string()
      .required(),
    description: Joi // описание фильма. Обязательное поле-строка.
      .string()
      .required(),
    image: Joi // ссылка на постер к фильму. Обязательное поле-строка. [URL]
      .string()
      .pattern(regex)
      .required(),
    trailer: Joi // ссылка на трейлер фильма. Обязательное поле-строка. [URL]
      .string()
      .pattern(regex)
      .required(),
    thumbnail: Joi // миниатюрное изображение постера к фильму. Обязательное поле-строка. [URL]
      .string()
      .pattern(regex)
      .required(),
    movieId: Joi
      .number()
      .required(),
    nameRU: Joi // название фильма на русском языке. Обязательное поле-строка.
      .string()
      .required(),
    nameEN: Joi // название фильма на английском языке. Обязательное поле-строка.
      .string()
      .required(),
  }).unknown(true),
}), createMovie);

movieRouter.delete('/:id', celebrate({ // удаляет сохранённый фильм по _id
  params: Joi.object().keys({
    id: Joi
      .string()
      .alphanum()
      .hex()
      .length(24),
  }),
}), deleteMovie);

module.exports = movieRouter;
