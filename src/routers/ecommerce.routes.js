import { Router } from "express";
import * as ecomCtl from '../controllers/ecommerce.controller.js';

const router = Router();

// --- HTML / EJS rendered routes ---
router.get("/", ecomCtl.landingPage);
router.get('/login', ecomCtl.login);
router.get('/register', ecomCtl.register);
router.get('/products', ecomCtl.products);
router.get('/products/:id', ecomCtl.productById);

// --- JSON API routes ---
router.get('/data', ecomCtl.getData);
router.get('/api/products', ecomCtl.getProductsApi);
router.get('/api/products/:id', ecomCtl.getProductByIdApi);

export default router;