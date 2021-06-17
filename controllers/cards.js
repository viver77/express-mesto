const Card = require('../models/card');

const ERROR_400 = 400;
const ERROR_404 = 404;
const ERROR_500 = 500;

const MESSAGE_400 = 'Переданы некорректные данные';
const MESSAGE_404 = 'Запрашиваемая карточка не найдена';
const MESSAGE_500 = 'На сервере произошла ошибка';

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send(
      { data: card },
    ))
    .catch(() => {
      res.status(ERROR_500).send({ message: MESSAGE_500 });
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
        res.status(ERROR_400).send({ message: MESSAGE_400 });
      } else {
        res.status(ERROR_500).send({ message: MESSAGE_500 });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (card == null) {
        res.status(ERROR_404).send({ message: MESSAGE_404 });
      } else {
        res.send({ data: card });
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

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card == null) {
        res.status(ERROR_404).send({ message: MESSAGE_404 });
      } else {
        res.send({ data: card });
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card == null) {
        res.status(ERROR_404).send({ message: MESSAGE_404 });
      } else {
        res.send({ data: card });
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
