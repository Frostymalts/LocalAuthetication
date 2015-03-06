// config/passport.js
				
// load all them requires 
var LocalStrategy   = require('passport-local').Strategy;
 
var mysql = require('mysql');
var configDB = require('../private/database.json');
var connection = mysql.createConnection(configDB);
var bcrypt = require('bcrypt-nodejs');
 
 
// I'm pretty sure this what I'm supposed to do
module.exports = function(passport) {
 
    // looked this one up on line, seems prety simple,
    // bur I'm a little suspicisious. 
    passport.serializeUser(function(user, done) {
		done(null, user.username);
    });
 
    // same as serialize, but I think this one makes more sense
    // grab a user and thats it really
    passport.deserializeUser(function(username, done) {
		connection.query("select * from users where username = ?", username, function(err,rows){
            if (err) {
                return done(err)
            }
            if (rows.length <= 0) {
                return done(new Error("User was not found"));
            }	
			done(null, rows[0]);
		});
    });

    // sign this bro up =============================
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // was told to do this buy the internet
    },
    function(req, users, password, done) {

        console.log("inside local-signup Strategy");
 
		// find a user whose username is the same as the forms username
		// we are checking to see if the user trying to login already exists
        connection.query("select count(*) from users where username = ?", username, function(err,rows){ 
			console.log(rows);
			console.log("above row object");
			if (err)
                return done(err);
			 if (rows.length > 0) { // so we found a matching username
                return done(null, false, { message : 'That username has been taken' }); //username taken
            } else {
 
				// if there is no user with that email
                // create the username
                var newUserMysql = new Object(); // again found this on the interwebs
				
				newUserMysql.username    = username;
                newUserMysql.password = bcrypt.hashSync(password, bcrypt.genSaltSync()); // need to hash this
	
				connection.query("INSERT INTO users set ?", newUserMysql, function(err) {
				    return done(err, newUserMysql);
				});	
            }	
		});
    }));
 
    
    // log us in! ==================================
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback //WHAT IS THIS!!
    },
    function(req, username, password, done) { // callback with email and password from our form

        console.log("Inside local-login strategy");
 
         connection.query("SELECT * FROM users WHERE username = ?", username, function(err,rows){
			if (err)
                return done(err);
			 if (0 == rows.length) {
                return done(null, false, {message : 'Username or password was incorrect.'});
            } 
			// if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password))
                return done(null, false, {message: 'Username or password was incorrect.'}); // create the loginMessage and save it to session as flashdata
			
            // all is well, return successful user
            return done(null, rows[0]);			
		
		});
    }));
};