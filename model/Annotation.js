var mongoose = require('mongoose');

var singleNoteSchema = mongoose.Schema({
    owner: String,
    note: String,
    tokenStart: Number,
    tokenEnd: Number,
    shorttext: String
}, { timestamps: true });

var noteSchema = mongoose.Schema({
    document: String,
    notes: [singleNoteSchema]
});

module.exports = mongoose.model('annotation', noteSchema);
