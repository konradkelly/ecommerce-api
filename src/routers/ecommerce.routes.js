import { Router } from "express";
import * as ecomCtl from '../controllers/ecommerce.controller.js';

const router = Router();

router.get("/", ecomCtl.landingPage);
router.get('/data', ecomCtl.getData);
router.get('/login', ecomCtl.login);
router.get('/register', ecomCtl.register);
router.get('/products', ecomCtl.products);

export default router;