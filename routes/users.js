const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getMe,
} = require('../controllers/users');

router.get('/', getUsers);
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
      avatar: Joi.string().trim().uri()
        .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    }),
  }), updateAvatar);
router.get('/me', getMe);

module.exports = router;
