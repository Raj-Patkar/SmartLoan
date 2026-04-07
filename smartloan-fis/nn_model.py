# smartloan-fis/nn_model.py

import torch
import torch.nn as nn
import joblib
import numpy as np
import pandas as pd

# ── Neural Network definition (must match the one trained in Colab) ───────────
class CreditRiskNN(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(64, 32),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.Dropout(0.2),

            nn.Linear(32, 16),
            nn.ReLU(),

            nn.Linear(16, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.network(x).squeeze(1)


# ── Load model, scaler, features once at startup ──────────────────────────────
features = joblib.load("features.pkl")
scaler   = joblib.load("scaler.pkl")

model = CreditRiskNN(input_dim=len(features))
model.load_state_dict(torch.load("model.pth", map_location="cpu"))
model.eval()


# ── Prediction function ───────────────────────────────────────────────────────
def predict_default_probability(
    fuzzy_credit_score: float,
    debt_to_income_ratio: float,
    credit_utilization: float,
    existing_emi: float,
    monthly_income: float,
    credit_history_length: int,
    num_inquiries: int,
) -> float:
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
    tensor = torch.tensor(scaled, dtype=torch.float32)

    with torch.no_grad():
        probability = model(tensor).item()

    return round(probability, 4)
