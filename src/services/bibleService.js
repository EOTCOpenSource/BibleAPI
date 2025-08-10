const fs = require('fs');

// Normalize Amharic/Geez spelling variants for matching, e.g., ጸ vs ፀ.
function normalizeAmharicName(s) {
    if (!s) return '';
    const str = String(s);
    // Canonicalize tsade to ፀ
    return str
        .replace(/ጸ/g, 'ፀ')
        .replace(/[፡።\.:,]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

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
    const amNorm = normalizeAmharicName(idStr);

    // by number
    const byNumber = bibleData.find(b => String(b.book_number) === idStr);
    if (byNumber) return byNumber;

    // exact name match
    const byExactName = bibleData.find(b => {
        const nameAm = normalizeAmharicName(b.book_name_am);
        const shortAm = normalizeAmharicName(b.book_short_name_am);
        return (
            (b.book_name_en && b.book_name_en.toLowerCase() === lower) ||
            (b.book_short_name_en && b.book_short_name_en.toLowerCase() === lower) ||
            (nameAm && nameAm === amNorm) ||
            (shortAm && shortAm === amNorm)
        );
    });
    if (byExactName) return byExactName;

    // partial english name or partial Amharic startsWith/includes
    const byPartial = bibleData.find(b => {
        const nameAm = normalizeAmharicName(b.book_name_am);
        const shortAm = normalizeAmharicName(b.book_short_name_am);
        return (
            (b.book_name_en && b.book_name_en.toLowerCase().startsWith(lower)) ||
            (nameAm && (nameAm.startsWith(amNorm) || nameAm.includes(amNorm))) ||
            (shortAm && (shortAm.startsWith(amNorm) || amNorm.startsWith(shortAm)))
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

module.exports = { loadBibleData, findBook, filterBooksByTestament, normalizeAmharicName };
