var express = require('express');
var router = express.Router();
var Annotation = require('../model/Annotation');

router.get('/:id', function(req, res) {
    Annotation.findOne({"document": req.params.id }, null, function(err, doc) {
        if (err) return res.send(500, {error: err});
        if (doc) {
            res.send(doc.notes);
        } else {
            res.send([]);
        }
    })
});

router.post('/save', function(req, res) {
    Annotation.findOne({ "document": req.body.document }, null, function(err, doc) {
        if (err) return res.send(500, {error: err});
        if (doc) {
            doc.notes.push({note: req.body.note, tokenStart: req.body.tokenStart, tokenEnd: req.body.tokenEnd, shorttext: req.body.shorttext});
            doc.save(function(err) {
                if (err) return res.send(500, {error: err});
                res.send("<h3 class='alert alert-success'>Annotation updated</h3>");
            })
        } else {
            var annotation = new Annotation ({
                document: req.body.document,
                notes: [{
                         shorttext: req.body.shorttext,
                         note: req.body.note,
                         tokenStart: req.body.tokenStart,
                         tokenEnd: req.body.tokenEnd
                       }]
            });
            annotation.save(function (err) {
                if (err) return res.send(500, {error: err});
                res.send("<h3 class='alert alert-success'>Annotation added</h3>");
            });
        }
    });

});

module.exports = router;
