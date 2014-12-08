var express = require('express'),
	bodyParser = require ('body-parser'),
	ejs = require('ejs')
	app = express();

var request = require('request');
var models = require("./models");
var db = require ("./models/index.js");


app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


app.get("/", function(req, res){
	res.render('home');
})

app.get("/search", function(req, res){
	var query = req.query.title
	var url = "http://www.omdbapi.com/?s=" + query;

	request(url, function(error, response, body){
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			// res.send(info)
			res.render("search", {movies: info});
		} else {
			console.log("ERRROOOR");
		}
	})
})

app.get("/watchlist", function(req, res){
	var added = req.query.added || false;
	db.Movie.findAll().then(function(data){
		// res.send(data)
		res.render("watchlist", {'list':data})
	})
});


app.post("/watchlist", function(req, res){
	db.Movie.findOrCreate({where: {imdb_code:req.body.imdb_code, movie_title:req.body.movie_title, year:req.body.year}}).done(function(err, data, created){
		res.redirect("watchlist")
	})
});	


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

