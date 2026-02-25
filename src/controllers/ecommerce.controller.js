//place controller functions here...
import { getAllProducts, getFeaturedProduct } from '../services/default.service.js';
import imageService from '../services/imageService.js';

export const login = (req, res) => {
    res.status(200).json("hi from login");
}
export const register = (req, res) => {
    res.status(200).json("hi from register");
}
export const products = async (req, res) => {
    // res.status(200).json("hi from products from jonus");
    try {
        const products = await getAllProducts();
        res.render("products", {
            title: "Products page",
            products
        });
        // res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching images:', error.message);
        res.render("products", {
            title: "Products page",
            products: null
        });
    }
    
}

export const getData = async (req, res) => {
    try {
        const products = await getAllProducts();
        const images = await imageService.getRandomImages();
        res.status(200).json({ products, images });
        
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: 'getData: Database query failed' });
    }
};

export const landingPage = async (req, res) => {
    try {
        const [images, featuredProduct] = await Promise.all([
            imageService.getRandomImages(),
            getFeaturedProduct()
        ]);
        // console.log(images);
        res.render("landing", {
            title: "MVC Starter App",
            subtitle: "Express + EJS + Static Assets",
            images,
            featuredProduct
        });
        // res.status(200).json({ images });
    } catch (error) {
        console.error('Error fetching images:', error.message);
        res.render("landing", {
            title: "MVC Starter App",
            subtitle: "Express + EJS + Static Assets",
            images: [],
            featuredProduct: null
        });
    }
}
