const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.js');

module.exports = function (passport) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://wandelust-aj3z.onrender.com/auth/google/callback", // Use .env value
      proxy: true // Allows Google to trust X-Forwarded-Proto from Render
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) return done(null, user);

        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          username: profile.displayName, 
          email: profile.emails[0].value,
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
};
