const router = require('express').Router()

const {
  getCards,
  createCard,
  removeLikeCard,
  LikeCard,
  deleteCard
} = require('../controllers/cards')

router.get('/', getCards)
router.post('/', createCard)
router.delete('/:id', deleteCard)
router.put('/:id/likes', LikeCard)
router.delete('/:id/likes', removeLikeCard)

module.exports = router
