const fs = require('fs');

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

function findBook(bibleData, identifier) {
    if (!identifier) return null;
    const idStr = String(identifier);
    const lower = idStr.toLowerCase();

    // by number
    const byNumber = bibleData.find(b => String(b.book_number) === idStr);
    if (byNumber) return byNumber;

    // exact name match
    const byExactName = bibleData.find(b =>
        (b.book_name_en && b.book_name_en.toLowerCase() === lower) ||
        (b.book_short_name_en && b.book_short_name_en.toLowerCase() === lower) ||
        (b.book_name_am && b.book_name_am === idStr) ||
        (b.book_short_name_am && b.book_short_name_am === idStr)
    );
    if (byExactName) return byExactName;

    // partial english name
    const byPartial = bibleData.find(b =>
        b.book_name_en && b.book_name_en.toLowerCase().startsWith(lower)
    );
    if (byPartial) return byPartial;

    return null;
}

function filterBooksByTestament(bibleData, testament) {
    if (!testament) return [];
    const t = String(testament).toLowerCase();
    return bibleData.filter(b => (b.testament || '').toLowerCase() === t);
}

module.exports = { loadBibleData, findBook, filterBooksByTestament };
