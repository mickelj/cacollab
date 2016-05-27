var mongoose = require('mongoose');

var documentSchema = mongoose.Schema({
    owner: String,
    groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'group'}],
    collections: [{type: mongoose.Schema.Types.ObjectId, ref: 'collection'}],
    permissions: mongoose.Schema.Types.Mixed,
    contributors: [String],
    metadata: mongoose.Schema.Types.Mixed,
    codingset: {type: mongoose.Schema.Types.ObjectId, ref: 'coding_rule'},
    codingflex: Boolean,
    title: String,
    tokens: [String]
}, {timestamps: true}) ;

module.exports = mongoose.model('document', documentSchema);
