import { Router } from "express";
import passport from 'passport';
import * as ejsCtl from '../controllers/ejs.controller.js';
import * as apiCtl from '../controllers/api.controller.js';
import { requireAuth, requireAuthApi } from '../middleware/auth.middleware.js';

const router = Router();

// --- Google OAuth routes ---
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', {
	failureRedirect: '/login',
	successRedirect: '/products'
}));

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
router.get('/cart', requireAuth, ejsCtl.cart);

// --- Protected JSON API routes ---
router.get('/data', requireAuthApi, apiCtl.getData);
router.get('/api/products', requireAuthApi, apiCtl.getProductsApi);
router.get('/api/products/:id', requireAuthApi, apiCtl.getProductByIdApi);

// --- Shopping Cart API routes ---
router.get('/api/cart', requireAuthApi, apiCtl.getCart);
router.post('/api/cart/add', requireAuthApi, apiCtl.addToCart);
router.delete('/api/cart/items/:cartItemId', requireAuthApi, apiCtl.removeFromCart);
router.put('/api/cart/items/:cartItemId', requireAuthApi, apiCtl.updateCartItem);
router.delete('/api/cart', requireAuthApi, apiCtl.clearCart);

export default router;