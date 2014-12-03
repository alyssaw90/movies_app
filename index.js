var express = require('express'),
	bodyParser = require ('body-parser'),
	ejs = require('ejs')
	app = express();
var request = require('request')
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


app.get("/", function(req, res){
	res.render("index")
})

app.get("/search", function(req, res){
	var query = req.query.title
	var url = "http://www.omdbapi.com/?s=" + query;

	request(url, function(error, response, body){
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			// res.send(info)
			res.render("search", info)
		} else {
			console.log("ERRROOOR");
		}
	})
})

app.get("/:imdbID", function(req, res){
	var id = req.params.imdbID
	var url = "http://www.omdbapi.com/?i=" + id;

	request(url, function(error, response, body){
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			// res.send(info)
			res.render("movieinfo", info)
		} else {
			console.log("ERRROOOR");
		}
	})
})


app.listen(3000);