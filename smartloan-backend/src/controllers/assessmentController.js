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
        const dti =
            profile.monthly_income > 0
                ? (profile.existing_emi / profile.monthly_income) * 100
                : 0;

        const payload = {
            payment_history: Number(profile.payment_history_pct ?? 80),
            credit_utilization: Number(profile.credit_utilization ?? 30),
            debt_to_income_ratio: Number(dti.toFixed(2)),
            monthly_income: Number(profile.monthly_income ?? 0),
            existing_emi: Number(profile.existing_emi ?? 0),
            credit_history_length: Number(profile.credit_history_length ?? 1),
            num_inquiries: Number(profile.num_inquiries ?? 1)
        };
        console.log("FINAL PAYLOAD:", payload);
        const fisResponse = await axios.post(process.env.FIS_API_URL, payload);
        const result = fisResponse.data;

        console.log("RESULT FROM FASTAPI:", result);

        if (
            !result ||
            result.fuzzy_credit_score === undefined ||
            result.default_probability === undefined ||
            isNaN(result.default_probability)
        ) {
            throw new Error("Invalid response from FastAPI");
        }
        await db.query(
            `INSERT INTO credit_assessments
        (user_id, fuzzy_credit_score, score_band, risk_level,
         demographic_score, financial_score, asset_score,
         default_probability, reason_codes, explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                user_id,
                result.fuzzy_credit_score ?? 0,
                result.score_band ?? "Unknown",
                result.risk_level ?? "Unknown",
                result.demographic_score ?? 0,
                result.financial_score ?? 0,
                result.asset_score ?? 0,
                Number(result.default_probability) || 0,
                JSON.stringify(result.reason_codes ?? []),
                result.explanation ?? ""
            ]
        );

        res.json({
            message: 'Credit assessment completed',
            dti: parseFloat(dti.toFixed(2)),
            assessment: result
        });

    } catch (err) {
        console.error("FULL ERROR FROM FASTAPI:", err.response?.data || err.message);

        if (err.code === 'ECONNREFUSED') {
            return res.status(503).json({
                message: 'FIS service unavailable. Make sure Python API is running.'
            });
        }

        res.status(500).json({
            message: 'Server error',
            error: err.response?.data || err.message
        });
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
