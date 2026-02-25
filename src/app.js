import express from 'express';
import path from 'node:path';
import ecommerceRouter from './routers/ecommerce.routes.js';

//configure Express.js app
const app = express();

//view engine
app.set("view engine", "ejs");
app.set("views", "src/views");

//static directories
app.use(express.static('public'));

//front-end script for header interactions
app.get('/js/header.js', (req, res) => {
	res.sendFile(path.resolve('src/utility/header.js'));
});

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routers
app.use("/api", ecommerceRouter);


export default app;