const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const ForbiddenError = require('../errors/Forbidden');

const returnMovies = (req, res, next) => { // возвращает все сохранённые пользователем фильмы
  const owner = req.user._id; // ID пользователя, отправляющий запрос
  Movie.find({ owner })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => { // создаёт фильм с переданными в теле данными
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body; // переданные данные
  const owner = req.user._id; // ID пользователя, отправляющий запрос
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then(() => res.send({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Не получилось добавить фильм, введены некорректные данные.');
      }
      next(err);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => { // удаляет сохранённый фильм по _id
  const requestedMovieId = req.params.id; // ID фильма, который нужно удалить
  const userId = req.user._id; // ID пользователя, отправляющий запрос
  Movie.findByIdAndRemove(requestedMovieId)
    .select('+owner')
    .then((requestedMovie) => {
      if (!requestedMovie) {
        throw new NotFoundError('Не получилось найти фильм по id');
      }
      // Если пользователь, отправляющий запрос владелец фильма,
      // то фильм можно удалить:
      if (requestedMovie.owner.toString() !== userId) {
        throw new ForbiddenError('Вы не можете удалять чужие фильмы.');
      }
      res.status(200).send({
        message: `Фильм «${requestedMovie.nameRU}»
      успешно удалён из коллекции сохранённых.`,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Не получилось удалить фильм, введены некорректные данные.');
      }
      next(err);
    })
    .catch(next);
};

module.exports = {
  returnMovies,
  createMovie,
  deleteMovie,
};
