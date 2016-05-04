var express = require('express');
var router = express.Router();
var db = require('nano')('http://localhost:5984/inaugurals');

router.get('/:year', function(req, res, next) {
    db.view('addresses', 'wordlist', {key: req.params.year}, function (err, doc) {
	if(err) {
	    throw(err);
	}

        res.render('address', {title: 'Testing', tokens: doc.rows[0].value});
	//res.send(doc.rows[0].value);
    });
});

module.exports = router;
