const Card = require('../models/card');

const ERROR_400 = 400;
const ERROR_404 = 404;
const ERROR_500 = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send(
      { data: card },
    ))
    .catch(() => {
      res.status(ERROR_500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(ERROR_500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_404).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(ERROR_500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_404).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(ERROR_500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
