import app from './app.js';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise.js';

//read environment variables
dotenv.config();

//destructure our env values
const { PORT, DB_DATABASE, DB_HOST, DB_PORT,
        DB_USER, DB_PASSWORD } = process.env;


// const port = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
})