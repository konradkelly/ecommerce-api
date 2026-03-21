import 'dotenv/config';
import app from './app.js';
import './auth/googleStrategy.js';

const { PORT } = process.env;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});