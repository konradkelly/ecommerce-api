import {
	findAllProducts,
	findFilteredProducts,
	findRandomProducts,
	findFeaturedProduct,
	findAllCategories,
	findProductById
} from '../model/default.repo.js';

export const getAllProducts = () => findAllProducts();

export const getFilteredProducts = (filters) => findFilteredProducts(filters);

export const getAllCategories = () => findAllCategories();

export const getProductById = (id) => findProductById(id);

export const getRandomProducts = (limit = 4) => findRandomProducts(limit);

export const getFeaturedProduct = () => findFeaturedProduct();

