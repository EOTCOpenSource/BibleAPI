# Ethiopian Orthodox Bible API

A simple, structured Express API serving Ethiopian Orthodox Bible data from JSON.

## Project Structure

- `server.js` — Server bootstrap (reads env, starts app).
- `src/app.js` — App factory: middlewares, routes, error handling.
- `src/routes/` — Route definitions.
- `src/controllers/` — Request handlers.
- `src/services/` — Data loading and domain logic.
- `src/middleware/` — Express middlewares (error handler, etc.).
- `data/` — Bible JSON files (e.g., `80-weahadu.json`).

## Setup

1. Ensure Node.js 18+.
2. Install deps.

```sh
npm install
```

3. Run in dev mode (auto-reload) or start normally.

```sh
npm run dev
# or
npm start
```

The API will start on `http://localhost:3000` by default.

## Endpoints

- `GET /` — Welcome message.
- `GET /health` — Health check.
- `GET /api/books` — List all books (basic metadata).
- `GET /api/books/:identifier` — Get a book by number or name (supports partial English name, e.g., `gen`).
- `GET /api/books/:identifier/chapters/:chapterNumber` — Get a chapter.
- `GET /api/books/:identifier/chapters/:chapterNumber/verses/:verseNumber` — Get a verse.

### Lookup endpoint

- `GET /api/lookup?ref=<reference>` — Free-text reference lookup for a single verse or a range.
	- Format: `<book> <chapter>:<verse>` or `<book> <chapter>:<start>-<end>`
	- The separator can be `:` or the Ethiopic colon `፥`.

Examples:

```sh
# English
curl -s "http://localhost:3000/api/lookup?ref=Genesis%201:3"
curl -s "http://localhost:3000/api/lookup?ref=Leviticus%2010:1-5"

# Amharic (use URL encoding when needed)
curl -s "http://localhost:3000/api/lookup?ref=%E1%8B%98%E1%8C%B8%2010%3A1"   # ዘጸ 10:1
curl -s "http://localhost:3000/api/lookup?ref=%E1%8B%98%E1%8C%B8%2010%3A1-5" # ዘጸ 10:1-5
```

Response (single verse):

```json
{
	"reference": "Genesis 1:3",
	"book": {
		"book_number": 1,
		"book_name_am": "ኦሪት ዘፍጥረት",
		"book_name_en": "Genesis",
		"book_short_name_am": "ዘፍ",
		"book_short_name_en": "Gen"
	},
	"chapter": 1,
	"verse": { "verse": 3, "text": "..." }
}
```

Response (range):

```json
{
	"reference": "Leviticus 10:1-5",
	"book": { "book_number": 3, "book_name_am": "...", "book_name_en": "Leviticus", "book_short_name_am": "...", "book_short_name_en": "Lev" },
	"chapter": 10,
	"verses": [ { "verse": 1, "text": "..." }, { "verse": 2, "text": "..." } ]
}
```

