var mongoose = require('mongoose');

var codingRuleSchema = mongoose.Schema({
    owner: String,
    coding: [mongoose.Schema.Types.Mixed],
    name: String,
    codebook: String
}, {timestamps: true}) ;

module.exports = mongoose.model('coding_rule', codingRuleSchema);
