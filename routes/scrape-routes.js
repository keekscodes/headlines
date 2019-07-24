var express = require('express');
var router = express.Router();
var path = require('path');

var request = require('request');
var cheerio = require('cheerio');

var Comment = require('../models/comment');
var Article = require('../models/article');

app.get('/', function(req, res) {
    res.redirect('/articles');
});

app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.petmd.com/dog/centers/care/content/health/all").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      $('.ccEntry').each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and the information, and save them as properties of the result object
        // result.title = $(this)
        //     .find("h2")
        //     .text();
        // result.link = $(this)
        //     .find("a")
        //     .attr("href");
        // result.date = $(this)
        //     .find("time")
        //     .attr("datetime");
        // result.summary = $(this)
        //     .find("p")
        //     .text();
        // result.image = $(this)
        //     .find("img")
        //     .attr("src");

        result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
            .then(function (dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                return res.json(err);
                console.log(err);
            });
    });
    // res.send("Scrape Complete!");
    // res.redirect("/articles");
    res.send("Scrape Complete");

    });
});
