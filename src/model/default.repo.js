import { getDbPool } from './db.connect.js';

export const findAllProducts = async () => {
	const db = getDbPool();
	const [rows] = await db.query(`
		SELECT p.*, c.name AS category_name
		FROM products p
		LEFT JOIN categories c ON c.id = p.category_id
		ORDER BY p.id ASC
	`);
	return rows;
};

export const findAllCategories = async () => {
	const db = getDbPool();
	const [rows] = await db.query('SELECT id, name FROM categories ORDER BY name ASC');
	return rows;
};

export const findProductById = async (id) => {
	const db = getDbPool();
	const [rows] = await db.query(`
		SELECT p.*, c.name AS category_name
		FROM products p
		LEFT JOIN categories c ON c.id = p.category_id
		WHERE p.id = ?
	`, [id]);
	return rows[0] || null;
}

export const findFilteredProducts = async ({ search, name, category, minPrice, maxPrice, sort, direction }) => {
	const db = getDbPool();
	let query = `
		SELECT p.*, c.name AS category_name
		FROM products p
		LEFT JOIN categories c ON c.id = p.category_id
	`;
	const params = [];
	const conditions = [];

	if (search) {
		conditions.push('(p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)');
		params.push(`%${search}%`, `%${search}%`, `%${search}%`);
	}
	if (name) {
		conditions.push('p.name LIKE ?');
		params.push(`%${name}%`);
	}
	if (category) {
		conditions.push('p.category_id = ?');
		params.push(category);
	}
	if (minPrice !== undefined && minPrice !== null) {
		conditions.push('p.price >= ?');
		params.push(minPrice);
	}
	if (maxPrice !== undefined && maxPrice !== null) {
		conditions.push('p.price <= ?');
		params.push(maxPrice);
	}
	if (conditions.length > 0) {
		query += ' WHERE ' + conditions.join(' AND ');
	}

	const sortableColumns = {
		price: 'p.price',
		name: 'p.name',
		id: 'p.id'
	};
	const sortColumn = sortableColumns[sort] || 'p.id';
	const sortDirection = direction === 'desc' ? 'DESC' : 'ASC';
	query += ` ORDER BY ${sortColumn} ${sortDirection}`;

	if (sortColumn !== 'p.id') {
		query += ', p.id ASC';
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