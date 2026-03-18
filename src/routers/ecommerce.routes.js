import { Router } from "express";
import * as ejsCtl from '../controllers/ejs.controller.js';
import * as apiCtl from '../controllers/api.controller.js';
import { requireAuth, requireAuthApi } from '../middleware/auth.middleware.js';

const router = Router();

// --- Public routes (no auth required) ---
router.get("/", ejsCtl.home);
router.get('/landing', ejsCtl.landingPage);
router.get('/login', ejsCtl.login);
router.post('/login', ejsCtl.loginSubmit);
router.get('/register', ejsCtl.register);
router.post('/register', ejsCtl.registerSubmit);

// --- Protected HTML routes ---
router.post('/logout', requireAuth, ejsCtl.logout);
router.get('/products', requireAuth, ejsCtl.products);
router.get('/products/:id', requireAuth, ejsCtl.productById);

// --- Protected JSON API routes ---
router.get('/data', requireAuthApi, apiCtl.getData);
router.get('/api/products', requireAuthApi, apiCtl.getProductsApi);
router.get('/api/products/:id', requireAuthApi, apiCtl.getProductByIdApi);

export default router;