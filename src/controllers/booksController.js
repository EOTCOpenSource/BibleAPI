const { findBook, filterBooksByTestament, findBookByAlias } = require('../services/bibleService');

function listBooks(req, res) {
    const bibleData = req.app.locals.bibleData;
    const books = bibleData.map(book => ({
        book_number: book.book_number,
        book_name_am: book.book_name_am,
        book_short_name_am: book.book_short_name_am,
        book_name_en: book.book_name_en,
        book_short_name_en: book.book_short_name_en,
        testament: book.testament,
    }));
    res.json(books);
}

function listBooksByTestament(req, res) {
    const bibleData = req.app.locals.bibleData;
    const { testament } = req.params; // 'old' | 'new'
    const filtered = filterBooksByTestament(bibleData, testament).map(book => ({
        book_number: book.book_number,
        book_name_am: book.book_name_am,
        book_short_name_am: book.book_short_name_am,
        book_name_en: book.book_name_en,
        book_short_name_en: book.book_short_name_en,
        testament: book.testament,
    }));
    res.json(filtered);
}

function getBook(req, res) {
    const bibleData = req.app.locals.bibleData;
    const aliasIndex = req.app.locals.aliasIndex;
    const id = req.params.identifier;
    const book = findBookByAlias(bibleData, aliasIndex, id) || findBook(bibleData, id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    res.json(book);
}

function getChapter(req, res) {
    const bibleData = req.app.locals.bibleData;
    const aliasIndex = req.app.locals.aliasIndex;
    const id = req.params.identifier;
    const book = findBookByAlias(bibleData, aliasIndex, id) || findBook(bibleData, id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    const chapterNumber = parseInt(req.params.chapterNumber, 10);
    const chapter = (book.chapters || []).find(c => c.chapter === chapterNumber);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found.' });
    res.json(chapter);
}

function getVerse(req, res) {
    const bibleData = req.app.locals.bibleData;
    const aliasIndex = req.app.locals.aliasIndex;
    const id = req.params.identifier;
    const book = findBookByAlias(bibleData, aliasIndex, id) || findBook(bibleData, id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    const chapterNumber = parseInt(req.params.chapterNumber, 10);
    const verseNumber = parseInt(req.params.verseNumber, 10);
    const chapter = (book.chapters || []).find(c => c.chapter === chapterNumber);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found.' });

    let found = null;
    for (const section of chapter.sections || []) {
        const verse = (section.verses || []).find(v => v.verse === verseNumber);
        if (verse) { found = verse; break; }
    }
    if (!found) return res.status(404).json({ message: 'Verse not found.' });
    res.json(found);
}

module.exports = { listBooks, listBooksByTestament, getBook, getChapter, getVerse };
