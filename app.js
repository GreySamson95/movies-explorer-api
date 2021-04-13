// require('dotenv').config();
const express = require('express');
const userRouter = require('./routes/userRouter');
const movieRouter = require('./routes/movieRouter');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose');
// const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();
// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true,
// });
// const allowedCors = [
//   'https://.students.nomoredomains.icu',
//   'https://.students.nomoredomains.icu',
//   'http://.students.nomoredomains.icu',
//   'http://localhost:3001',
//   'http://localhost:3000',
// ];
// const corsOptions = {
//   origin: allowedCors,
//   optionsSuccessStatus: 204,
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   preflightContinue: false,
//   allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
//   credentials: true,
// };

// // Милдверы:
// app.use(cors(corsOptions)); // CORS
// app.use(bodyParser.urlencoded({ // Парсер
//   extended: true,
// }));
// app.use(bodyParser.json()); // Парсер
// app.use(requestLogger); // Логгер

// Роутинг:
// app.use('/', authRouter);
app.use('/users', userRouter); // Роутинг пользователей
app.use('/movies', movieRouter); // Роутинг карточек
app.use('*', () => { // Роутинг 404
  // throw new NotFoundError('Запрашиваемый ресурс не найден.');
});

// Централизованная обработка ошибок:
app.use((err, req, res, next) => {
  next();
  if (err.statusCode === undefined) {
    const { statusCode = 500, message } = err;
    return res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
  }
  return res.status(err.statusCode).send({ message: err.message });
});

// Run App:
app.listen(PORT);
