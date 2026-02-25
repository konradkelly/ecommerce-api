//place controller functions here...
import {
    getAllProducts,
    getFeaturedProduct,
    getFilteredProducts,
    getAllCategories
} from '../services/default.service.js';
import imageService from '../services/imageService.js';

const parseFilters = (query = {}) => {
    const toNumber = (value) => {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }

        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    };

    return {
        search: typeof query.search === 'string' ? query.search.trim() : '',
        name: typeof query.name === 'string' ? query.name.trim() : '',
        category: toNumber(query.category),
        minPrice: toNumber(query.minPrice),
        maxPrice: toNumber(query.maxPrice),
        sort: typeof query.sort === 'string' ? query.sort : 'id',
        direction: query.direction === 'desc' ? 'desc' : 'asc'
    };
};

export const login = (req, res) => {
    res.status(200).json("hi from login");
}
export const register = (req, res) => {
    res.status(200).json("hi from register");
}
export const products = async (req, res) => {
    // res.status(200).json("hi from products from jonus");
    try {
        const filters = parseFilters(req.query);
        const hasFilters = Boolean(
            filters.search ||
            filters.name ||
            filters.category ||
            filters.minPrice !== undefined ||
            filters.maxPrice !== undefined ||
            filters.sort !== 'id' ||
            filters.direction !== 'asc'
        );

        const [products, categories] = await Promise.all([
            hasFilters ? getFilteredProducts(filters) : getAllProducts(),
            getAllCategories()
        ]);

        res.render("products", {
            title: "Products page",
            products,
            categories,
            filters,
            resultCount: products.length
        });
        // res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching images:', error.message);
        res.render("products", {
            title: "Products page",
            products: [],
            categories: [],
            filters: {
                search: '',
                name: '',
                category: undefined,
                minPrice: undefined,
                maxPrice: undefined,
                sort: 'id',
                direction: 'asc'
            },
            resultCount: 0
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
