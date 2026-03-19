import * as cartRepo from '../model/cart.repo.js';

export const getCart = async (userId) => {
    try {
        const items = await cartRepo.getCartItems(userId);
        const { total, itemCount } = await cartRepo.getCartTotal(userId);
        
        return {
            items,
            total,
            itemCount
        };
    } catch (error) {
        console.error('Error getting cart:', error);
        throw error;
    }
};

export const addToCart = async (userId, productId, quantity = 1) => {
    try {
        await cartRepo.addToCart(userId, productId, quantity);
        return await getCart(userId);
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

export const removeFromCart = async (userId, cartItemId) => {
    try {
        await cartRepo.removeFromCart(userId, cartItemId);
        return await getCart(userId);
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
};

export const updateCartItem = async (userId, cartItemId, quantity) => {
    try {
        await cartRepo.updateCartItem(userId, cartItemId, quantity);
        return await getCart(userId);
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
    }
};

export const clearCart = async (userId) => {
    try {
        await cartRepo.clearCart(userId);
        return await getCart(userId);
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};
