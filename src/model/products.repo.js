import { getDbPool } from './db.connect.js';

export const findAllProducts = async () => {
	const db = getDbPool();
	console.log("Fetching all products...");
	const [rows] = await db.query(`
		SELECT p.*, c.name AS category_name
		FROM products p
		LEFT JOIN categories c ON c.id = p.category_id
		ORDER BY p.id ASC
	`);
	console.log("Fetched products:", rows);
	return rows;
};

export const findAllCategories = async () => {
	const db = getDbPool();
	console.log("Fetching all categories...");
	const [rows] = await db.query('SELECT id, name FROM categories ORDER BY name ASC');
	console.log("Fetched categories:", rows);
	return rows;
};

export const findProductById = async (id) => {
	const db = getDbPool();
	console.log("Querying product with ID:", id);
	const [rows] = await db.query(`
		SELECT p.*, c.name AS category_name
		FROM products p
		LEFT JOIN categories c ON c.id = p.category_id
		WHERE p.id = ?
	`, [id]);
	console.log("Query result:", rows);
	return rows[0] || null;
}

export const findFilteredProducts = async ({ search, name, category, minPrice, maxPrice, sort, direction }) => {
	const db = getDbPool();
	console.log("Fetching filtered products with filters:", { search, name, category, minPrice, maxPrice, sort, direction });
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
		conditions.push('LOWER(c.name) = LOWER(?)');
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

	console.log("Executing query:", query, "with params:", params);
	const [rows] = await db.query(query, params);
	console.log("Fetched filtered products:", rows);
	return rows;
};

export const findRandomProducts = async (limit = 4) => {
	const db = getDbPool();
	console.log("Fetching random products with limit:", limit);
	const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 4;
	const [rows] = await db.query('SELECT * FROM products ORDER BY RAND() LIMIT ?', [safeLimit]);
	console.log("Fetched random products:", rows);
	return rows;
};

export const findFeaturedProduct = async () => {
	const db = getDbPool();
	console.log("Fetching featured product...");
	const [featuredRows] = await db.query(`
		SELECT p.*, c.name AS category_name
		FROM products p
		LEFT JOIN categories c ON c.id = p.category_id
		WHERE p.featured = TRUE
		ORDER BY RAND()
		LIMIT 1
	`);
	console.log("Fetched featured product:", featuredRows);

	if (featuredRows.length > 0) {
		return featuredRows[0];
	}

	console.log("No featured product found, fetching fallback product...");
	const [fallbackRows] = await db.query(`
		SELECT p.*, c.name AS category_name
		FROM products p
		LEFT JOIN categories c ON c.id = p.category_id
		ORDER BY RAND()
		LIMIT 1
	`);
	console.log("Fetched fallback product:", fallbackRows);
	return fallbackRows[0] || null;
};