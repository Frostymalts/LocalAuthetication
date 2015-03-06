"use strict";

var express = require('express');
var passport = require('passport');
var db		= require('../config/db.js');

function login(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	passport.authenticate('local-login', function(err, user, info) {
		console.log("****** Inside login route *******");
		if (err) { return next(err); }
		if (!user) {
			return res.status(401).json(info);
		}

		req.login(user, function(err)
		{
			if (err) { return next(err); }
			return res.redirect('/');
		})
	})(req, res, next);
}

// no more errors
function signup(req, res, next) {
	console.log("Inside user.js singnup function");
	var username = req.body.username;
	var password = req.body.password;

	passport.authenticate('local-signup', function(err, user, info) {
		if (err) { return next(err); }
		req.login(user, function(err)
		{
			if (err) { return next(err); }
			return res.redirect('/');
		})
	})(req, res, next);
}

module.exports.PublicRouter = function() {
	var router = express.Router();
	router.post('/login', login);
	router.post('/signup', signup);
	return router;	
}

module.exports.Router = function() {
	var router = express.Router();
	return router;
}
