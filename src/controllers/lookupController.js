const { findBookByAlias } = require('../services/bibleService');

// Parse reference strings like: "ዘጸ 30፥1" or "Genesis 30:1" and ranges like "10:1-5"
// Returns { identifier, chapterNumber, verseStart, verseEnd? } or null
function parseRef(refRaw) {
    if (!refRaw) return null;
    const ref = String(refRaw).trim();
    const parts = ref.split(/\s+/);
    if (parts.length < 2) return null;
    const book = parts.slice(0, parts.length - 1).join(' ');
    const nums = parts[parts.length - 1];

    const match = nums.match(/^(\d+)\s*[፥:]\s*(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) return null;
    const chapterNumber = parseInt(match[1], 10);
    const verseStart = parseInt(match[2], 10);
    const verseEnd = match[3] ? parseInt(match[3], 10) : undefined;
    if (!Number.isInteger(chapterNumber) || !Number.isInteger(verseStart)) return null;
    if (verseEnd !== undefined && (!Number.isInteger(verseEnd) || verseEnd < verseStart)) return null;
    return { identifier: book, chapterNumber, verseStart, verseEnd };
}

function lookupRef(req, res) {
    const { ref } = req.query;
    const parsed = parseRef(ref);
    if (!parsed) return res.status(400).json({ message: 'Invalid reference format. Use "<book> <chapter>፥<verse>" or a range like "<book> <chapter>:<start>-<end>"' });

    const { identifier, chapterNumber, verseStart, verseEnd } = parsed;
    const bibleData = req.app.locals.bibleData;
    const aliasIndex = req.app.locals.aliasIndex;
    const book = findBookByAlias(bibleData, aliasIndex, identifier);
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    const chapter = (book.chapters || []).find(c => c.chapter === chapterNumber);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found.' });

    // Collect verses
    const versesInChapter = [];
    for (const section of chapter.sections || []) {
        for (const v of section.verses || []) {
            versesInChapter.push(v);
        }
    }
    versesInChapter.sort((a, b) => a.verse - b.verse);

    if (verseEnd === undefined) {
        const found = versesInChapter.find(v => v.verse === verseStart);
        if (!found) return res.status(404).json({ message: 'Verse not found.' });
        return res.json({
            reference: ref,
            book: {
                book_number: book.book_number,
                book_name_am: book.book_name_am,
                book_name_en: book.book_name_en,
                book_short_name_am: book.book_short_name_am,
                book_short_name_en: book.book_short_name_en,
            },
            chapter: chapterNumber,
            verse: found,
        });
    } else {
        const range = versesInChapter.filter(v => v.verse >= verseStart && v.verse <= verseEnd);
        if (range.length === 0) return res.status(404).json({ message: 'Verses not found.' });
        return res.json({
            reference: ref,
            book: {
                book_number: book.book_number,
                book_name_am: book.book_name_am,
                book_name_en: book.book_name_en,
                book_short_name_am: book.book_short_name_am,
                book_short_name_en: book.book_short_name_en,
            },
            chapter: chapterNumber,
            verses: range,
        });
    }
}

module.exports = { parseRef, lookupRef };
