var nt = require('node-tokenizer');
var fs = require('fs');
var db = require('nano')('http://localhost:5984/inaugurals');

//nt.debug = true;
nt.rule('newline', /^\n/);
nt.rule('whitespace', /^\s+/);
nt.rule('word', /^\w+(?:[-']{0,1})\w+|^\b\w\b/);
nt.rule('punctuation', /^--|[\,\.\:\"\;\!\?\*\/\’\”\“\—\<\>\(\)\[\]\{\}\+\=\&\$\#\@\^\%]+/);
var tokens = nt.tokenize(fs.readFileSync('whharrison1st.txt', 'utf8'));

db.insert({_id: 'whharrison1st', _rev: '4-cb8acacf1ef7d28864077634bf5d1d19', tokens: tokens}, function (err, body) {
  if (!err) console.log(body);
});
//console.log(JSON.stringify(tokens));
