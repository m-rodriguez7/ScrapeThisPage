var path = require('path');
var request = require("request");
// Our scraping tools
var cheerio = require("cheerio");

// Require all models
var db = require("./../models/index");

module.exports = (app) => {
    
    // send the home page
    app.get("/", (req,res) => {
        res.sendFile(path.join(__dirname, "./public/index.html"));
    });

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
    
    app.get("/allarticles/:id", (req,res) => {
        db.Article.findOne({_id: req.params.id})
            // hopefully, this code will give all the notes associated with an article
            .populate("note")
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            })
    })
    
    app.post('/articles/:id', (req,res) => {
        db.Note.create(req.body)
            .then(dbNote => {
                return db.Article.findOneAndUpdate({_id: req.params.id}, {$push : {note: dbNote._id}}, {new:true});
            })
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            })
    });
    
    app.delete('/delete/:id', (req,res) => {
        db.Note.remove({
            _id: req.params.id
        })
        .then(dbNote => {
            res.json(dbNote);
        })
        .catch(err => {
            res.json(err);
        })
    });
}

