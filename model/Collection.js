var mongoose = require('mongoose');

var collectionSchema = mongoose.Schema({
    owner: String,
    name: String,
}, {timestamps: true}) ;

exports.Collection = mongoose.model('collection', collectionSchema);
