var express = require('express');
var router = express.Router();
var CodingRule = require('../model/CodingRule');

router.get('/new', function(req, res) {
    res.render('modals', {modaltype: 'codingrule'})
});

module.exports = router;
