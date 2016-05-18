var express = require('express');
var router = express.Router();
var Document = require('../model/Document').Document;
var Collection = require('../model/Collection').Collection;
var Group = require('../model/Group').Group;
var CodingRule = require('../model/CodingRule').CodingRule;
var tok = require('../utils/createTokens');
var js2xmlparser = require("js2xmlparser");

var getFieldValues = new Promise(function(resolve, reject) {
    var fieldVals = {};
    Collection.find( { owner: "57336169be1fd8064771ab91" }, null, { sort: {name: 1}}, function (err, colls) {
        fieldVals.collections = colls;
    }).then(function() {
        Group.find( { owner: "57336169be1fd8064771ab91" }, null, { sort: {name: 1}}, function (err, grps) {
            fieldVals.groups = grps;
        }).then(function() {
            CodingRule.find( { "owner": "57336169be1fd8064771ab91" }, null, { sort: {name: 1}}, function (err, crs) {
                fieldVals.rules = crs;
            }).then(function() {
                resolve(fieldVals);
            }).catch(function() {
                reject("Error retrieving coding rules");
            });
        }).catch(function() {
            reject("Error retrieving user groups");
        });
    }).catch(function() {
        reject("Error retrieving collections");
    });
});

router.get('/', function(req, res) {
    Document.find(function(err, docs) {
        if (err) res.send(err);
        res.render('document/index', {title: "All Documents", documents: docs});
    });
});

router.get('/:id/code', function(req, res, next) {
    var id = req.params.id;
    Document.findById(id, function (err, doc) {
        if(err) throw err;
        res.render('document/code', { title: doc.title, docid: doc._id.toString(), tokens: doc.tokens });
    });
});

router.get('/:id/json', function(req, res, next) {
    var id = req.params.id;
    Document.findById(id, function (err, doc) {
        if(err) throw err;
        res.send(doc);
    });
});

router.get('/:id/xml', function(req, res, next) {
    var id = req.params.id;
    Document.findById(id, function (err, doc) {
        if(err) throw err;
        res.send(js2xmlparser('document', doc));
    });
});

router.get('/:id/edit', function(req,res) {
    var id = req.params.id;
    getFieldValues.then(function(fieldVals) {
        Document.findById(id, function (err, doc) {
            if(err) throw err;
            res.render('document/edit', { title: "Edit Document: " + doc.title, doc: doc, collections: fieldVals.collections, groups: fieldVals.groups, rules: fieldVals.rules });
        });
    }).catch(function(msg){
        console.log(msg);
        res.send(msg);
    });
});

router.get('/new', function(req, res) {
    getFieldValues.then(function (fieldVals) {
        res.render('document/new', { title: "New Document", collections: fieldVals.collections, groups: fieldVals.groups, rules: fieldVals.rules });
    }).catch(function(msg){
        console.log(msg);
        res.send(msg);
    });
});


router.post('/new', function(req, res) {
    var ws = /[\n\r]+/;
    var re = /att/
    var groups, collections;
    (Array.isArray(req.body.usergroups)) ? groups = req.body.usergroups : groups = [req.body.usergroups];
    (Array.isArray(req.body.collections)) ? collections = req.body.collections : collections = [req.body.collections];

    var permissions = {
        "regusers": req.body.regusers,
        "grpusers": req.body.grpusers,
        "cavisible": req.body.cavisible
    };

    var metadata = {};

    for (var key in req.body) {
        if (re.test(key)) {
            var id = key.replace("att", "");
            metadata[req.body[key]] = req.body['val' + id];
        }
    }

    var newDocument = new Document({
        owner: "",
        title: req.body.name,
        contributors: req.body.contrib.split(ws),
        tokens: tok.catokenize(req.body.docText),
        groups: groups,
        collections: collections,
        codingset: req.body.codingrules,
        permissions: permissions,
        metadata: metadata,
        codingfixed: req.body.codingfixed,
        created: new Date,
        modified: new Date
    });

    newDocument.save(function (err, doc) {
        if (err) return console.error(err);
        console.log("Success");
        res.send("Success");
    });
});

module.exports = router;
