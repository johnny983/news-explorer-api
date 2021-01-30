const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET = 'dev-secret', SALT_ROUND } = process.env;

const User = require('../models/user');
const { Error401, Error404, Error409 } = require('../errors/index');

const getCurrentUser = (req, res, next) => User
  .findOne({ _id: req.user._id })
  .then(((user) => {
    if (!user) {
      throw new Error404('Нет пользователя с таким id');
    }
    res.status(200).send(user);
  }))
  .catch(next);

const createUser = (req, res, next) => {
  const {
    email, password, name, about,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error409('Такой email уже зарегистрирован');
      }
      return bcrypt.hash(password, +SALT_ROUND)
        .then((hash) => User.create({
          email,
          password: hash, // записываем хеш в базу
          name,
          about,
        }))
        .then((newUser) => {
          res.status(200).send({
            email: newUser.email,
            _id: newUser._id,
            name: newUser.name,
            about: newUser.about,
          });
        })
        .catch(next);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Error401('Неправильный логин или пароль');
      }
      bcrypt.compare(password, user.password).then((matched) => {
        if (matched) {
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          return res.send({ token });
        }
        throw new Error401('Неправильный логин или пароль');
      })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
};
