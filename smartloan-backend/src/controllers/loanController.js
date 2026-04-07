// src/controllers/loanController.js

const db = require('../config/db');
const { checkEligibility } = require('../utils/loanEligibility');

const getLoanRecommendations = async (req, res) => {
    const user_id = req.user.id;

    try {
        const { rows: assessments } = await db.query(
            'SELECT * FROM credit_assessments WHERE user_id = $1 ORDER BY assessed_at DESC LIMIT 1',
            [user_id]
        );

        if (assessments.length === 0) {
            return res.status(404).json({ message: 'No credit assessment found. Please run an assessment first.' });
        }

        const { rows: profiles } = await db.query(
            'SELECT * FROM user_financial_profiles WHERE user_id = $1',
            [user_id]
        );

        if (profiles.length === 0) {
            return res.status(404).json({ message: 'Financial profile not found.' });
        }

        const { rows: loanProducts } = await db.query('SELECT * FROM loan_products');
        const result = checkEligibility(profiles[0], assessments[0], loanProducts);
        const eligibleProducts = result.eligible.map((item) => {
            const full = loanProducts.find(p => p.id === item.product_id);

            return full
                ? { ...full }
                : item;
        });

        res.json({
            credit_score: assessments[0].fuzzy_credit_score,
            score_band: assessments[0].score_band,
            risk_level: assessments[0].risk_level,
            dti: result.dti,
            eligible_products: eligibleProducts,
            ineligible_products: result.ineligible
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getAllLoans = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM loan_products");

    res.json({
      loans: result.rows
    });
  } catch (err) {
    console.error("Error fetching loans:", err);
    res.status(500).json({ message: "Failed to fetch loans" });
  }
};



const applyForLoan = async (req, res) => {
    const user_id = req.user.id;
    const { loan_product_id, amount_requested } = req.body;

    try {
        const { rows: assessments } = await db.query(
            'SELECT * FROM credit_assessments WHERE user_id = $1 ORDER BY assessed_at DESC LIMIT 1',
            [user_id]
        );

        if (assessments.length === 0) {
            return res.status(400).json({ message: 'Please run a credit assessment before applying.' });
        }

        const { rows: profiles } = await db.query(
            'SELECT * FROM user_financial_profiles WHERE user_id = $1',
            [user_id]
        );

        if (profiles.length === 0) {
            return res.status(400).json({ message: 'Financial profile not found.' });
        }

        const { rows: products } = await db.query(
            'SELECT * FROM loan_products WHERE id = $1',
            [loan_product_id]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Loan product not found.' });
        }

        const result = checkEligibility(profiles[0], assessments[0], products);

        if (result.eligible.length === 0) {
            return res.status(400).json({
                message: 'You are not eligible for this loan product.',
                reasons: result.ineligible[0]?.reasons || []
            });
        }

        const predicted_approval_amount = result.eligible[0].predicted_approval_amount;

        const { rows: existing } = await db.query(
            `SELECT id FROM loan_applications WHERE user_id = $1 AND loan_product_id = $2 AND status = 'pending'`,
            [user_id, loan_product_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'You already have a pending application for this product.' });
        }

        await db.query(
            `INSERT INTO loan_applications 
                (user_id, loan_product_id, amount_requested, predicted_approval_amount, status)
             VALUES ($1, $2, $3, $4, 'pending')`,
            [user_id, loan_product_id, amount_requested, predicted_approval_amount]
        );

        res.status(201).json({
            message: 'Loan application submitted successfully',
            predicted_approval_amount,
            status: 'pending'
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getMyApplications = async (req, res) => {
    const user_id = req.user.id;

    try {
        const { rows } = await db.query(
            `SELECT la.*, lp.name as product_name, lp.interest_rate, lp.tenure_months
             FROM loan_applications la
             JOIN loan_products lp ON la.loan_product_id = lp.id
             WHERE la.user_id = $1
             ORDER BY la.applied_at DESC`,
            [user_id]
        );

        res.json({ applications: rows });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getLoanRecommendations, applyForLoan, getMyApplications ,getAllLoans};
