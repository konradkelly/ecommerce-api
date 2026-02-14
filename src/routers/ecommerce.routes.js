import { Router } from "express";
import * as ecomCtl from '../controllers/ecommerce.controller.js'

const router = Router();

router.get("/", (req, res) => {
    res.render("default", {
        title: "MVC Starter App",
        subtitle: "Express + EJS + Static Assets"
    });
});
router.get('/login', ecomCtl.login);
router.get('/register', ecomCtl.register);
router.get('/products', ecomCtl.products);

export default router;