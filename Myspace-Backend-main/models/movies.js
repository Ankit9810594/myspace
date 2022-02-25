const Joi = require('joi');
const mongoose = require('mongoose');


const Movies = mongoose.model('Movies', new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    name: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true
    },
    watched: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        maxlength: 1024
    }     
}));


function validateMovie(movie) {
    const schema = {
        date: Joi.date().allow(''),
        name: Joi.string().min(2).max(255).required(),
        watched: Joi.boolean().allow(''),
        description: Joi.string().max(1024).allow('')
    };

    return Joi.validate(movie, schema);
}

exports.Movies = Movies; 
exports.validateMovie = validateMovie;