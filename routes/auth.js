const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google Login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google callback URL
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), (req, res) => {
  // Successful login
  res.redirect('/listings');
});


module.exports = router;
