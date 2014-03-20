var mongourl = "mongodb://localhost:27017/mongoexample";

var express = require("express");
var app = express();
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(__dirname + "/static"));

mongodb.MongoClient.connect(mongourl, function (err, db) {
	var notes = db.collection("notes");

	app.get("/notes/all", function (req, res) {
		notes.find().toArray(function (err, notes) {
			res.json({
				notes: notes,
				error: err
			});
		});
	});

	app.post("/notes/:id/update", function (req, res) {
		var data = req.body;
		var id = new ObjectID.createFromHexString(req.param("id"));
		notes.update(data, function (err) {
			res.json({
				error: err
			});
		});
	});
	
	app.post("/notes/:id/remove",function(req,res){
		var id = new ObjectID.createFromHexString(req.param("id"));
		notes.remove({_id:id},true,function(err){
			res.json({error:err});
		});
	})

	app.post("/notes/create", function (req, res) {
		notes.insert(req.body, function (err) {
			res.json({
				error: err
			});
		});
	});
});

app.listen(80);