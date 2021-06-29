const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  celebrate, Joi, errors, CelebrateError,
} = require('celebrate');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');

const MESSAGE_404 = 'Запрашиваемый ресурс не найден';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const urlValidation = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().trim().min(2).max(30),
    about: Joi.string().trim().min(2).max(30),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
    avatar: Joi.string().trim().custom(urlValidation),
  }),
}), createUser);

// авторизация
app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('/', () => {
  throw new NotFoundError(MESSAGE_404);
});

// обработчик ошибок celebrate
app.use(errors());

// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode)
    .send({ // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
