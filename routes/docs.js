var express = require('express');
var router = express.Router();
var Document = require('../model/Document').Document;
var Collection = require('../model/Collection').Collection;
var Group = require('../model/Group').Group;
var CodingRule = require('../model/CodingRule').CodingRule;
var tok = require('../utils/createTokens');

router.get('/all', function(req, res) {
    Document.find(function(err, docs) {
        if (err) res.send(err);
        res.render('document/index', {title: "All Documents", documents: docs});
    });
});

router.get('/:id/edit', function(req, res, next) {
    var id = req.params.id;
    Document.findById(id, function (err, doc) {
        if(err) throw err;
        res.render('document/edit', { title: doc.title, tokens: doc.tokens });
    });
});


router.get('/new', function(req, res) {
    var collections, groups, rules;
    Collection.find( { owner: "57336169be1fd8064771ab91" }, function (err, colls) {
        collections = colls;
    }).then(function() {
        Group.find( { owner: "57336169be1fd8064771ab91" }, function (err, grps) {
            groups = grps;
        }).then(function() {
            CodingRule.find( { "owner": "57336169be1fd8064771ab91" }, function (err, crs) {
                rules = crs;
            }).then(function() {
                res.render('document/new', { title: "New Document", collections: collections, groups: groups, rules: rules });
            });
        });
    });
});


router.post('/new', function(req, res) {
    var re = /[\n\r]+/;

    var newDocument = new Document({
        title: req.body.name,
        contributors: req.body.contrib.split(re),
        tokens: tok.catokenize(req.body.docText)
    });

    newDocument.save(function (err, doc) {
        if (err) return console.error(err);
        console.log("Success");
        res.send("Success");
    })
});

module.exports = router;
