import { getDbPool } from './db.connect.js';

export const findAllUsers = async () => {
	const db = getDbPool();
	const [rows] = await db.query(`
		SELECT id, username, email, role, first_name, last_name,
		       phone, street, city, state, zip,
		       loyalty_points, member_since, created_at
		FROM users
		ORDER BY id ASC
	`);
	return rows;
};

export const findUserById = async (id) => {
	const db = getDbPool();
	const [rows] = await db.query(`
		SELECT id, username, email, password_hash, role, first_name, last_name,
		       phone, street, city, state, zip,
		       loyalty_points, member_since, google_id, discord_id, created_at
		FROM users
		WHERE id = ?
	`, [id]);
	return rows[0] || null;
};

export const findUserByEmail = async (email) => {
	const db = getDbPool();
	const [rows] = await db.query(`
		SELECT id, username, email, password_hash, role, first_name, last_name,
		       phone, street, city, state, zip,
		       loyalty_points, member_since, google_id, discord_id, created_at
		FROM users
		WHERE email = ?
	`, [email]);
	return rows[0] || null;
};

export const findUserByUsername = async (username) => {
	const db = getDbPool();
	const [rows] = await db.query(`
		SELECT id, username, email, password_hash, role, first_name, last_name,
		       phone, street, city, state, zip,
		       loyalty_points, member_since, google_id, discord_id, created_at
		FROM users
		WHERE username = ?
	`, [username]);
	return rows[0] || null;
};

export const createLocalUser = async ({ username, email, passwordHash, firstName, lastName, phone }) => {
    const db = getDbPool();
    const [result] = await db.query(
        `INSERT INTO users (username, email, password_hash, first_name, last_name, phone, member_since)
         VALUES (?, ?, ?, ?, ?, ?, CURDATE())`,
        [username, email, passwordHash, firstName, lastName, phone]
    );
    return result.insertId;
};

export const findUserPreferredCategories = async (userId) => {
	const db = getDbPool();
	const [rows] = await db.query(`
		SELECT c.id, c.name
		FROM user_preferred_categories upc
		JOIN categories c ON c.id = upc.category_id
		WHERE upc.user_id = ?
		ORDER BY c.name ASC
	`, [userId]);
	return rows;
};

export const findOrCreateOAuthUser = async (email, provider, providerId) => {
	const db = getDbPool();
	// whitelist check
	const PROVIDER_COLUMNS = { google: 'google_id', discord: 'discord_id' };
	const providerColumn = PROVIDER_COLUMNS[provider];

	// Check if user exists by provider ID
	const [existing] = await db.query(
		`SELECT * FROM users WHERE ${providerColumn} = ?`,
		[providerId]
	);
	if (existing.length > 0) return existing[0];

	// Check if user exists by email (link accounts)
	const [byEmail] = await db.query(
		'SELECT * FROM users WHERE email = ?',
		[email]
	);
	if (byEmail.length > 0) {
		await db.query(
			`UPDATE users SET ${providerColumn} = ? WHERE id = ?`,
			[providerId, byEmail[0].id]
		);
		return { ...byEmail[0], [providerColumn]: providerId };
	}

	// Create new user
	const username = email.split('@')[0];
	const [result] = await db.query(
		`INSERT INTO users (username, email, ${providerColumn}) VALUES (?, ?, ?)`,
		[username, email, providerId]
	);
	return findUserById(result.insertId);
};

export const updateUserProfile = async (id, { firstName, lastName, phone, street, city, state, zip }) => {
    const db = getDbPool();
    const [result] = await db.query(
        `UPDATE users SET first_name = ?, last_name = ?, phone = ?, 
         street = ?, city = ?, state = ?, zip = ? WHERE id = ?`,
        [firstName, lastName, phone, street, city, state, zip, id]
    );
    return result.affectedRows > 0;
};

export const updatePassword = async (id, passwordHash) => {
    const db = getDbPool();
    const [result] = await db.query(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [passwordHash, id]
    );
    return result.affectedRows > 0;
};

export const updateLoyaltyPoints = async (id, points) => {
    const db = getDbPool();
    const [result] = await db.query(
        'UPDATE users SET loyalty_points = ? WHERE id = ?',
        [points, id]
    );
    return result.affectedRows > 0;
};

export const updateUserRole = async (id, role) => {
    const db = getDbPool();
    const [result] = await db.query(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id]
    );
    return result.affectedRows > 0;
	};
	
export const deleteUser = async (id) => {
    const db = getDbPool();
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
};