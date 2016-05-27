var mongoose = require('mongoose');

var collectionSchema = mongoose.Schema({
    owner: String,
    name: String,
}, {timestamps: true}) ;

module.exports = mongoose.model('collection', collectionSchema);
