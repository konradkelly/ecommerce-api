import { Router } from "express";
import * as ejsCtl from '../controllers/ejs.controller.js';
import * as apiCtl from '../controllers/api.controller.js';

const router = Router();

// --- HTML / EJS rendered routes ---
router.get("/", ejsCtl.landingPage);
router.get('/login', ejsCtl.login);
router.get('/register', ejsCtl.register);
router.get('/products', ejsCtl.products);
router.get('/products/:id', ejsCtl.productById);

// --- JSON API routes ---
router.get('/data', apiCtl.getData);
router.get('/api/products', apiCtl.getProductsApi);
router.get('/api/products/:id', apiCtl.getProductByIdApi);

export default router;