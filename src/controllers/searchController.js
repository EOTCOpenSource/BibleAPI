// src/controllers/searchController.js
const { searchVerses } = require('../services/searchService');

function searchBible(req, res) {
    const { param } = req.query;

    if (!param || param.trim() === '') {
        return res.status(400).json({ message: 'Search parameter "param" is required' });
    }

    const results = searchVerses(req.app.locals.bibleData, param);

    if (results.length === 0) {
        return res.status(404).json({ message: 'No matching verses found' });
    }

    res.json({ results });
}

module.exports = { searchBible };
