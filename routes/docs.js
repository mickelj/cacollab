module.exports = function(io) {
    var express = require('express');
    var router = express.Router();
    var Annotation = require('../model/Annotation').Annotation;
    var Coding = require('../model/Coding').Coding;
    var CodingRule = require('../model/CodingRule').CodingRule;
    var Document = require('../model/Document').Document;
    var Collection = require('../model/Collection').Collection;
    var Group = require('../model/Group').Group;
    var tok = require('../utils/createTokens');
    var js2xmlparser = require("js2xmlparser");
    var async = require("async");

    var getFieldValues = new Promise(function(resolve, reject) {
        async.parallel({
            collections: function(cb) {
                Collection.find( { owner: "57336169be1fd8064771ab91" }, null, { sort: {name: 1}}, function (err, colls) {
                    cb(null, colls);
                });
            },
            groups: function(cb) {
                Group.find( { owner: "57336169be1fd8064771ab91" }, null, { sort: {name: 1}}, function (err, grps) {
                    cb(null, grps);
                });
            },
            rules: function(cb) {
                CodingRule.find( { "owner": "57336169be1fd8064771ab91" }, null, { sort: {name: 1}}, function (err, crs) {
                    cb(null, crs);
                });
            }
        }, function (err, result) {
            if (err) reject(err);
            resolve(result);
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

        async.parallel({
            doc: function(cb1) {
                async.waterfall([
                    function(cb2) {
                        Document.findById(id, function (err, doc) {
                            cb2(null, doc);
                        });
                    },
                    function(doc, cb3) {
                        CodingRule.findById( doc.codingset, function (err, crs) {
                            cb3(null, {doc: doc, crs: crs});
                        });
                    }], function (err, result) {
                        cb1(null, result);
                    });
            },
            codes: function(cb4) {
                Coding.findOne({"document": id }, null, function(err, codes) {
                    if (codes) {
                        cb4(null, codes.codes);
                    } else {
                        cb4(null, []);
                    }
                });
            },
            notes: function(cb5) {
                Annotation.findOne({"document": id }, null, function(err, notes) {
                    if (notes) {
                        cb5(null, notes.notes);
                    } else {
                        cb5(null, []);
                    }
                });
            }
        }, function(err, results) {
            if (err) res.send(err);
            res.render('document/code', { title: results.doc.doc.title, doc: results.doc.doc, crs: results.doc.crs,  codes: results.codes, notes: results.notes.sort(function(a, b) { return b.updatedAt.toString().localeCompare(a.updatedAt.toString()); }) });
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

    return router;
}
