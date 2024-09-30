const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User'); // Adjust the path to your User model

passport.use(
  new GoogleStrategy({
    clientID: process.env.CLIENT_ID, // Ensure .env contains CLIENT_ID
    clientSecret: process.env.CLIENT_SECRET, // Ensure .env contains CLIENT_SECRET
    callbackURL: '/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists in our DB
      let existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }

      // If not, create a new user in our DB
      const newUser = new User({
        googleId: profile.id,
        fullname: profile.name.givenName + ' ' + profile.name.familyName, // Combine first and last name
        email: profile.emails[0].value,
      });
      await newUser.save();
      done(null, newUser);
    } catch (error) {
      done(error, null);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
