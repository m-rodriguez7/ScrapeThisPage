var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var path = require("path");

// Our scraping tools
var cheerio = require("cheerio");

// Require all models
var db = require("./models/index");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware


// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/webscraperdb");

/* ROUTES */

// send the home page
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Scrape data from one site and place it into the mongodb 
// this will also populate data on the home page
app.get("/scrape", (req, res) => {
    // Make a request for the news section of `ycombinator`
    request("https://www.infowars.com/category/us-news/", function(error, response, html) {
      // Load the html body from request into cheerio
      var $ = cheerio.load(html);
      // For each element with a "title" class
      $(".article-content").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        var result = {};
        
        result.title = $(this).children("h3").children("a").text();
        result.link = $(this).children("h3").children("a").attr("href");
        result.sub = $(this).children("h4").text();
  
        // Insert the data in the webscraper db
        db.Article.create(result)
        .then(dbArticle => {
            console.log(dbArticle);
        })
        .catch(err => {
            return res.json(err);
        })
      });
    });
  
    // Send a "Scrape Complete" message to the browser
    console.log("Scrape Complete");
});

app.get("/stories", (req, res) => {
    db.Article.find({})
    .then(dbArticle => {
        res.json(dbArticle);
    })
    .catch(err => {
        res.json(err);
    });
});



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});