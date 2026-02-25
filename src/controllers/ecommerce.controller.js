//place controller functions here...
import {
    getAllProducts,
    getFeaturedProduct,
    getFilteredProducts,
    getAllCategories,
    getProductById
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

const hasFilterValues = (filters) => Boolean(
    filters.search ||
    filters.name ||
    filters.category ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.sort !== 'id' ||
    filters.direction !== 'asc'
);

export const login = (req, res) => {
    res.status(200).json('Login page placeholder for Milestone #3');
};

export const register = (req, res) => {
    res.status(200).json('Register page placeholder for Milestone #3');
};

export const productsPage = async (req, res) => {
    try {
        const filters = parseFilters(req.query);
        const hasFilters = hasFilterValues(filters);

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
    } catch (error) {
        console.error('Error loading products page:', error.message);
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
};

export const getProductsApi = async (req, res) => {
    try {
        const filters = parseFilters(req.query);
        const hasFilters = hasFilterValues(filters);
        const products = hasFilters ? await getFilteredProducts(filters) : await getAllProducts();

        res.status(200).json({
            count: products.length,
            filters,
            products
        });
    } catch (error) {
        console.error('Error loading products API:', error.message);
        res.status(500).json({ error: 'Unable to fetch products.' });
    }
};

export const productDetailPage = async (req, res) => {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
        return res.status(404).render('product-detail', {
            title: 'Product Not Found',
            product: null,
            errorMessage: 'The product you requested does not exist.'
        });
    }

    try {
        const product = await getProductById(productId);

        if (!product) {
            return res.status(404).render('product-detail', {
                title: 'Product Not Found',
                product: null,
                errorMessage: 'The product you requested does not exist.'
            });
        }

        return res.render('product-detail', {
            title: product.name,
            product,
            errorMessage: ''
        });
    } catch (error) {
        console.error('Error loading product detail:', error.message);
        return res.status(500).render('product-detail', {
            title: 'Product',
            product: null,
            errorMessage: 'Unable to load this product right now.'
        });
    }
};

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
