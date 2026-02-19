import app from './app.js';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

//read environment variables
dotenv.config();

const { PORT, DB_DATABASE, DB_HOST, DB_PORT,
        DB_USER, DB_PASSWORD } = process.env;

// const port = process.env.PORT;
try {
    const connection = await mysql.createConnection({
        host: DB_HOST,
        port: DB_PORT, // <-- change to 3307
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE,
    });

} catch (err) {
    console.log(`something went wrong ${err}`);
}




app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
})