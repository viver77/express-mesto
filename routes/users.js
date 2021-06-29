const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getMe,
} = require('../controllers/users');

const urlValidation = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), getUserById);

router.patch('/:me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().trim().min(2).max(30)
        .default('Жак-Ив Кусто'),
      about: Joi.string().trim().min(2).max(30)
        .default('Исследователь'),
    }),
  }), updateProfile);

router.patch('/:me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().trim().custom(urlValidation)
        .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    }),
  }), updateAvatar);

module.exports = router;
