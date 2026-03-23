# SmartLoan Backend

A banking-style backend system that uses a **Fuzzy Inference System (FIS)** to evaluate credit scores and determine loan eligibility.

---

## Tech Stack

- **Node.js + Express.js** — REST API server
- **MySQL** — relational database
- **JWT + Passport.js** — authentication (email/password + Google OAuth)
- **Python FastAPI** — Fuzzy Inference System microservice
- **scikit-fuzzy** — fuzzy logic engine

---

## Project Structure

```
smartloan-backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MySQL connection pool
│   │   └── passport.js        # Google OAuth strategy
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── assessmentController.js
│   │   ├── loanController.js
│   │   └── managerController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── loanRoutes.js
│   │   └── managerRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verify + role check
│   ├── utils/
│   │   └── loanEligibility.js # DTI + eligibility logic
│   └── server.js
├── .env
└── package.json

smartloan-fis/
├── main.py                    # FastAPI + FIS logic
└── venv/
```

---

## Prerequisites

- Node.js v18+
- Python 3.11
- MySQL 8.0

---

## Setup

### 1. Clone the repo and install Node dependencies

```bash
cd smartloan-backend
npm install
```

### 2. Configure environment variables

Create a `.env` file in `smartloan-backend/`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smartloan_db
JWT_SECRET=your_jwt_secret
FIS_API_URL=http://localhost:8000/predict-credit-score
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
SESSION_SECRET=your_session_secret
```

### 3. Set up the database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE smartloan_db;
USE smartloan_db;
```

Run all `CREATE TABLE` statements for:
- `users`
- `user_financial_profiles`
- `credit_assessments`
- `loan_products`
- `loan_applications`

Seed loan products:
```sql
INSERT INTO loan_products (name, min_credit_score, max_dti, min_income, max_loan_amount, interest_rate, tenure_months) VALUES
('Basic Personal Loan', 40, 50.00, 20000, 200000, 14.5, 36),
('Standard Personal Loan', 55, 45.00, 35000, 500000, 12.0, 48),
('Premium Personal Loan', 70, 40.00, 50000, 1000000, 10.5, 60),
('Home Loan', 75, 35.00, 60000, 5000000, 8.5, 240),
('Business Loan', 65, 40.00, 75000, 2000000, 13.0, 84);
```

### 4. Set up and run the Python FIS

```bash
cd smartloan-fis
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### 5. Start the Node.js server

```bash
cd smartloan-backend
npm run dev
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with email/password |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/google` | Google OAuth login |

### Financial Profile (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/profile` | Submit financial profile |
| PUT | `/api/profile` | Update financial profile |
| GET | `/api/profile` | Get own profile |

### Credit Assessment (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assessment/run` | Run FIS credit assessment |
| GET | `/api/assessment/latest` | Get latest assessment result |

### Loans (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/loans/recommendations` | Get eligible loan products |
| POST | `/api/loans/apply` | Apply for a loan |
| GET | `/api/loans/my-applications` | View own applications |

### Manager Dashboard (requires JWT + manager role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/users` | All users with credit scores |
| GET | `/api/manager/applications` | All loan applications |
| PATCH | `/api/manager/applications/:id/status` | Approve or reject application |
| GET | `/api/manager/analytics` | Risk stats and score distribution |

---

## How the FIS Works

The credit scoring uses a 2-stage Fuzzy Inference System:

**Stage 1** — computes 3 intermediate scores:
- `behaviour_score` — from payment history + credit utilization
- `financial_score` — from DTI + income + EMI
- `experience_score` — from credit history length + inquiries

**Stage 2** — combines the 3 scores into a final `credit_score` (300–850)

| Score Range | Band | Risk Level |
|-------------|------|------------|
| 800 – 850 | Excellent | Very Low |
| 700 – 799 | Good | Low |
| 600 – 699 | Fair | Medium |
| 500 – 599 | Poor | High |
| 300 – 499 | Very Poor | Very High |

---

## Authentication

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

Manager routes additionally require the user's `role` to be `manager`.
