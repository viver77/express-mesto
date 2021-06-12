const Card = require('../models/card')

module.exports.getCards = (req, res) => {

  Card.find({})
    .then((card) => res.status(200).send(
      { data: card }
    ))
    .catch(() => res.status(500).send(
      { message: 'На сервере произошла ошибка' }
    ))
}

module.exports.createCard = (req, res) => {

  const { _id } = req.user
  const { name, link } = req.body

  Card.create({ name, link, owner: _id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      console.log(err.message)
    })
}

module.exports.deleteCard = (req, res) => {

  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      res.send({ data: card })
    })
    .catch((err) => {
      console.log('err.message')
    })
}

module.exports.LikeCard = (req, res) => {

  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send({ data: card })
    })
    .catch((err) => {
      console.log(err.message)
    })
}

module.exports.removeLikeCard = (req, res) => {

  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send({ data: card })
    })
    .catch((err) => {
      console.log(err.message)
    })
}


