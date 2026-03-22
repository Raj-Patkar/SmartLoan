// src/controllers/loanController.js

const db = require('../config/db');
const { checkEligibility } = require('../utils/loanEligibility');

const getLoanRecommendations = async (req, res) => {
    const user_id = req.user.id;

    try {
        // Fetch latest assessment
        const [assessments] = await db.query(
            'SELECT * FROM credit_assessments WHERE user_id = ? ORDER BY assessed_at DESC LIMIT 1',
            [user_id]
        );

        if (assessments.length === 0) {
            return res.status(404).json({ message: 'No credit assessment found. Please run an assessment first.' });
        }

        // Fetch financial profile
        const [profiles] = await db.query(
            'SELECT * FROM user_financial_profiles WHERE user_id = ?',
            [user_id]
        );

        if (profiles.length === 0) {
            return res.status(404).json({ message: 'Financial profile not found.' });
        }

        // Fetch all loan products
        const [loanProducts] = await db.query('SELECT * FROM loan_products');

        // Run eligibility check
        const result = checkEligibility(profiles[0], assessments[0], loanProducts);

        res.json({
            credit_score: assessments[0].fuzzy_credit_score,
            score_band: assessments[0].score_band,
            risk_level: assessments[0].risk_level,
            dti: result.dti,
            eligible_products: result.eligible,
            ineligible_products: result.ineligible
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getLoanRecommendations };
