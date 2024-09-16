const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User'); // Adjust the path to your User model

passport.use(
  new GoogleStrategy({
    clientID: '890897044907',
    clientSecret: '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',
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    // Check if user already exists in our DB
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }
    // If not, create a new user in our DB
    const newUser = await new User({ googleId: profile.id }).save();
    done(null, newUser);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
