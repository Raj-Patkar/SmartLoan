// src/routes/loanRoutes.js

const express = require('express');
const router = express.Router();
const { getAllLoans,getLoanRecommendations, applyForLoan, getMyApplications } = require('../controllers/loanController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/recommendations', authenticate, getLoanRecommendations);
router.post('/apply', authenticate, applyForLoan);
router.get('/my-applications', authenticate, getMyApplications);
router.get("/", getAllLoans);
module.exports = router;
