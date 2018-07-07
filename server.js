const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const PORT = 3000;
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webscraperdb"

// Initialize Express
const app = express();

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
mongoose.connect(MONGODB_URI);

/* ROUTES */
require("./routes/routes")(app);


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});