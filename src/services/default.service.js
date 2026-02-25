import { findAllProducts, findProductById, findRandomProducts, findFeaturedProduct } from '../model/default.repo.js';

export const getAllProducts = () => findAllProducts();

export const getProductById = (id) => findProductById(id);

export const getRandomProducts = (limit = 4) => findRandomProducts(limit);

export const getFeaturedProduct = () => findFeaturedProduct();

