/* ----------- импорты --------------- */
const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
// const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
/* ----------------------------------- */

/* ------- порт и express ------------ */
const {
  PORT = 3000,
  MONGO = 'mongodb://localhost:27017/movie-explorer',
} = process.env;
const app = express();
/* ----------------------------------- */

/* --------- rate limiter ------------ */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
/* ----------------------------------- */

/* --------  база данных ------------- */
mongoose.connect(MONGO, { // Подключение БазыДанных
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
/* ----------------------------------- */

/* ----------- Cors конфиг ----------- */
const allowedCors = [
  'https://api.greysamson.nomoredomains.club',
  'https://greysamson.nomoredomains.club',
  'http://api.greysamson.nomoredomains.club',
  'http://greysamson.nomoredomains.club',
  'http://localhost:3001',
  'http://localhost:3000',
];
const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 204,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};
/* --------------------------------- */

/* ----------- милдверы ------------ */
app.use(cors(corsOptions)); // CORS
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(requestLogger); // Логгер
/* --------------------------------- */

/* ----------- роутинг ------------ */
const mainRouter = require('./routes/index');

app.use('/', mainRouter);
/* --------------------------------- */

/* - логгирование и обработка ошибок - */
const celebrateErrorHandler = require('./middlewares/celebrateErrorHandler');// кастом JOI / Celebrate
const errorHandler = require('./middlewares/errorHandler');

app.use(celebrateErrorHandler);
app.use(errorHandler);
// app.use(errors()); // JOI / Celebrate
// app.use((err, req, res, next) => {
//   console.log(err);
//   const { statusCode = 500, message } = err;
//   res
//     .status(statusCode)
//     .send({
//       message: statusCode === 500
//         ? 'На сервере произошла ошибка'
//         : message,
//     });
//   next();
// });
app.use(errorLogger); // Логгер
/* --------------------------------- */

/* ----------- run app ------------ */
app.listen(PORT);
/* --------------------------------- */
