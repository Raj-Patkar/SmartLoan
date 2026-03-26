// src/controllers/assessmentController.js

const axios = require('axios');
const db = require('../config/db');

const runAssessment = async (req, res) => {
    const user_id = req.user.id;

    try {
        const { rows } = await db.query(
            'SELECT * FROM user_financial_profiles WHERE user_id = $1',
            [user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Financial profile not found. Please submit your profile first.' });
        }

        const profile = rows[0];
        const dti = (profile.existing_emi / profile.monthly_income) * 100;

        const payload = {
            payment_history: parseFloat(profile.payment_history_pct) || 80,
            credit_utilization: parseFloat(profile.credit_utilization) || 30,
            debt_to_income_ratio: parseFloat(dti.toFixed(2)),
            monthly_income: parseFloat(profile.monthly_income),
            existing_emi: parseFloat(profile.existing_emi),
            credit_history_length: profile.credit_history_length,
            num_inquiries: profile.num_inquiries || 1
        };

        const fisResponse = await axios.post(process.env.FIS_API_URL, payload);
        const result = fisResponse.data;

        await db.query(
            `INSERT INTO credit_assessments
        (user_id, fuzzy_credit_score, score_band, risk_level,
         demographic_score, financial_score, asset_score,
         default_probability, reason_codes, explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                user_id,
                result.fuzzy_credit_score,
                result.score_band,
                result.risk_level,
                result.demographic_score,
                result.financial_score,
                result.asset_score,
                result.default_probability,
                JSON.stringify(result.reason_codes),
                result.explanation
            ]
        );

        res.json({
            message: 'Credit assessment completed',
            dti: parseFloat(dti.toFixed(2)),
            assessment: result
        });

    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            return res.status(503).json({ message: 'FIS service unavailable. Make sure Python API is running.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getLatestAssessment = async (req, res) => {
    const user_id = req.user.id;

    try {
        const { rows } = await db.query(
            'SELECT * FROM credit_assessments WHERE user_id = $1 ORDER BY assessed_at DESC LIMIT 1',
            [user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No assessment found' });
        }

        res.json({ assessment: rows[0] });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { runAssessment, getLatestAssessment };
