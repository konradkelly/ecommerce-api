import { getDbPool } from './db.connect.js';

// Get or create cart for a user
export const getOrCreateCart = async (userId) => {
    try {
        const db = getDbPool();
        const [rows] = await db.query(
            'SELECT id FROM carts WHERE user_id = ?',
            [userId]
        );
        
        if (rows.length > 0) {
            return rows[0].id;
        }
        
        // Create new cart if it doesn't exist
        const [result] = await db.query(
            'INSERT INTO carts (user_id) VALUES (?)',
            [userId]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error getting or creating cart:', error);
        throw error;
    }
};

// Get all cart items for a user
export const getCartItems = async (userId) => {
    try {
        const db = getDbPool();
        const [rows] = await db.query(
            `SELECT 
                ci.id,
                ci.product_id,
                p.name,
                p.description,
                p.image_url,
                ci.quantity,
                ci.price,
                (ci.quantity * ci.price) as subtotal
            FROM cart_items ci
            JOIN carts c ON ci.cart_id = c.id
            JOIN products p ON ci.product_id = p.id
            WHERE c.user_id = ?
            ORDER BY ci.added_at DESC
        `, [userId]);
        
        return rows;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

// Add item to cart
export const addToCart = async (userId, productId, quantity = 1) => {
    try {
        const db = getDbPool();
        // Get the cart (create if doesn't exist)
        const cartId = await getOrCreateCart(userId);
        
        // Get product price
        const [productRows] = await db.query(
            'SELECT price FROM products WHERE id = ?',
            [productId]
        );
        
        if (productRows.length === 0) {
            throw new Error('Product not found');
        }
        
        const price = productRows[0].price;
        
        // Check if product already in cart
        const [existingItem] = await db.query(
            'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [cartId, productId]
        );
        
        if (existingItem.length > 0) {
            // Update quantity
            const newQuantity = existingItem[0].quantity + quantity;
            await db.query(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [newQuantity, existingItem[0].id]
            );
        } else {
            // Insert new cart item
            await db.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [cartId, productId, quantity, price]
            );
        }
        
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

// Update cart item quantity
export const updateCartItem = async (userId, cartItemId, quantity) => {
    try {
        const db = getDbPool();
        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            await db.query(
                `DELETE FROM cart_items 
                 WHERE id = ? AND cart_id IN (
                     SELECT id FROM carts WHERE user_id = ?
                 )`,
                [cartItemId, userId]
            );
        } else {
            await db.query(
                `UPDATE cart_items 
                 SET quantity = ? 
                 WHERE id = ? AND cart_id IN (
                     SELECT id FROM carts WHERE user_id = ?
                 )`,
                [quantity, cartItemId, userId]
            );
        }
        
        return true;
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
    }
};

// Remove item from cart
export const removeFromCart = async (userId, cartItemId) => {
    try {
        const db = getDbPool();
        const result = await db.query(
            `DELETE FROM cart_items 
             WHERE id = ? AND cart_id IN (
                 SELECT id FROM carts WHERE user_id = ?
             )`,
            [cartItemId, userId]
        );
        
        return result[0].affectedRows > 0;
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
};

// Clear entire cart
export const clearCart = async (userId) => {
    try {
        const db = getDbPool();
        await db.query(
            `DELETE FROM cart_items 
             WHERE cart_id IN (
                 SELECT id FROM carts WHERE user_id = ?
             )`,
            [userId]
        );
        
        return true;
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};

// Get cart total
export const getCartTotal = async (userId) => {
    try {
        const db = getDbPool();
        const [rows] = await db.query(
            `SELECT 
                SUM(quantity * price) as total,
                COUNT(*) as item_count
             FROM cart_items ci
             JOIN carts c ON ci.cart_id = c.id
             WHERE c.user_id = ?`,
            [userId]
        );
        
        return {
            total: rows[0]?.total || 0,
            itemCount: rows[0]?.item_count || 0
        };
    } catch (error) {
        console.error('Error getting cart total:', error);
        throw error;
    }
};
