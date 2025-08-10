const Fuse = require("fuse.js");

let fuse; // We'll initialize this once

function prepareBibleData(bibleData) {
  // Flatten bibleData into array of verses
  const verses = [];

  bibleData.forEach((book) => {
    book.chapters.forEach((chapter, chapterIndex) => {
      chapter.sections.forEach((section, sectionIndex) => {
        section.verses.forEach((verse, verseIndex) => {
          verses.push({
            book: book.book_name_en,
            chapter: chapterIndex + 1,
            section: sectionIndex + 1,
            verse: verseIndex + 1,
            text: verse.text,
          });
        });
      });
    });
  });

  // Configure Fuse.js
  const options = {
    keys: ["text"],
    threshold: 0.3, // Lower = more exact matches
    ignoreLocation: true,
  };

  fuse = new Fuse(verses, options);
}

// Search function
function searchBible(query) {
  if (!fuse) throw new Error("Search not initialized");
  return fuse.search(query).map((result) => result.item);
}

module.exports = {
  prepareBibleData,
  searchBible,
};
