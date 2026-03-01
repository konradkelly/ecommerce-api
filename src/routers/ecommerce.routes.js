import { Router } from "express";
import * as ejsCtl from '../controllers/ejs.controller.js';
import * as apiCtl from '../controllers/api.controller.js';

const router = Router();

// --- HTML / EJS rendered routes ---
// GET http://localhost:8001/
router.get("/", ejsCtl.landingPage);

// GET http://localhost:8001/login
router.get('/login', ejsCtl.login);

// GET http://localhost:8001/register
router.get('/register', ejsCtl.register);

// GET http://localhost:8001/products
router.get('/products', ejsCtl.products);

// GET http://localhost:8001/products/:id
router.get('/products/:id', ejsCtl.productById);

// --- JSON API routes ---
// GET http://localhost:8001/data
router.get('/data', apiCtl.getData);

// GET http://localhost:8001/api/products
router.get('/api/products', apiCtl.getProductsApi);

// GET http://localhost:8001/api/products/:id
router.get('/api/products/:id', apiCtl.getProductByIdApi);

export default router;