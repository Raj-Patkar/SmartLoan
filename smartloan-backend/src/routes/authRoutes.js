const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

// Email/password auth
router.post('/register', register);
router.post('/login', login);

// Google OAuth — step 1: redirect to Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

// Google OAuth — step 2: Google redirects back here
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/google/failure', session: false }),
    (req, res) => {
        // Issue our own JWT after Google auth succeeds
        const token = jwt.sign(
            { id: req.user.id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // In a real frontend app you'd redirect with the token
        // For now we return JSON
        res.redirect(`http://localhost:3000/auth/google-success?token=${token}`);
    }
);

router.get('/google/failure', (req, res) => {
    res.status(401).json({ message: 'Google authentication failed' });
});

module.exports = router;
