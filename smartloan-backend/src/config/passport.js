const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const full_name = profile.displayName;

            // Check if user already exists
            const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

            if (rows.length > 0) {
                // User exists, return them
                return done(null, rows[0]);
            }

            // New user — insert into DB (no password for Google users)
            const [result] = await db.query(
                'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
                [full_name, email, 'GOOGLE_AUTH', 'user']
            );

            const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            return done(null, newUser[0]);

        } catch (err) {
            return done(err, null);
        }
    }));

module.exports = passport;
