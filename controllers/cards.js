const Card = require('../models/card');

const MESSAGE_400 = 'Переданы некорректные данные';
const MESSAGE_404 = 'Запрашиваемая карточка не найдена';
const MESSAGE_500 = 'На сервере произошла ошибка';
const MESSAGE_403 = 'Нельзя удалять чужие карточки';

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const InternalServerError = require('../errors/internal-server-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(200).send(
      { data: card },
    ))
    .catch(() => {
      next(new InternalServerError(MESSAGE_500));
    });
};

module.exports.createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(MESSAGE_400));
      } else {
        next(new InternalServerError(MESSAGE_500));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGE_404);
      } else if (card.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(MESSAGE_403);
      } else {
        Card.findByIdAndRemove(req.params.id)
          .then((deletedCard) => {
            res.send({ data: deletedCard });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(MESSAGE_400));
      } else {
        next(new InternalServerError(MESSAGE_500));
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGE_404);
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(MESSAGE_400));
      } else {
        next(new InternalServerError(MESSAGE_500));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGE_404);
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(MESSAGE_400));
      } else {
        next(new InternalServerError(MESSAGE_500));
      }
    });
};
