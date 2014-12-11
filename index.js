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


//Home page
app.get("/", function(req, res){
	res.render('home');
})

//Search
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

//Watchlist
app.get("/watchlist", function(req, res){
	var added = req.query.added || false;
	db.movie.findAll().then(function(data){
		// res.send(data)
		res.render("watchlist", {'list':data})
	})
});

//Posting to watchlist
app.post("/watchlist", function(req, res){
	db.movie.findOrCreate({where: req.body}).spread(function(data, created){
		// res.send({imdb_code:data.imdb_code, movie_title:data.movie_title, year:data.year})
		res.send({data:data});
	})
});

//Comment page for each movie
app.get("/watchlist/:id/comment", function(req, res){
	var movie_id = req.params.id
	db.comment.findAll({where: {movieId:req.params.id}}).then(function(commentdata){
		// res.send({commentdata:commentdata, created:created})
		res.render("comment",{commentdata:commentdata,movie_id:movie_id})
	})
})

//Posting to comment page
app.post("/watchlist/comment/save", function(req, res){
	res.send(req.body);
	db.comment.findOrCreate({where:req.body}).spread(function(data, created){
			res.redirect("/watchlist/"+req.body.movieId+"/comment");
			res.send({data:data.content});
		}).catch(function(error){
			res.send({error:error.errors[0]})
		})
	
})

//Delete button
app.delete("/watchlist/:id", function(req, res){
	db.movie.find({where:{id: req.params.id}}).then(function(deleteCount){
		deleteCount.destroy().success(function(){
			res.send({deleted: deleteCount});
		})
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

