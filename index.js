const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const dotenv = require("dotenv");
const ejs = require("ejs");

const path = require("path");
//var proxy = require('http-proxy-middleware');
const PORT = process.env.PORT || 5000;
//set view engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
//Configure the .env 
dotenv.config();
// DB config
const db = process.env.MONGO_URI;
//Connect to MONGODB
mongoose
  .connect(db, {
    useNewUrlParser: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err, 'there is an error'));
//load models
require('./models/index');


//Express setup
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());
//passport jwt setup
require('./config/passport.js')(passport);
//use cross-origin when transporting to React application
/*
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
*/
//import routes
app.use("/static", express.static(path.join(__dirname, '/public')));
const routes = require('./api/index.js');
//app.use("/api/users", routes.users);
app.use(require('./html-routes/index'));
/*

*/
//app.use('/api', proxy({target: 'https://www.example.org', changeOrigin: true}));
app.listen(PORT, () => {
  console.log(`App listening on Port: ${PORT}`);
});