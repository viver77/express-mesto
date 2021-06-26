const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const MESSAGE_401 = 'Необходима авторизация!';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError(MESSAGE_401);
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedError(MESSAGE_401);
  }

  req.user = payload;

  next();
};
