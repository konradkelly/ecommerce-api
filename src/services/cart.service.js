import * as cartRepo from '../model/cart.repo.js';

const MAX_CART_ITEM_QUANTITY = 5;

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
        if (quantity > MAX_CART_ITEM_QUANTITY) {
            throw new Error(`You can add a maximum of ${MAX_CART_ITEM_QUANTITY} of the same item to your cart.`);
        }

        const cart = await getCart(userId);
        const existingItem = cart.items.find((item) => Number(item.product_id) === Number(productId));
        const currentQuantity = existingItem ? Number(existingItem.quantity) : 0;

        if (currentQuantity + quantity > MAX_CART_ITEM_QUANTITY) {
            throw new Error(`Cart item quantity cannot exceed ${MAX_CART_ITEM_QUANTITY}.`);
        }

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
        if (quantity > MAX_CART_ITEM_QUANTITY) {
            throw new Error(`Cart item quantity cannot exceed ${MAX_CART_ITEM_QUANTITY}.`);
        }

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
