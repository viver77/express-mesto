const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const usersRouter = require('./routes/users')
const cardsRouter = require('./routes/cards')

// Слушаем 3000 порт
const { PORT = 3000 } = process.env

const app = express()

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})

app.use((req, res, next) => {
  req.user = {
    _id: '60c39800dca81e2c1c65b8ab'
  }
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/users', usersRouter)
app.use('/cards', cardsRouter)

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})