var express = require('express');
var router = express.Router();
var Group = require('../model/Group');

router.get('/new', function(req, res) {
    res.render('modals', {modaltype: 'usergroup'})
});

module.exports = router;
