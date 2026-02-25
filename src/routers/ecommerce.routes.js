import { Router } from "express";
import * as ecomCtl from '../controllers/ecommerce.controller.js';


const router = Router();

// http://localhost:8001/api
router.get("/", ecomCtl.landingPage);
// http://localhost:8001/api/data
router.get('/data', ecomCtl.getData);
// http://localhost:8001/api/login
router.get('/login', ecomCtl.login);
// http://localhost:8001/api/register
router.get('/register', ecomCtl.register);
// http://localhost:8001/api/products
router.get('/products', ecomCtl.products);
// router.get('/products/:id', ecomCtl.products);

export default router;