const User = require('../models/user')

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(err.message)
    })
}

module.exports.getUserById = (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      res.send({ data: user })
    })
    .catch((err) => {
       console.log(err.message)
    })
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user })
    })
    .catch((err) => {
      // console.log(err.message)
      console.log('err.message')
    })
}