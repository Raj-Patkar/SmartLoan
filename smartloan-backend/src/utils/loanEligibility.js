const RISK_BLOCKED = ['Very High'];

const checkEligibility = (profile, assessment, loanProducts) => {
    const dti = (profile.existing_emi / profile.monthly_income) * 100;

    const eligible = [];
    const ineligible = [];

    for (const product of loanProducts) {
        const reasons = [];

        if (assessment.fuzzy_credit_score < product.min_credit_score) {
            reasons.push(`Credit score ${assessment.fuzzy_credit_score} is below required ${product.min_credit_score}`);
        }

        if (dti > product.max_dti) {
            reasons.push(`DTI ${dti.toFixed(2)}% exceeds maximum ${product.max_dti}%`);
        }

        if (profile.monthly_income < product.min_income) {
            reasons.push(`Monthly income ₹${profile.monthly_income} is below required ₹${product.min_income}`);
        }

        if (RISK_BLOCKED.includes(assessment.risk_level)) {
            reasons.push(`Risk level "${assessment.risk_level}" is not eligible`);
        }

        if (reasons.length === 0) {
            const predicted_approval_amount = Math.min(
                parseFloat(profile.loan_amount_requested),
                parseFloat(product.max_loan_amount)
            );

            eligible.push({
                product_id: product.id,
                product_name: product.name,
                interest_rate: product.interest_rate,
                tenure_months: product.tenure_months,
                max_loan_amount: product.max_loan_amount,
                predicted_approval_amount
            });
        } else {
            ineligible.push({
                product_id: product.id,
                product_name: product.name,
                reasons
            });
        }
    }

    return { dti: parseFloat(dti.toFixed(2)), eligible, ineligible };
};

module.exports = { checkEligibility };