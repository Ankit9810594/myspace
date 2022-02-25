const { Movies, validateMovie } = require("../models/movies");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();


router.get("/", [auth], async (req, res) => {
    const movies = await Movies.find()
        .select("-__v")
        .sort("date");
        
    res.send(movies);
});


router.get("/:id", [auth, validateObjectId], async (req, res) => {
    const movie = await Movies.findById(req.params.id).select("-__v");

    if (!movie)
        return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
});


router.post("/", [auth], async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.message);

    const movie = new Movies({
        name: req.body.name,
        description: req.body.description
    });

    await movie.save();

    res.send(movie);
});


router.put("/:id", [auth], async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movies.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            watched: req.body.watched
        },
        { new: true }
    );

    if (!movie)
        return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
});


router.delete("/:id", [auth], async (req, res) => {
    const movie = await Movies.findByIdAndRemove(req.params.id);

    if (!movie)
        return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
});


module.exports = router;