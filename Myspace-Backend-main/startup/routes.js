const express = require('express');
const error = require('../middleware/error');

const users = require('../routes/users');
const auth = require('../routes/auth');
const movies = require('../routes/movies');
const books = require('../routes/books');


module.exports = function(app) {
	app.use(express.json());
	app.use('/api/users', users);
 	app.use('/api/auth', auth);
	app.use('/api/movies', movies);
	app.use('/api/books', books);
	app.use(error);
}