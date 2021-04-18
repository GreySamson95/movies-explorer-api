const mongoose = require('mongoose');

const regex = /^(https?:\/\/)?(w{3,}.)?([a-z0-9-]+\.)+([a-z]{2,})\/?([a-z0-9-._~:/?#[\]@!$&'()*+,;=]){0,}/i;
// https://                            : ^(https?:\/\/)?
// www.                                : (w{3,}.)?
// субдомен                            : ([a-z0-9\-]+\.)+
// доменная зона                       : ([a-z]{2,})\/?
// путь                                : ([a-z0-9-._~:\/?#\[\]@!$&'()*+,;=]){0,}

const movieSchema = new mongoose.Schema({
  country: { // страна создания фильма
    type: String,
    required: true,
  },
  director: { // режиссёр фильма
    type: String,
    required: true,
  },
  duration: { // длительность фильма
    type: Number,
    required: true,
  },
  year: { // год выпуска фильма
    type: String,
    required: true,
  },
  description: { // описание фильма
    type: String,
    required: true,
  },
  image: { // ссылка на постер к фильму [URL]
    type: String,
    required: true,
    validate: {
      validator(url) {
        return regex.test(url);
      },
      message: 'Введите корректный URL',
    },
  },
  trailer: { // ссылка на трейлер фильма [URL]
    type: String,
    required: true,
    validate: {
      validator(url) {
        return regex.test(url);
      },
      message: 'Введите корректный URL',
    },
  },
  thumbnail: { // миниатюрное изображение постера к фильму [URL]
    type: String,
    required: true,
    validate: {
      validator(url) {
        return regex.test(url);
      },
      message: 'Введите корректный URL',
    },
  },
  owner: { // _id пользователя, который сохранил статью
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
  movieId: { // id фильма, который содержится в ответе сервиса MoviesExplorer
    type: Number,
    required: true,
  },
  nameRU: { // название фильма на русском языке
    type: String,
    required: true,
  },
  nameEN: { // название фильма на английском языке
    type: String,
    required: true,
  },

});

module.exports = mongoose.model('movie', movieSchema);
