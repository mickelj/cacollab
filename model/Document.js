var mongoose = require('mongoose');

var documentSchema = mongoose.Schema({
    owner: String,
    groups: [String],
    collections: [String],
    permissions: mongoose.Schema.Types.Mixed,
    contributors: [String],
    metadata: mongoose.Schema.Types.Mixed,
    codingset: String,
    codingflex: Boolean,
    title: String,
    tokens: [String]
}, {timestamps: true}) ;

exports.Document = mongoose.model('document', documentSchema);
