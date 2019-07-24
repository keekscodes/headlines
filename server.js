// Dependencies
var express = require("express");
var exphbs = require('express-handlebars');
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");


var PORT =  process.env.PORT || 3000;

// Initialize the Express Server
var app = express();


app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static("public"));


//Handlebars

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Database configuration
var databaseUrl = "newsDB";
var collections = ["articles"];

var Schema = mongoose.Schema;
var ObjectId = mongoose.ObjectId;

var articles = new Schema({
  Author: ObjectId,
  Headline: String,
  Summary: String,
  URL: String
})

// Routes
app.get("/", function(req, res) {
    res.render("index", {});
  })
  
  app.get("/api/articles", function(req, res) {
    db.articles.find({})
  })

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

module.exports=app;
