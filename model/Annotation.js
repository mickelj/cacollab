var mongoose = require('mongoose');

var singleNoteSchema = mongoose.Schema({
    owner: String,
    note: String,
    tokenStart: Number,
    tokenEnd: Number
}, { timestamps: true });

var noteSchema = mongoose.Schema({
    document: String,
    notes: [singleNoteSchema]
});

exports.Annotation = mongoose.model('annotation', noteSchema);
