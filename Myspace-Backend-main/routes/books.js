const { Books, validateBook } = require("../models/books");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();


router.get("/", [auth], async (req, res) => {
    const books = await Books.find()
        .select("-__v")
        .sort("date");
        
    res.send(books);
});


router.get("/:id", [auth, validateObjectId], async (req, res) => {
    const book = await Books.findById(req.params.id).select("-__v");

    if (!book)
        return res.status(404).send("The book with the given ID was not found.");

    res.send(book);
});


router.post("/", [auth], async (req, res) => {
    const { error } = validateBook(req.body);
    if (error) return res.status(400).send(error.message);

    const book = new Books({
        name: req.body.name,
        description: req.body.description
    });

    await book.save();

    res.send(book);
});


router.put("/:id", [auth], async (req, res) => {
    const { error } = validateBook(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const book = await Books.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            read: req.body.read
        },
        { new: true }
    );

    if (!book)
        return res.status(404).send("The book with the given ID was not found.");

    res.send(book);
});


router.delete("/:id", [auth], async (req, res) => {
    const book = await Books.findByIdAndRemove(req.params.id);

    if (!book)
        return res.status(404).send("The book with the given ID was not found.");

    res.send(book);
});


module.exports = router;