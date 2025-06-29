const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback route after Google login
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful login
    res.redirect('/listings'); // or wherever you want
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
