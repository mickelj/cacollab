var mongoose = require('mongoose');

var codingRuleSchema = mongoose.Schema({
    owner: String,
    coding: [mongoose.Schema.Types.Mixed],
    name: String,
    codebook: String
}, {timestamps: true}) ;

exports.CodingRule = mongoose.model('coding_rule', codingRuleSchema);
