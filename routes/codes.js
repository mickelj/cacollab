var express = require('express');
var router = express.Router();
var Coding = require('../model/Coding');
var CodingRule = require('../model/CodingRule');
var Document = require('../model/Document');

router.get('/:id', function(req, res) {
    Coding.findOne({"document": req.params.id }, null, function(err, doc) {
        if (err) return res.send(500, {error: err});
        if (doc) {
            res.send(doc.codes);
        } else {
            res.send([]);
        }
    });
});

router.post('/save', function(req, res) {
    Coding.findOne({ "document": req.body.document }, null, function(err, doc) {
        if (err) return res.send(500, {error: err});
        if (doc) {
            doc.codes.push({code: req.body.codefield, value: req.body.codevalue, tokenStart: req.body.tokenStart, tokenEnd: req.body.tokenEnd, shorttext: req.body.shorttext});
            doc.save(function(err) {
                if (err) return res.send(500, {error: err});
                res.send("<h3 class='alert alert-success'>Coding updated</h3>");
            })
        } else {
            var coding = new Coding ({
                document: req.body.document,
                codes: [{
                         shorttext: req.body.shorttext,
                         code: req.body.codefield,
                         value: req.body.codevalue,
                         tokenStart: req.body.tokenStart,
                         tokenEnd: req.body.tokenEnd
                       }]
            });
            coding.save(function (err) {
                if (err) return res.send(500, {error: err});
                res.send("<h3 class='alert alert-success'>Coding added</h3>");
            });
        }
    });
});

module.exports = router;
