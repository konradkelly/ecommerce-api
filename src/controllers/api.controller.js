import {
    getAllProducts,
    getFilteredProducts,
    getProductById
} from '../services/default.service.js';
import imageService from '../services/imageService.js';
import * as cartService from '../services/cart.service.js';

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
        category: typeof query.category === 'string'
            ? query.category.trim()
            : (typeof query.catagory === 'string' ? query.catagory.trim() : undefined),
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

// =============================================
// Cart API Endpoints
// =============================================

export const getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error.message);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }
        
        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }
        
        const cart = await cartService.addToCart(req.user.id, productId, quantity);
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error adding to cart:', error.message);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        
        if (!cartItemId) {
            return res.status(400).json({ error: 'Cart item ID is required' });
        }
        
        const cart = await cartService.removeFromCart(req.user.id, cartItemId);
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error removing from cart:', error.message);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;
        
        if (!cartItemId) {
            return res.status(400).json({ error: 'Cart item ID is required' });
        }
        
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }
        
        const cart = await cartService.updateCartItem(req.user.id, cartItemId, quantity);
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error updating cart item:', error.message);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await cartService.clearCart(req.user.id);
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error clearing cart:', error.message);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
};