var mc = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/cacollab';

mc.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  findDocs(db, function() {
    db.close();
  });
});

var 

var findDocs = function(db, callback) {
   var cursor = db.collection('documents').find();
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir([doc.president, doc.year]);
      } else {
         callback();
      }
   });
};
