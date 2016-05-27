var express = require('express');
var router = express.Router();
var Collection = require('../model/Collection');

router.get('/new', function(req, res) {
    res.render('modals', {modaltype: 'collection'})
});

router.post('/save', function(req, res) {
    Collection.findOne( {"name" : req.body.name}, function(err, doc) {
        if (err) res.send(500, {error: err});
        if (doc) {
            res.send("<h3 class='alert alert-danger'>Collection already exists</h3>");
        } else {
            var collection = new Collection ({
                name: req.body.name
            });
            collection.save(function (err) {
                if (err) return res.send(500, {error: err});
                res.send("<h3 class='alert alert-success'>Collection added</h3>");
            });

        }
    });
});

module.exports = router;
