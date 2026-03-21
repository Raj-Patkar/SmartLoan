require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const loanRoutes = require('./routes/loanRoutes');
const managerRoutes = require('./routes/managerRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/manager', managerRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'SmartLoan API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})