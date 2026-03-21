import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { findOrCreateOAuthUser } from '../model/users.repo.js';

const config = {
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: '/auth/google/callback'
};

passport.use(new Strategy(config, async (accessToken, refreshToken, profile, done) => {
	try {
		const email = profile.emails?.[0]?.value;
		if (!email) return done(new Error('No email returned from Google'));
		const user = await findOrCreateOAuthUser(email, 'google', profile.id);
		return done(null, user);
	} catch (err) {
		return done(err);
	}
}));