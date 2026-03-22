import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sessionMiddleware } from './auth/sessions.js';
import passport from './auth/passport.js';
import ecommerceRouter from './routers/ecommerce.routes.js';
import { getCart } from './services/cart.service.js';

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
	res.locals.cartItemCount = 0;
	next();
});

app.use(async (req, res, next) => {
	if (!req.user?.id) return next();

	try {
		const cart = await getCart(req.user.id);
		res.locals.cartItemCount = cart.itemCount || 0;
	} catch (error) {
		console.error('Error loading cart count for header:', error.message);
		res.locals.cartItemCount = 0;
	}

	next();
});

//routers
app.use("/", ecommerceRouter);


export default app;