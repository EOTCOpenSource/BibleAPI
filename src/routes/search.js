const express = require('express');
const { searchBible } = require('../services/searchService');

const router = express.Router();

router.get('/', (req, res) => {
  const { param } = req.query;

  if (!param) {
    return res.status(400).json({ message: 'Query parameter "param" is required' });
  }

  const results = searchBible(param);
  res.json(results);
});

module.exports = router;
