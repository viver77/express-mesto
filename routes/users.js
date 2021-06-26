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
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/:me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().trim().min(2).max(30),
      about: Joi.string().trim().min(2).max(30),
    }),
  }), updateProfile);

router.patch('/:me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().trim().uri(),
    }),
  }), updateAvatar);
router.get('/me', getMe);

module.exports = router;
