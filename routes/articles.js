const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

router.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().length(179),
  }).unknown(true),
}), getArticles);

router.post('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().length(179),
  }).unknown(true),
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.date().required(),
    source: Joi.string().required(),
    link: Joi.string().min(10).regex(/^https?:\/\/[\w*-?./]*\/?$/i).required(),
    image: Joi.string().min(10).regex(/^https?:\/\/[\w*-?./]*\/?$/i).required(),
  }),
}), createArticle);

router.delete('/:articleId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().length(179),
  }).unknown(true),
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
}), deleteArticle);

module.exports = router;