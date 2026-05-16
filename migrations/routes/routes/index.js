const express = require("express");
const router = express.Router();
const db = require("../db");
const Repository = require("../repositories");

const repository = new Repository(db);

router.get('/movies', async (req, res) => {
    try {
        const filters = Object.keys(req.query).length ? req.query : undefined;
        return res.json(await repository.getAllMovies(filters));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/series', async (req, res) => {
    try {
        const filters = Object.keys(req.query).length ? req.query : undefined;
        return res.json(await repository.getAllSeries(filters));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/directors', async (req, res) => {
    try { return res.json(await repository.getAllDirectors()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/genres', async (req, res) => {
    try { return res.json(await repository.getAllGenres()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/age-ratings', async (req, res) => {
    try { return res.json(await repository.getAllAgeRatings()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;