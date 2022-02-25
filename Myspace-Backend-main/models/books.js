const Joi = require('joi');
const mongoose = require('mongoose');


const Books = mongoose.model('Books', new mongoose.Schema({
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
    read: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        maxlength: 1024
    }     
}));


function validateBook(book) {
    const schema = {
        date: Joi.date().allow(''),
        name: Joi.string().min(2).max(255).required(),
        read: Joi.boolean().allow(''),
        description: Joi.string().max(1024).allow('')
    };

    return Joi.validate(book, schema);
}

exports.Books = Books; 
exports.validateBook = validateBook;