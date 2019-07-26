// // Dependencies
// const express = require('express');
// const logger = require('morgan');
// const mongoose = require('mongoose');
// var path = require('path');

// const cheerio = require('cheerio');
// const axios = require('axios');

// const exphbs = require('express-handlebars');


// // Require all models
// let db = require('./models');

// const PORT =  process.env.PORT || 3000;
// // const PORT = 3000;

// // Initialize the Express Server
// let app = express();

// mongoose.set('useCreateIndex', true);
// // Configure middleware

// // Use morgan logger for logging requests
// app.use(logger("dev"));

// // Parse request body as JSON
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Make public a static folder
// app.use(express.static('public'));

// app.get('/', function(req, res) {
//   res.render('index', {});
  
// });


//Handlebars

// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

// let routes = require('./routes/scrape-routes');
// app.use('/', routes);

// // Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/newsdb", { useNewUrlParser: true });

// Database configuration
// var databaseUrl = "newsdb";
// var collections = ["articles"];

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('Connected to Mongoose!')
// });



// Routes

// app.get('/', function(req, res) {
//   res.render('index', {});
//   // res.redirect('/articles');
// });

// // A GET route for scraping the echoJS website
// app.get("/scrape", function(req, res) {
//   // First, we grab the body of the html with axios
//   axios.get('https://www.petmd.com/dog/centers/care/content/health/all').then(function(response) {
//     // Then, we load that into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(response.data);

//     // Now, we grab every h2 within an article tag, and do the following:
//     $('ccEntry').each(function(i, element) {
//       // Save an empty result object
//       let result = [];

//       let title = $(element).find('h2').text();
//       console.log(title);
//       // Add the text and href of every link, and save them as properties of the result object
//       result.title = $(this)
//         .children("a")
//         .text();
//       result.link = $(this)
//         .children("a")
//         .attr("href");

//         db.Article.create(result)
//         .then(function(dbArticle) {
//           // View the added result in the console
//           console.log(dbArticle);
//         })
//         .catch(function(err) {
//           // If an error occurred, log it
//           console.log(err);
//         });
//     });

//     // Send a message to the client
//     res.send("Scrape Complete");
//   });
// });

// // Route for getting all Articles from the db
// app.get('/articles', function(req, res) {
//   // Grab every document in the Articles collection
//   db.Article.find({})
//     .then(function(dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   db.Article.findOne({ _id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function(dbArticle) {
//       // If we were able to successfully find an Article with the given id, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// Start the server
// app.listen(PORT, function() {
//   console.log("App running on port " + PORT + "!");
// });


// db.Article.create({ title: "Articles" })
//   .then(function(dbArticle) {
//     // If saved successfully, print the new Library document to the console
//     console.log(dbArticle);
//   })
//   .catch(function(err) {
//     // If an error occurs, print it to the console
//     console.log(err.message);
//   });


  
//   app.get("/articles", function(req, res) {
//     db.articles.find({})

//   })
// Dependencies
const express = require('express');
const mongojs = require('mongojs');
const axios = require('axios');

const logger = require('morgan');
const mongoose = require('mongoose');

const request = require('request');
const cheerio = require('cheerio');


// Initialize the Express Server
let app = express();


// Require all models
const db = require('./models');

const exphbs = require('express-handlebars');


const PORT =  process.env.PORT || 3000;
// const PORT = 3000;

mongoose.set('useCreateIndex', true);
// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static('public'));


app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');


  //connecting to MongoDB
  mongoose.connect("mongodb://localhost/newsdb", { useNewUrlParser: true });
  

// Routes

app.get('/', function(req, res) {
  res.render('index', {});
  
})
// A GET request to scrape the PetMD website
app.get('/scrape', function(req, res) {
  // First, we grab the body of the html with request
  axios.get('https://www.petmd.com/dog/centers/care/content/health/all')
    .then(function(response) {
    
    var $ = cheerio.load(response.data);

    $('.ccEntry').each(function(i, element) {

      var result = {}

      let titlesArray = [];
      let title = $(element).find('h2').find('a').text();
      console.log(title);
       // Add the text and href of every link, and save them as properties of the result object
       result.title = $(this)
        // .children('a')
        .text();
       result.link = $(this)
        .children('a')
        .attr('href');
       //ensures that no empty title or links are sent to mongodb
      //  if (result.title !== '' && result.link !== '') {
      //   //check for duplicates
      //   if(titlesArray.indexOf(result.title) == -1) {

          // push the saved title to the array 
          titlesArray.push(result.title);

          // only add the article if is not already there
          db.Article.create(result)
            .then(function(dbArticle) {

              console.log(dbArticle);
            })
            .catch(function(err) {
              // If an error occurred, log it
              console.log(err);
            });
        });
            // Send a message to the client
    res.send("Scrape Complete");
  });
});

              //if the test is 0, the entry is unique and good to save
            // if (test == 0){

            //   //using Article model, create new object
            //   var entry = new Article (result);

            //   //save entry to mongodb
            //   entry.save(function(err, doc) {
            //     if (err) {
            //       console.log(err);
            //     } else {
            //       console.log(doc);
            //     }
            //   });

            // }
      
  // Log that scrape is working, just the content was missing parts
  // else {
  //   console.log('Article already exists.')
  // }

  //   }
  //   // Log that scrape is working, just the content was missing parts
  //   else {
  //     console.log('Not saved to DB, missing data')
  //   }
  // });

// // after scrape, redirects to index
// res.redirect('/');
// });
// });

//this will grab every article an populate the DOM
app.get('/articles', function(req, res) {
//allows newer articles to be on top
db.Article.find({}).sort({_id: -1})
    //send to handlebars
    .then(function(dbArticle) {
          res.json(dbArticle); 

        })
        .catch(function(err) {
            res.json(err);
            
        })
  });


// //  // Route for getting all Articles from the db
// app.get('/articles', function(req, res) {
//   // Grab every document in the Articles collection
//   db.Article.find({})
//     .then(function(dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// This will get the articles we scraped from the mongoDB in JSON
app.get('/articles-json', function(req, res) {
  db.Article.find({}, function(err, doc) {
      if (err) {
          console.log(err);
      } else {
          res.json(doc);
      }
  });
});
// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
db.Article.findOne({ _id: req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  .then(function(dbArticle) {
    // If we were able to successfully find an Article with the given id, send it back to the client
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
// Create a new note and pass the req.body to the entry
db.Note.create(req.body)
  .then(function(dbNote) {
    // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
    // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbArticle) {
    // If we were able to successfully update an Article, send it back to the client
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});


  
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
