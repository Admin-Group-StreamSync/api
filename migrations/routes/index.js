const express = require("express");
const router = express.Router();
const db = require("../db");
const Repository = require("../repositories");

// Cada servei de Render és una instància independent amb el seu propi schema.
// No cal lògica multi-versió: simplement usem el db d'aquesta instància.

const repository = new Repository(db);

router.get('/movies', async (req, res) => {
    try {
        if (Object.keys(req.query).length === 0) {
            return res.json(await repository.getAllMovies());
        }
        const filters = {
            genre:      req.query.genre,
            director:   req.query.director,
            age_rating: req.query.age_rating,
            id:         req.query.id,
            title:      req.query.title,
            synopsis:   req.query.synopsis,
        };
        return res.json(await repository.getAllMovies(filters));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error intern' });
    }
});

router.get('/series', async (req, res) => {
    try {
        if (Object.keys(req.query).length === 0) {
            return res.json(await repository.getAllSeries());
        }
        const filters = {
            genre:      req.query.genre,
            director:   req.query.director,
            age_rating: req.query.age_rating,
            id:         req.query.id,
            title:      req.query.title,
            synopsis:   req.query.synopsis,
        };
        return res.json(await repository.getAllSeries(filters));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error intern' });
    }
});

router.get('/directors', async (req, res) => {
    try {
        return res.json(await repository.getAllDirectors());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error intern' });
    }
});

router.get('/genres', async (req, res) => {
    try {
        return res.json(await repository.getAllGenres());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error intern' });
    }
});

router.get('/age-ratings', async (req, res) => {
    try {
        return res.json(await repository.getAllAgeRatings());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error intern' });
    }
});

module.exports = router;
