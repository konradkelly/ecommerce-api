import { getDbPool } from './db.connect.js';

export const findAllProducts = async () => {
	const db = getDbPool();
	const [rows] = await db.query('SELECT * FROM products ORDER BY id ASC');
	return rows;
};