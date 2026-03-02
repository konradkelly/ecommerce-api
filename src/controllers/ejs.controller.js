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
        category: typeof query.category === 'string' ? query.category.trim() : undefined,
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

export const products = async (req, res) => {
    try {
        const filters = parseFilters(req.query);
        const hasFilters = hasFilterValues(filters);
        const products = hasFilters ? await getFilteredProducts(filters) : await getAllProducts();
        const categories = await getAllCategories();
        
        // const products1 = await getAllProducts();

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
                search: '', name: '', category: undefined,
                minPrice: undefined, maxPrice: undefined,
                sort: 'id', direction: 'asc'
            },
            resultCount: 0
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

export const productsPage = async (req, res) => {
    try {
        const filters = parseFilters(req.query);
        const products = hasFilterValues(filters)
            ? await getFilteredProducts(filters)
            : await getAllProducts();

        const categories = await getAllCategories();

        res.render('products', {
            title: 'Products',
            products,
            categories,
            filters
        });
    } catch (error) {
        console.error('Error rendering products page:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const login = (req, res) => {
    res.render("login", { title: "Login" });
};

export const register = (req, res) => {
    res.render("register", { title: "Register" });
};