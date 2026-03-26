// src/controllers/profileController.js

const db = require('../config/db');

const upsertProfile = async (req, res) => {
    const user_id = req.user.id;

    const {
        age, monthly_income, existing_emi, loan_amount_requested,
        employment_type, credit_history_length, num_existing_loans,
        total_assets, payment_history_pct, credit_utilization, num_inquiries
    } = req.body;

    try {
        const { rows: existing } = await db.query(
            'SELECT id FROM user_financial_profiles WHERE user_id = $1',
            [user_id]
        );

        if (existing.length > 0) {
            await db.query(
                `UPDATE user_financial_profiles SET
                    age = $1, monthly_income = $2, existing_emi = $3,
                    loan_amount_requested = $4, employment_type = $5,
                    credit_history_length = $6, num_existing_loans = $7,
                    total_assets = $8, payment_history_pct = $9,
                    credit_utilization = $10, num_inquiries = $11
                WHERE user_id = $12`,
                [age, monthly_income, existing_emi, loan_amount_requested,
                    employment_type, credit_history_length, num_existing_loans,
                    total_assets, payment_history_pct, credit_utilization,
                    num_inquiries, user_id]
            );
            return res.json({ message: 'Financial profile updated successfully' });
        }

        await db.query(
            `INSERT INTO user_financial_profiles
                (user_id, age, monthly_income, existing_emi, loan_amount_requested,
                 employment_type, credit_history_length, num_existing_loans,
                 total_assets, payment_history_pct, credit_utilization, num_inquiries)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [user_id, age, monthly_income, existing_emi, loan_amount_requested,
                employment_type, credit_history_length, num_existing_loans,
                total_assets, payment_history_pct || 80, credit_utilization || 30,
                num_inquiries || 1]
        );

        res.status(201).json({ message: 'Financial profile created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getProfile = async (req, res) => {
    const user_id = req.user.id;

    try {
        const { rows } = await db.query(
            'SELECT * FROM user_financial_profiles WHERE user_id = $1',
            [user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No financial profile found' });
        }

        res.json({ profile: rows[0] });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { upsertProfile, getProfile };
