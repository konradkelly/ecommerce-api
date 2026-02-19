//place controller functions here...
import { getAllProducts } from '../services/default.service.js';

export const login = (req, res) => {
    res.status(200).json("hi from login");
}
export const register = (req, res) => {
    res.status(200).json("hi from register");
}
export const products = (req, res) => {
    res.status(200).json("hi from products from jonus");
}

export const getData = async (req, res) => {
    try {
        const products = await getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: 'Database query failed' });
    }
};

export const landingPage = (req, res) => {
    res.render("default", {
        title: "MVC Starter App",
        subtitle: "Express + EJS + Static Assets"
    });
}