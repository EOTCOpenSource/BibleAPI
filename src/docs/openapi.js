// OpenAPI specification for the Ethiopian Orthodox Bible API
// This describes the public endpoints and basic response shapes.

module.exports = {
    openapi: '3.0.3',
    info: {
        title: 'Ethiopian Orthodox Bible API',
        version: '1.0.0',
        description: 'REST API to explore the Ethiopian Orthodox Bible data.',
    },
    servers: [
        { url: 'http://localhost:3000', description: 'Local' },
    ],
    tags: [
        { name: 'Health', description: 'Service health' },
        { name: 'Books', description: 'Bible books, chapters, and verses' },
    ],
    paths: {
        '/health': {
            get: {
                tags: ['Health'],
                summary: 'Health check',
                responses: {
                    200: {
                        description: 'Service is healthy',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { status: { type: 'string', example: 'ok' } },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/books': {
            get: {
                tags: ['Books'],
                summary: 'List all books',
                responses: {
                    200: {
                        description: 'Array of book summaries',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/BookSummary' } },
                            },
                        },
                    },
                },
            },
        },
        '/api/books/old': {
            get: {
                tags: ['Books'],
                summary: 'List Old Testament books',
                responses: {
                    200: {
                        description: 'Array of book summaries',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/BookSummary' } },
                            },
                        },
                    },
                },
            },
        },
        '/api/books/new': {
            get: {
                tags: ['Books'],
                summary: 'List New Testament books',
                responses: {
                    200: {
                        description: 'Array of book summaries',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/BookSummary' } },
                            },
                        },
                    },
                },
            },
        },
        '/api/books/{identifier}': {
            get: {
                tags: ['Books'],
                summary: 'Get a single book by number or name',
                parameters: [
                    { $ref: '#/components/parameters/Identifier' },
                ],
                responses: {
                    200: {
                        description: 'Book object',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } },
                    },
                    404: { description: 'Book not found' },
                },
            },
        },
        '/api/books/{identifier}/chapters/{chapterNumber}': {
            get: {
                tags: ['Books'],
                summary: 'Get a chapter by book identifier and chapter number',
                parameters: [
                    { $ref: '#/components/parameters/Identifier' },
                    { name: 'chapterNumber', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } },
                ],
                responses: {
                    200: {
                        description: 'Chapter object',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Chapter' } } },
                    },
                    404: { description: 'Book or chapter not found' },
                },
            },
        },
        '/api/books/{identifier}/chapters/{chapterNumber}/verses/{verseNumber}': {
            get: {
                tags: ['Books'],
                summary: 'Get a verse by book identifier, chapter, and verse number',
                parameters: [
                    { $ref: '#/components/parameters/Identifier' },
                    { name: 'chapterNumber', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } },
                    { name: 'verseNumber', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } },
                ],
                responses: {
                    200: {
                        description: 'Verse object',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Verse' } } },
                    },
                    404: { description: 'Book, chapter, or verse not found' },
                },
            },
        },
        '/api/lookup': {
            get: {
                tags: ['Books'],
                summary: 'Lookup a verse or a range by a human-readable reference string',
                description: 'Accepts a ref like "Genesis 30:1" or "ዘጸ 30፥1" (Geez colon ፥ or :) and ranges like "Leviticus 10:1-5" or "ዘሌዋውያን 10፥1-5".',
                parameters: [
                    {
                        name: 'ref',
                        in: 'query',
                        required: true,
                        schema: { type: 'string' },
                        examples: {
                            english: { summary: 'English', value: 'Exodus 30:1' },
                            amharicShort: { summary: 'Amharic short', value: 'ዘጸ 30፥1' },
                            amharicAlt: { summary: 'Amharic alt', value: 'ዘፀ 30፥1' },
                            amharicFull: { summary: 'Amharic full', value: 'ዘጸአት 30፥1' },
                            rangeEn: { summary: 'English range', value: 'Leviticus 10:1-5' },
                            rangeAm: { summary: 'Amharic range', value: 'ዘሌዋውያን 10፥1-5' },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Matched verse or range with metadata',
                        content: {
                            'application/json': {
                                oneOf: [
                                    {
                                        type: 'object',
                                        properties: {
                                            reference: { type: 'string' },
                                            book: { $ref: '#/components/schemas/BookSummary' },
                                            chapter: { type: 'integer' },
                                            verse: { $ref: '#/components/schemas/Verse' },
                                        },
                                    },
                                    {
                                        type: 'object',
                                        properties: {
                                            reference: { type: 'string' },
                                            book: { $ref: '#/components/schemas/BookSummary' },
                                            chapter: { type: 'integer' },
                                            verses: { type: 'array', items: { $ref: '#/components/schemas/Verse' } },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    400: { description: 'Invalid reference format' },
                    404: { description: 'Book, chapter, or verse not found' },
                },
            },
        },
    },
    components: {
        parameters: {
            Identifier: {
                name: 'identifier',
                in: 'path',
                required: true,
                description: 'Book number or name. Supports English and Amharic (Unicode). You may provide raw Amharic (Swagger UI will URL-encode) or a URL-encoded string.',
                schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
                examples: {
                    byNumber: { summary: 'By number', value: 1 },
                    byEnglish: { summary: 'By English name', value: 'Genesis' },
                    byAmharic: { summary: 'By Amharic short name (unencoded)', value: 'መዝ.' },
                    byAmharicEncoded: { summary: 'By Amharic (URL-encoded)', value: '%E1%8B%98%E1%8D%8D' },
                },
            },
        },
        schemas: {
            BookSummary: {
                type: 'object',
                properties: {
                    book_number: { type: 'integer', example: 1 },
                    book_name_am: { type: 'string', example: 'መዝሙረ ዳዊት' },
                    book_short_name_am: { type: 'string', example: 'መዝ.' },
                    book_name_en: { type: 'string', example: 'Genesis' },
                    book_short_name_en: { type: 'string', example: 'Gen' },
                    testament: { type: 'string', enum: ['old', 'new'] },
                },
                additionalProperties: true,
            },
            Book: {
                allOf: [
                    { $ref: '#/components/schemas/BookSummary' },
                    {
                        type: 'object',
                        properties: {
                            chapters: { type: 'array', items: { $ref: '#/components/schemas/Chapter' } },
                        },
                        additionalProperties: true,
                    },
                ],
            },
            Chapter: {
                type: 'object',
                properties: {
                    chapter: { type: 'integer', example: 1 },
                    sections: { type: 'array', items: { $ref: '#/components/schemas/Section' } },
                },
                additionalProperties: true,
            },
            Section: {
                type: 'object',
                properties: {
                    verses: { type: 'array', items: { $ref: '#/components/schemas/Verse' } },
                },
                additionalProperties: true,
            },
            Verse: {
                type: 'object',
                properties: {
                    verse: { type: 'integer', example: 1 },
                    text: { type: 'string', example: 'In the beginning God created the heaven and the earth.' },
                },
                additionalProperties: true,
            },
        },
    },
};
