const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequest');
// const NotFoundError = require('../errors/NotFound');
const ForbiddenError = require('../errors/Forbidden');

const returnMovies = (req, res, next) => { // возвращает все сохранённые пользователем фильмы
  const owner = req.user._id; // ID пользователя, отправляющий запрос
  Movie.find({ owner })
    .populate('user')
    .orFail()
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
    .then((newMovie) => res.send(newMovie))
    .catch(() => {
      throw new BadRequestError('Не получилось добавить фильм, введены некорректные данные.');
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => { // удаляет сохранённый фильм по _id
  const requestedMovieId = req.params.id; // ID фильма, который нужно удалить
  const userId = req.user._id; // ID пользователя, отправляющий запрос
  Movie.findById(requestedMovieId)
    .then((requestedMovie) => {
      // Если пользователь, отправляющий запрос владелец фильма,
      // то фильм можно удалить:
      if (requestedMovie.owner.toString() === userId) {
        requestedMovie.remove() // Удаляем фильм
          .then(() => res.send({ message: `Фильм «${requestedMovie.nameRU}» успешно удалён из коллекции сохранённых.` }))
          .catch(next);
      } else {
        throw new ForbiddenError('Вы не можете удалять чужие фильмы.');
      }
    })
    .catch((err) => next(err));
};

module.exports = {
  returnMovies,
  createMovie,
  deleteMovie,
};
