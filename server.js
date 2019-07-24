// Dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var axios = require('axios');
var logger = require("morgan");


var PORT =  process.env.PORT || 3000;

// Require all models
var db = require('./models');

// Initialize the Express Server
var app = express();


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static('public'));


//Handlebars

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsdb", { useNewUrlParser: true });

// Database configuration
// var databaseUrl = "newsDB";
// var collections = ["articles"];

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to Mongoose!')
});

var routes = require('./controller/controller.js');
app.use(routes);


// db.Article.create({ title: "Articles" })
//   .then(function(dbArticle) {
//     // If saved successfully, print the new Library document to the console
//     console.log(dbArticle);
//   })
//   .catch(function(err) {
//     // If an error occurs, print it to the console
//     console.log(err.message);
//   });

// // Routes
// app.get("/", function(req, res) {
//     res.render("index", {});
//   })
  
//   app.get("/articles", function(req, res) {
//     db.articles.find({})

//   })

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

module.exports=app;
