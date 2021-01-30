const Article = require('../models/article');
const { Error404, Error403 } = require('../errors/index');


const getArticles = (req, res, next) => Article
  .find({})
  .then((articles) => {
    res.status(200).send(articles || []);
  })
  .catch(next);

const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;
  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((newArticle) => {
      res.status(200).send(newArticle);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => Article
  .findById(req.params.articleId)
  .then((article) => {
    if (!article) {
      throw new Error404('Статья не найдена');
    }
    if (article.owner.toString() !== req.user._id) {
      throw new Error403('Вы не можете удалить статью другого пользователя');
    }
    Article
      .findOneAndRemove(req.params.articleId)
      .then((articleToDelete) => {
        if (!articleToDelete) {
          throw new Error404('Статья не найдена');
        }
      })
      .then(res.status(200).send(article))
      .catch(next);
  })
  .catch(next);

module.exports = { getArticles, createArticle, deleteArticle };
