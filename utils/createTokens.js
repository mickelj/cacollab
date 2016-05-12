var nt = require('node-tokenizer');

exports.catokenize = function(text) {
    nt.rule('newline', /^\r\n|^[\n\r]/);
    nt.rule('whitespace', /^\s+/);
    nt.rule('word', /^\w+(?:[-'’]{0,1})\w+|^\b\w\b/);
    nt.rule('punctuation', /^--|[\,\.\:\"\;\!\?\*\/\’\”\“\—\<\>\(\)\[\]\{\}\+\=\&\$\#\@\^\%]+/);
    return nt.tokenize(text);
}
