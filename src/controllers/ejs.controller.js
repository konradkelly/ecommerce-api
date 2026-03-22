import {
    getFeaturedProduct,
    getAllCategories,
    getProductById
} from '../services/default.service.js';
import imageService from '../services/imageService.js';
import passport from '../auth/passport.js';
import { registerUser } from '../services/user.service.js';
import * as cartService from '../services/cart.service.js';

export const landingPage = async (req, res) => {
    try {
        const [images, featuredProduct] = await Promise.all([
            imageService.getRandomImages(),
            getFeaturedProduct()
        ]);
        res.render("landing", {
            title: "MVC Starter App",
            subtitle: "Express + EJS + Static Assets",
            images,
            featuredProduct
        });
    } catch (error) {
        console.error('Error fetching landing page data:', error.message);
        res.render("landing", {
            title: "MVC Starter App",
            subtitle: "Express + EJS + Static Assets",
            images: [],
            featuredProduct: null
        });
    }
};

// export const products = async (req, res) => {
//     try {
//         const filters = parseFilters(req.query);
//         const hasFilters = hasFilterValues(filters);
//         const products = hasFilters ? await getFilteredProducts(filters) : await getAllProducts();
//         const categories = await getAllCategories();
        
//         // const products1 = await getAllProducts();

//         res.render("products", {
//             title: "Products page",
//             products,
//             categories,
//             filters,
//             resultCount: products.length
//         });
//     } catch (error) {
//         console.error('Error loading products page:', error.message);
//         res.render("products", {
//             title: "Products page",
//             products: [],
//             categories: [],
//             filters: {
//                 search: '', name: '', category: undefined,
//                 minPrice: undefined, maxPrice: undefined,
//                 sort: 'id', direction: 'asc'
//             },
//             resultCount: 0
//         });
//     }
// };

export const products = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render("products", {
            title: "Products page",
            categories,
            filters: {}, // or keep filters if needed for form defaults
        });
    } catch (error) {
        console.error('Error loading products page:', error.message);
        res.render("products", {
            title: "Products page",
            categories: [],
            filters: {}
        });
    }
};


export const productById = async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        res.render("product-detail", {
            title: "Product Detail",
            product
        });
    } catch (error) {
        console.error('Error loading product detail page:', error.message);
        res.render("product-detail", {
            title: "Product Detail",
            product: null,
            errorMessage: "The requested product could not be loaded."
        });
    }
};

//WTF IS THIS?
// export const productsPage = async (req, res) => {
//     try {
//         const filters = parseFilters(req.query);
//         const products = hasFilterValues(filters)
//             ? await getFilteredProducts(filters)
//             : await getAllProducts();

//         const categories = await getAllCategories();

//         res.render('products', {
//             title: 'Products',
//             products,
//             categories,
//             filters
//         });
//     } catch (error) {
//         console.error('Error rendering products page:', error);
//         res.status(500).send('Internal Server Error');
//     }
// };

export const home = (req, res) => {
    res.redirect('/landing');
};

export const login = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/products');
    res.render("login", { title: "Login", authMessage: null });
};

export const register = (req, res) => {
    res.render("register", { title: "Register", authMessage: null });
};

export const loginSubmit = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.render('login', {
                title: 'Login',
                authMessage: info?.message || 'Invalid username or password'
            });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            res.redirect('/products');
        });
    })(req, res, next);
};

export const registerSubmit = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('register', {
            title: 'Register',
            authMessage: 'Passwords do not match'
        });
    }

    try {
        await registerUser({ username, email, password });
        res.redirect('/');
    } catch (err) {
        res.render('register', {
            title: 'Register',
            authMessage: err.message || 'Registration failed'
        });
    }
};

export const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
};

export const cart = async (req, res) => {
    try {
        const cartData = await cartService.getCart(req.user.id);
        res.render('cart', {
            title: 'Shopping Cart',
            cart: cartData.items,
            total: cartData.total,
            itemCount: cartData.itemCount,
            errorMessage: null
        });
    } catch (error) {
        console.error('Error loading cart page:', error.message);
        res.render('cart', {
            title: 'Shopping Cart',
            cart: [],
            total: 0,
            itemCount: 0,
            errorMessage: 'Error loading cart'
        });
    }
};