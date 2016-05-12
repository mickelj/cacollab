var mongoose = require('mongoose');

var collectionSchema = mongoose.Schema({
    owner: String,
    name: String,
}) ;

exports.Collection = mongoose.model('collection', collectionSchema);
