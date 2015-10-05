var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'INDIVIDUAL LIGHTS',
    name:'Masu'
  });
});

module.exports = router;