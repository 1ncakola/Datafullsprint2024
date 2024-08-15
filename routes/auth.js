const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const User = require('../models/User')


// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cars',
  password: 'Caliente1084@',
  port: 5432,
});

// Passport Local Strategy
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize user ID to save in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session using ID
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Signup Route
router.get('/signup', (req, res) => {
    res.render('signup');
});
//
//router.post('/signup', async (req, res) => {
//  const { username, password } = req.body;
router.post('/signup', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // password confirmation
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    // Check if username already exists
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rows.length > 0) {
          return res.status(400).json({ error: 'Username already exists' });
        }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Signup error:',err);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

// Login Route -GET
router.get('/login', (req, res) => {
    res.render('login');
});

// Login Route -POST
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: false,
}));

// Logout Route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/auth/login');
  });
});

module.exports = router;
