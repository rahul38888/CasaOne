var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, { useNewUrlParser: true },async function(err, db) {
  if (err) throw err;
  var dbo = db.db("casaonedb");
  var p = await dbo.collection("productinfo").find({}).toArray()[0];
  // console.log(p);
  db.close()
});