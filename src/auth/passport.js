import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { validateCredentials, getUserById } from '../services/user.service.js';
import { findOrCreateOAuthUser } from '../model/users.repo.js';

passport.use(new LocalStrategy(
	async (username, password, done) => {
		try {
			const user = await validateCredentials(username, password);
			if (!user) return done(null, false, { message: 'Invalid username or password' });
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	}
));

passport.use(new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: '/auth/google/callback'
	},
	async (accessToken, refreshToken, profile, done) => {
		try {
			const email = profile.emails?.[0]?.value;
			if (!email) return done(new Error('No email returned from Google'));
			const user = await findOrCreateOAuthUser(email, 'google', profile.id);
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	}
));

passport.use(new DiscordStrategy(
	{
		clientID: process.env.DISCORD_CLIENT_ID,
		clientSecret: process.env.DISCORD_CLIENT_SECRET,
		callbackURL: '/auth/discord/callback',
		scope: ['identify', 'email']
	},
	async (accessToken, refreshToken, profile, done) => {
		try {
			const email = profile.email;
			if (!email) return done(new Error('No email returned from Discord'));
			const user = await findOrCreateOAuthUser(email, 'discord', profile.id);
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	}
));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await getUserById(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});

export default passport;
