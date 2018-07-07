var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var path = require("path");


var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware


// parse application/json
app.use(bodyParser.json());

// Static directory
// need this in order for css files/ js files to work
// Use express.static to serve the public folder as a static directory
app.use(express.static(path.join(__dirname, 'public')));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/webscraperdb");

/* ROUTES */
require("./routes/routes")(app);


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});