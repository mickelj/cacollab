var mongoose = require('mongoose');

var state = {
  db: null,
}

//Lets connect to our database using the DB server URL.
exports.connect = function(url, done) {
    if (state.db) return done();

    mongoose.connect(url);
    var db = mongoose.connection;
    state.db = db;
    db.on('error', console.error.bind(console, 'connection error:'));
}
