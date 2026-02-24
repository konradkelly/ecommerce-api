import { getDbPool } from './db.connect.js';

export const findAllProducts = async () => {
	const db = getDbPool();
	const [rows] = await db.query('SELECT * FROM products ORDER BY id ASC');
	return rows;
};

export const findProductById = async (id) => {
	const db = getDbPool();
	const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
	return rows[0] || null;
}

export const findFilteredProducts = async ({ category, minPrice, maxPrice, sort }) => {
	const db = getDbPool();
	let query = 'SELECT * FROM products';
	const params = [];
	const conditions = [];

	if (category) {
		conditions.push('category_id = ?');
		params.push(category);
	}
	if (minPrice) {
		conditions.push('price >= ?');
		params.push(minPrice);
	}
	if (maxPrice) {
		conditions.push('price <= ?');
		params.push(maxPrice);
	}
	if (conditions.length > 0) {
		query += ' WHERE ' + conditions.join(' AND ');
		}
	if (sort) {
		const validSorts = ['price', 'name', 'id'];
		if (validSorts.includes(sort))
		query += ` ORDER BY ${siort} ASC`;	
	}
	const [rows] = await db.query(query, params);
	return rows;
};

export const findRandomProducts = async (limit = 4) => {
	const db = getDbPool();
	const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 4;
	const [rows] = await db.query('SELECT * FROM products ORDER BY RAND() LIMIT ?', [safeLimit]);
	return rows;
};

export const findFeaturedProduct = async () => {
	const db = getDbPool();
	const [featuredRows] = await db.query(`
		SELECT p.*, c.name AS category_name
		FROM products p
		LEFT JOIN categories c ON c.id = p.category_id
		WHERE p.featured = TRUE
		ORDER BY RAND()
		LIMIT 1
	`);

	if (featuredRows.length > 0) {
		return featuredRows[0];
	}

	const [fallbackRows] = await db.query(`
		SELECT p.*, c.name AS category_name
		FROM products p
		LEFT JOIN categories c ON c.id = p.category_id
		ORDER BY RAND()
		LIMIT 1
	`);
	return fallbackRows[0] || null;
};