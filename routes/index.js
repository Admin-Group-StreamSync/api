const express = require("express");
const router = express.Router();
const Repository = require("../repositories");
const { getDb } = require("../db");

// Middleware: extrae :version y adjunta la conexión correcta al request
router.param('version', (req, res, next, version) => {
    const v = parseInt(version, 10);
    if (![1, 2, 3].includes(v)) {
        return res.status(400).json({ error: `Versión '${version}' no válida. Usa 1, 2 o 3.` });
    }
    req.db = getDb(v);
    req.repository = new Repository(req.db);
    next();
});

// ── Rutas ────────────────────────────────────────────────────────────────────

router.get('/api/:version/directors', async (req, res) => {
    return res.json(await req.repository.getAllDirectors());
});

router.get('/api/:version/genres', async (req, res) => {
    return res.json(await req.repository.getAllGenres());
});

router.get('/api/:version/age-ratings', async (req, res) => {
    return res.json(await req.repository.getAllAgeRatings());
});

router.get('/api/:version/movies', async (req, res) => {
    if (Object.keys(req.query).length === 0) {
        return res.json(await req.repository.getAllMovies());
    }
    const filters = {
        genre:      req.query.genre,
        director:   req.query.director,
        age_rating: req.query.age_rating,
        id:         req.query.id,
        title:      req.query.title,
        synopsis:   req.query.synopsis,
    };
    return res.json(await req.repository.getAllMovies(filters));
});

router.get('/api/:version/series', async (req, res) => {
    if (Object.keys(req.query).length === 0) {
        return res.json(await req.repository.getAllSeries());
    }
    const filters = {
        genre:      req.query.genre,
        director:   req.query.director,
        age_rating: req.query.age_rating,
        id:         req.query.id,
        title:      req.query.title,
        synopsis:   req.query.synopsis,
    };
    return res.json(await req.repository.getAllSeries(filters));
});

module.exports = router;
