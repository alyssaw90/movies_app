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

// Comment page
app.get("/comment", function(req, res){
	var addedComments = req.query.addedComments || false;
	db.comment.findAll().then(function(data){
		res.render("comment", {'commentlist': data})
	})

})

//Comment page for each movie
app.get("/watchlist/:id/comment", function(req, res){
	db.comment.find({where: {id: req.params.id}}).spread(function(commentdata, created){
		// res.send({commentdata:commentdata, created:created})
		res.render("comment")
	})
})

//Posting to comment page
app.post("/comment/save", function(req, res){
	db.comment.findOrCreate({where: {text:text}}).spread(function(commentdata, created){
		// res.send({commentdata:commentdata, created:created})
		res.redirect("comment")
	})
})

// app.post("/watchlist", function(req, res){
// 	db.Movie.findOrCreate({where: {imdb_code:req.body.imdb_code, movie_title:req.body.movie_title, year:req.body.year}}).done(function(err, data, created){
// 		res.redirect("watchlist")
// 	})
// });	

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
			/* 
			Used in disabling

			db.Movie.find({where:{imdb_code:imdbID}}).then(function(foundItemCount){
				var wasFound = foundItemCount > 0;
				res.render("movieinfo", {movieFound:wasFound, item:info})
			}) 


			*/
			// res.send(info)
			res.render("movieinfo", info)
		} else {
			console.log("ERRROOOR");
		}
	})
})

app.listen(3000);

