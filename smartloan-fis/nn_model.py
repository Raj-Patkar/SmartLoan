# smartloan-fis/nn_model.py

import joblib
import numpy as np

# Load trained model, scaler, and feature list once at startup
model   = joblib.load("model.pkl")
scaler  = joblib.load("scaler.pkl")
features = joblib.load("features.pkl")


def predict_default_probability(
    fuzzy_credit_score: float,
    debt_to_income_ratio: float,
    credit_utilization: float,
    existing_emi: float,
    monthly_income: float,
    credit_history_length: int,
    num_inquiries: int,
) -> float:
    """
    Takes raw input values, scales them using the trained scaler,
    and returns default probability (0 to 1) from the trained model.
    """
    import pandas as pd
    raw = pd.DataFrame([[
        fuzzy_credit_score,
        debt_to_income_ratio,
        credit_utilization,
        existing_emi,
        monthly_income,
        credit_history_length,
        num_inquiries,
    ]], columns=features)

    scaled = scaler.transform(raw)
    probability = model.predict_proba(scaled)[0][1]  # probability of class 1 (default)

    return round(float(probability), 4)
