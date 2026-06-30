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

            const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);

            if (rows.length > 0) {
                return done(null, rows[0]);
            }

            const { rows: inserted } = await db.query(
                'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
                [full_name, email, 'GOOGLE_AUTH', 'user']
            );

            return done(null, inserted[0]);

        } catch (err) {
            return done(err, null);
        }
    }));

module.exports = passport;
