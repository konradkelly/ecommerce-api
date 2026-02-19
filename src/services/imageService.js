import { getDbPool } from '../model/db.connect.js';

const getRandomImages = async () => {
  const [images] = await getDbPool.query('SELECT * FROM images ORDER BY RAND() LIMIT 4');
  return images;
};

export default { getRandomImages };