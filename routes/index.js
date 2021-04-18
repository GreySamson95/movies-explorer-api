const mainRouter = require('express').Router();
// const authProtected = require('../middlewares/authProtected');
const userRouter = require('./userRouter');
const movieRouter = require('./movieRouter');
const authRouter = require('./authRouter');
const NotFoundError = require('../errors/NotFound');

mainRouter.use('/', authRouter); // Роутинг авторазиции
mainRouter.use('/users', userRouter); // Роутинг пользователей
mainRouter.use('/movies', movieRouter); // Роутинг фильмов
mainRouter.use('*', () => { // Роутинг 404
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = mainRouter;
