const fs = require('fs');
const userAliases = require('../data/bookAliases');

function loadBibleData(filePath) {
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format: expected an array of books');
        }
        return data;
    } catch (err) {
        const wrapped = new Error(`Failed to load Bible data from ${filePath}: ${err.message}`);
        wrapped.cause = err;
        throw wrapped;
    }
}

// Build alias index: maps normalized alias -> book_number
function buildAliasIndex(bibleData) {
    const index = new Map();
    const addAlias = (alias, bookNumber) => {
        if (!alias) return;
        const key = String(alias).toLowerCase().trim();
        index.set(key, bookNumber);
    };
    for (const b of bibleData) {
        const num = String(b.book_number);
        addAlias(b.book_name_en, num);
        addAlias(b.book_short_name_en, num);
        addAlias(b.book_name_am, num);
        addAlias(b.book_short_name_am, num);
        // Add user-provided aliases
        const extras = userAliases[num] || [];
        for (const alias of extras) addAlias(alias, num);
    }
    return index;
}

function findBookByAlias(bibleData, aliasIndex, identifier) {
    if (!identifier) return null;
    const idStr = String(identifier);
    const lower = idStr.toLowerCase().trim();

    // Direct number
    const byNumber = bibleData.find(b => String(b.book_number) === idStr);
    if (byNumber) return byNumber;

    // Alias hit
    const bookNum = aliasIndex.get(lower);
    if (bookNum) return bibleData.find(b => String(b.book_number) === String(bookNum));

    // Partial search fallback (English and Amharic)
    const match = bibleData.find(b => {
        const nameAm = b.book_name_am || '';
        const shortAm = b.book_short_name_am || '';
        return (
            (b.book_name_en && b.book_name_en.toLowerCase().startsWith(lower)) ||
            (b.book_short_name_en && b.book_short_name_en.toLowerCase().startsWith(lower)) ||
            (nameAm && (nameAm.startsWith(idStr) || nameAm.includes(idStr))) ||
            (shortAm && (shortAm.startsWith(idStr) || idStr.startsWith(shortAm)))
        );
    });
    return match || null;
}

function findBook(bibleData, identifier) {
    if (!identifier) return null;
    const idStr = String(identifier);
    const lower = idStr.toLowerCase();

    // by number
    const byNumber = bibleData.find(b => String(b.book_number) === idStr);
    if (byNumber) return byNumber;

    // exact name match
    const byExactName = bibleData.find(b => {
        const nameAm = b.book_name_am || '';
        const shortAm = b.book_short_name_am || '';
        return (
            (b.book_name_en && b.book_name_en.toLowerCase() === lower) ||
            (b.book_short_name_en && b.book_short_name_en.toLowerCase() === lower) ||
            (nameAm && nameAm === idStr) ||
            (shortAm && shortAm === idStr)
        );
    });
    if (byExactName) return byExactName;

    // partial english name or partial Amharic startsWith/includes
    const byPartial = bibleData.find(b => {
        const nameAm = b.book_name_am || '';
        const shortAm = b.book_short_name_am || '';
        return (
            (b.book_name_en && b.book_name_en.toLowerCase().startsWith(lower)) ||
            (nameAm && (nameAm.startsWith(idStr) || nameAm.includes(idStr))) ||
            (shortAm && (shortAm.startsWith(idStr) || idStr.startsWith(shortAm)))
        );
    });
    if (byPartial) return byPartial;

    return null;
}

function filterBooksByTestament(bibleData, testament) {
    if (!testament) return [];
    const t = String(testament).toLowerCase();
    return bibleData.filter(b => (b.testament || '').toLowerCase() === t);
}

module.exports = { loadBibleData, findBook, filterBooksByTestament, buildAliasIndex, findBookByAlias };
