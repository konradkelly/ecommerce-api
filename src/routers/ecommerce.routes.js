import { Router } from "express";
import * as ecomCtl from '../controllers/ecommerce.controller.js';


const router = Router();

router.get("/", ecomCtl.landingPage);
router.get('/login', ecomCtl.login);
router.get('/register', ecomCtl.register);
router.get('/products', ecomCtl.productsPage);
router.get('/products/:id', ecomCtl.productDetailPage);

router.get('/api/products', ecomCtl.getProductsApi);
router.get('/data', ecomCtl.getData);

export default router;