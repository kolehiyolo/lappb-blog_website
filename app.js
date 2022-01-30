//jshint esversion:6

// * NODE DEPENDENCIES DECLARATIONS
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

// -* Not sure what this does lol
app.use(bodyParser.urlencoded({
  extended: true
}));

// -* I believe this is set to make sure EJS is set
app.set('view engine', 'ejs');

// -* This makes sure that any Express calls for files will always set the public folder as the root
app.use(express.static(__dirname+`/public`));

// * DEMO DATA
const data = require(`${__dirname}/public/javascript/data.js`);

// * EXPRESS ROUTES
app.get("/", function (req, res) {
  console.log(`GET request for Home Page`); 
  console.log(`\n`);   

  res.render(`modules/home`, {
    sample: data.homeStartingContent
  });
});



// * SERVER LISTENER
// TODO - Make sure to fix the port number
// 5000 - Personal
// 1000 - freeCodeCamp
// 2000 - Frontend Mentor
// 3000 - London App Brewery
app.listen(3011, function () {
  console.log("The server is running on port 3011.")
  console.log(`\n`);
});