// src/routes/assessmentRoutes.js

const express = require('express');
const router = express.Router();
const { runAssessment, getLatestAssessment } = require('../controllers/assessmentController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/run', authenticate, runAssessment);
router.get('/latest', authenticate, getLatestAssessment);

module.exports = router;
