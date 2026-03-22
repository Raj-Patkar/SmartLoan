// src/routes/loanRoutes.js

const express = require('express');
const router = express.Router();
const { getLoanRecommendations } = require('../controllers/loanController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/recommendations', authenticate, getLoanRecommendations);

module.exports = router;
