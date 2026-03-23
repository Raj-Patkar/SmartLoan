# smartloan-fis/train_model.py

import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib

print("Loading dataset...")
df = pd.read_csv("cs-training.csv")

# Drop unnamed index column if present
df = df.drop(columns=[col for col in df.columns if 'Unnamed' in col], errors='ignore')

print(f"Dataset shape: {df.shape}")
print(df.head(2))

# ── Column mapping ────────────────────────────────────────────────────────────
df = df.rename(columns={
    'SeriousDlqin2yrs':                          'target',
    'RevolvingUtilizationOfUnsecuredLines':       'credit_utilization_raw',
    'age':                                        'credit_history_length',
    'DebtRatio':                                  'dti_raw',
    'MonthlyIncome':                              'monthly_income',
    'NumberOfOpenCreditLinesAndLoans':            'num_inquiries',
    'NumberOfTime30-59DaysPastDueNotWorse':       'past_due',
})

# ── Feature engineering ───────────────────────────────────────────────────────
# Cap utilization at 100% (some values are > 1 as decimals)
df['credit_utilization'] = (df['credit_utilization_raw'] * 100).clip(0, 100)

# Cap DTI at 100
df['debt_to_income_ratio'] = (df['dti_raw'] * 100).clip(0, 100)

# Derive a proxy for existing_emi from income and dti
df['existing_emi'] = (df['monthly_income'] * df['dti_raw']).clip(0, 50000)

# Derive fuzzy_credit_score proxy (300-850 range)
# Higher score = better profile
df['fuzzy_credit_score'] = (
    850
    - (df['credit_utilization'] * 1.5)
    - (df['debt_to_income_ratio'] * 1.2)
    - (df['past_due'] * 30)
    + (df['credit_history_length'] * 3)
).clip(300, 850)

# ── Select final features ─────────────────────────────────────────────────────
FEATURES = [
    'fuzzy_credit_score',
    'debt_to_income_ratio',
    'credit_utilization',
    'existing_emi',
    'monthly_income',
    'credit_history_length',
    'num_inquiries',
]

df = df[FEATURES + ['target']].dropna()
print(f"After cleaning: {df.shape}")
print(f"Default rate: {df['target'].mean():.2%}")

X = df[FEATURES]
y = df['target']

# ── Train/test split ──────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── Normalize ─────────────────────────────────────────────────────────────────
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)

# ── Train Logistic Regression ─────────────────────────────────────────────────
print("\nTraining model...")
model = LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42)
model.fit(X_train_scaled, y_train)

# ── Evaluate ──────────────────────────────────────────────────────────────────
y_pred = model.predict(X_test_scaled)
print(f"\nAccuracy: {accuracy_score(y_test, y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Feature importance
print("\nFeature Weights (influence on default risk):")
for feat, coef in zip(FEATURES, model.coef_[0]):
    direction = "↑ risk" if coef > 0 else "↓ risk"
    print(f"  {feat:<30} {coef:+.4f}  {direction}")

# ── Save model and scaler ─────────────────────────────────────────────────────
joblib.dump(model, "model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(FEATURES, "features.pkl")
print("\nModel saved: model.pkl, scaler.pkl, features.pkl")
