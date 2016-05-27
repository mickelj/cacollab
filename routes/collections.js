var express = require('express');
var router = express.Router();
var Collection = require('../model/Collection');

router.get('/new', function(req, res) {
    res.render('modals', {modaltype: 'collection'})
});

module.exports = router;
