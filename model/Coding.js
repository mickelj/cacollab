var mongoose = require('mongoose');

var singleCodeSchema = mongoose.Schema({
    owner: String,
    code: String,
    value: Number,
    tokenStart: Number,
    tokenEnd: Number,
    shorttext: String
}, { timestamps: true });

var codingSchema = mongoose.Schema({
    document: String,
    codes: [singleCodeSchema]
});

module.exports = mongoose.model('coding', codingSchema);
