const winston = require('winston');
const mongoose = require('mongoose');
//const config = require('config');


module.exports = function() {
	const db = /*config.get('db')*/ process.env.MYSPACE_API_DB || 'mongodb://localhost/myspace';
	mongoose.connect(db, {
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useNewUrlParser: true
	})
		.then(() => winston.info(`Connected to ${db}...`))
		.catch(err => console.error('Error connecting to Database'));
}