import { Router } from "express";
import * as ecomCtl from '../controllers/ecommerce.controller.js';


const router = Router();

// http://localhost:8001/
router.get("/", ecomCtl.landingPage);
// http://localhost:8001/data
router.get('/data', ecomCtl.getData);
// http://localhost:8001/login
router.get('/login', ecomCtl.login);
// http://localhost:8001/register
router.get('/register', ecomCtl.register);
// http://localhost:8001/api/products
router.get('/api/products', ecomCtl.products);
// http://localhost:8001/api/products/11
// router.get('/api/products/:id', ecomCtl.productDetailPage);

export default router;