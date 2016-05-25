var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
    owner: String,
    name: String,
    members: [String]
}, {timestamps: true}) ;

exports.Group = mongoose.model('group', groupSchema);
