const express = require('express');
const { listBooks, listBooksByTestament, getBook, getChapter, getVerse } = require('../controllers/booksController');

const router = express.Router();

router.get('/', listBooks);
router.get('/old', (req, res) => { req.params.testament = 'old'; return listBooksByTestament(req, res); });
router.get('/new', (req, res) => { req.params.testament = 'new'; return listBooksByTestament(req, res); });
router.get('/:identifier', getBook);
router.get('/:identifier/chapters/:chapterNumber', getChapter);
router.get('/:identifier/chapters/:chapterNumber/verses/:verseNumber', getVerse);

module.exports = router;
