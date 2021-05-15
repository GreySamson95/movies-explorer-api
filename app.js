/* ----------- импорты --------------- */
const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
// const { errors } = require('celebrate');
const limiter = require('./utils/rateLimits');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const celebrateErrorHandler = require('./middlewares/celebrateErrorHandler');
const errorHandler = require('./middlewares/errorHandler');
const mainRouter = require('./routes/index');
/* ----------------------------------- */

/* ------- порт и express ------------ */
const {
  PORT = 3000,
  MONGO = 'mongodb://localhost:27017/movie-explorer',
} = process.env;
const app = express();
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

app.use(requestLogger); // Логгер
app.use(limiter);
app.use(helmet());
app.use(cors(corsOptions)); // CORS
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

/* --------------------------------- */

/* ----------- роутинг ------------ */

app.use('/', mainRouter);

/* --------------------------------- */

/* - логгирование и обработка ошибок - */

app.use(celebrateErrorHandler);
// app.use(errors()); // JOI / Celebrate
app.use(errorHandler);
app.use(errorLogger); // Логгер

/* --------------------------------- */

/* ----------- run app ------------ */
app.listen(PORT);
/* --------------------------------- */
