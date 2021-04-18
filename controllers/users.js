const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const BadRequestError = require('../errors/BadRequest');
const ConflictError = require('../errors/Conflict');
const UnauthorizedError = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

// POST Создаёт пользователя
const createUser = (req, res, next) => {
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => {
      res.send({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Если уже используется
        throw new ConflictError('Данный email уже зарегистрирован.');
      } else next(err);
    })
    .catch(next);
};

// Получает из запроса почту и пароль и проверяет их.
// Если почта и пароль правильные, контроллер создаёт JWT сроком на неделю.
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверный пароль или email');
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};

// Контроллер возвращает информацию о текущем пользователе:
const returnUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => { res.send(user); })
    .catch(next);
};

// Контроллер обновляет данные пользователя:
const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new BadRequestError('Не получилось обновить данные пользователя, введены некорректные данные.');
    })
    .then((updatedUser) => res.send(updatedUser))
    .catch(next);
};

module.exports = {
  returnUser, updateUser, login, createUser,
};
