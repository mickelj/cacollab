var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
    owner: String,
    name: String,
}) ;

exports.Group = mongoose.model('group', groupSchema);
