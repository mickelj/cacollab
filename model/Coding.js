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

exports.Coding = mongoose.model('coding', codingSchema);
