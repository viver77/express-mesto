const User = require('../models/user');

const ERROR_400 = 400;
const ERROR_404 = 404;
const ERROR_500 = 500;

const MESSAGE_400 = 'Переданы некорректные данные';
const MESSAGE_404 = 'Запрашиваемый пользователь не найден';
const MESSAGE_500 = 'На сервере произошла ошибка';

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(ERROR_500).send({ message: MESSAGE_500 });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user == null) {
        res.status(ERROR_404).send({ message: MESSAGE_404 });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: MESSAGE_400 });
      } else {
        res.status(ERROR_500).send({ message: MESSAGE_500 });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: MESSAGE_400 });
      } else {
        res.status(ERROR_500).send({ message: MESSAGE_500 });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user == null) {
        res.status(ERROR_404).send({ message: MESSAGE_404 });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_400).send({ message: MESSAGE_400 });
      } else {
        res.status(ERROR_500).send({ message: MESSAGE_500 });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user == null) {
        res.status(ERROR_404).send({ message: MESSAGE_404 });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: MESSAGE_400 });
      } else if (err.name === 'CastError') {
        res.status(ERROR_404).send({ message: MESSAGE_404 });
      } else {
        res.status(ERROR_500).send({ message: MESSAGE_500 });
      }
    });
};
