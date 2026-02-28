import {
    getAllProducts,
    getFilteredProducts,
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
        console.error('Database error:', error.message);
        res.status(500).json({ error: 'getProductsApi: Database query failed' });
    }
};

export const getProductByIdApi = async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error.message);
        res.status(500).json({ error: 'Failed to fetch product by ID' });
    }
};