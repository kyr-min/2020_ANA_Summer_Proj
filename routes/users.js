var express = require('express');
var User = require('../models').User;

var router = express.Router();

router.get('/', function(req, res, next) {
  User.findAll({
    attributes: ['id', 'name', 'score'],
    order: [['score', 'DESC']],
    limit: 5,
  })
  .then((users) => {
    res.json(users);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  });
});

router.post('/', function(req,res, next) {
  User.create({
    name: req.body.name,
    score: req.body.score,
  })
  .then((result) => {
    console.log(result);
    res.status(201).json(result);
  })
  .catch((err) => {
    console.err(err);
    next(err);
  });
});

module.exports = router;
