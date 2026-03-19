import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sessionMiddleware } from '../auth/sessions.js';
import passport from '../auth/passport.js';
import ecommerceRouter from './routers/ecommerce.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//static directories
app.use(express.static(path.join(__dirname, '../public')));

//front-end script for header interactions
app.get('/js/header.js', (req, res) => {
	res.sendFile(path.join(__dirname, 'utility', 'header.js'));
});

app.get('/js/icon.js', (req, res) => {
	res.sendFile(path.join(__dirname, 'utility', 'icon.js'));
});

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//session + auth
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// expose current user to all EJS views
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	next();
});

//routers
app.use("/", ecommerceRouter);


export default app;