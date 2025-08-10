const express = require('express');
const { lookupRef } = require('../controllers/lookupController');

const router = express.Router();

// GET /api/lookup?ref=ዘጸ 30፥1
router.get('/', lookupRef);

module.exports = router;
