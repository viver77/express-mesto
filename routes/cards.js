const router = require('express').Router();

const {
  getCards,
  createCard,
  dislikeCard,
  likeCard,
  deleteCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', deleteCard);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);

module.exports = router;
