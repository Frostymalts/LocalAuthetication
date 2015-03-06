// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');

var morgan       	 = require('morgan');
var cookieParser 	 = require('cookie-parser');
var bodyParser   	 = require('body-parser');
var session      	 = require('express-session');
var userController   = require('./controllers/user.js');
var db 				 = require('./config/db.js');
var configDB = require('./private/database.json');
var users 			 = require('./controllers/user.js');
var mysql = require('mysql');
var configDB = require('./private/database.json');
var connection = mysql.createConnection(configDB);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended:false}));

// required for passport
app.use(session({ secret: 'maddieganderisbeautiful' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport')(passport); // pass passport for configuration

// static handling ============================
app.use(express.static(__dirname + "/static/public"));

app.use('/api', userController.PublicRouter());

app.use(function(req,res,next) {
	console.log("INSIDE SESSION VALIDATION");
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login.html");
	}
});

app.use(express.static(__dirname + "/static/secure"));

// routes ======================================================================
var apiRouter = express.Router();
apiRouter.use(userController.Router());
app.use('/api', apiRouter);

app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).json({
    message: err.toString()
  });
});

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);