var mongoose = require('mongoose');

var codingRuleSchema = mongoose.Schema({
    owner: String,
    coding: mongoose.Schema.Types.Mixed,
    name: String,
    codebook: String
}) ;

exports.CodingRule = mongoose.model('coding_rule', codingRuleSchema);
