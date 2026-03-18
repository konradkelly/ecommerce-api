import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}

//accessToken - short term, helps the client make requests
//refreshToken - long term, used to get a new access token
passport.use(new Strategy(config, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));

passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((user, done) => { done(null, user); });