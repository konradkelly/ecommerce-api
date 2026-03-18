import bcrypt from 'bcryptjs';
import {
	findUserById,
	findUserByUsername,
	createLocalUser
} from '../model/users.repo.js';

const BCRYPT_COST = 12;

export const registerUser = async ({ username, email, password, firstName, lastName, phone }) => {
	const existing = await findUserByUsername(username);
	if (existing) {
		throw new Error('Username already taken');
	}

	const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

	const id = await createLocalUser({
		username,
		email,
		passwordHash,
		firstName,
		lastName,
		phone
	});

	return { id, username, email };
};

export const validateCredentials = async (username, password) => {
	const user = await findUserByUsername(username);
	if (!user) return null;

	const match = await bcrypt.compare(password, user.password_hash);
	return match ? user : null;
};

export const getUserById = (id) => findUserById(id);
