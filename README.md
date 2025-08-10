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

## Notes

- Data path is resolved from `src/app.js` as `../data/80-weahadu.json`, fixing prior ENOENT path issues.
- To change the dataset, update `src/app.js` to point to a different file or make it configurable by env.
