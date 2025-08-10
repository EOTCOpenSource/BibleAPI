const express = require('express');
const path = require('path');
const { loadBibleData } = require('./services/bibleService');
// const fs = require('fs');
const booksRouter = require('./routes/books');
const lookupRouter = require('./routes/lookup');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./docs/openapi');

function createApp() {
    const app = express();

    // Middlewares
    app.use(express.json());

    // Load data once and attach to app.locals
    const dataFilePath = path.join(__dirname, '..', 'data', '80-weahadu.json');
    const bibleData = loadBibleData(dataFilePath);
    app.locals.bibleData = bibleData;

    // Health
    app.get('/health', (req, res) => res.json({ status: 'ok' }));

    // Routes
    app.use('/api/books', booksRouter);
    app.use('/api/lookup', lookupRouter);

    // OpenAPI JSON
    app.get('/openapi.json', (req, res) => res.json(openapiSpec));

    // Swagger UI
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

    // Root
    app.get('/', (req, res) => {
        res.send('Welcome to the Ethiopian Orthodox Bible API!');
    });

    // 404
    app.use((req, res) => {
        res.status(404).json({ message: 'Not Found' });
    });

    // Error handler
    app.use(errorHandler);

    return app;
}

module.exports = { createApp };
