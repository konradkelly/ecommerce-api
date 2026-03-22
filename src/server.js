import 'dotenv/config';
import app from './app.js';

const { PORT } = process.env;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});