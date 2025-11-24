const express = require('express');
const router = express.Router();
const { generateCode, getHistory } = require('../controllers/codeController');

// Route: Generate Code
router.post('/generate', generateCode);

// Route: Get History
router.get('/history', getHistory);

module.exports = router;