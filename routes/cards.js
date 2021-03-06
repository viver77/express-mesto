const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const {
  getCards,
  createCard,
  dislikeCard,
  likeCard,
  deleteCard,
} = require('../controllers/cards');

const urlValidation = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

router.get('/', getCards);

router.post('/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().trim().required().min(2)
        .max(30),
      link: Joi.string().trim().required().custom(urlValidation),
    }),
  }), createCard);

router.delete('/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }), deleteCard);

router.put('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), likeCard);

router.delete('/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }), dislikeCard);

module.exports = router;
