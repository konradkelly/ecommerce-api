import { getDbPool } from '../model/db.connect.js';

const getRandomImages = async () => {
  const db = getDbPool();
  const [images] = await db.query('SELECT * FROM images ORDER BY RAND() LIMIT 4');
  return images;
};

export default { getRandomImages };