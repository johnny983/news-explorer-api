const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser, getCurrentUser } = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(5),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(5),
    password: Joi.string().required(),
  }),
}), login);
router.get('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().length(179),
  }).unknown(true),
}), getCurrentUser);

module.exports = router;
