var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
    owner: String,
    name: String,
    members: [String]
}, {timestamps: true}) ;

module.exports = mongoose.model('group', groupSchema);
