async function fetchAllProducts() {
    const response = await fetch('/api/products', {
        headers: { Accept: 'application/json' }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    // data.products contains the array of all products
    return data.products;
}

// when you visit /products, it should appear in the console tab of inspect elements, that means this file:
// fetch.js has access to the entire products page and is ready to do some filtering stuff on the frontend.


document.addEventListener('DOMContentLoaded', () => {
    const productsFilterForm = document.querySelector('.products-filter-form');
    const productsGrid = document.querySelector('.products-grid');
    const productsCount = document.querySelector('.products-count');

    const updateHeaderCartCount = (count) => {
        const badge = document.getElementById('header-cart-count');
        if (badge) {
            badge.textContent = String(count ?? 0);
        }
    };

    const buildProductCardMarkup = (product) => `
        <article class="product-card">
            <div class="product-card-media">
                <a href="/products/${product.id}" class="product-card-link-media" aria-label="View details for ${product.name}">
                    <img src="${product.image_url || 'https://via.placeholder.com/640x420?text=No+Image'}" alt="${product.name}" loading="lazy" />
                </a>
            </div>
            <div class="product-card-body">
                <h2 class="product-card-title"><a href="/products/${product.id}" class="product-card-link">${product.name}</a></h2>
                <p class="product-card-description">${product.description}</p>
                <div class="product-card-meta">
                    <span class="product-card-category">${product.category_name || 'Uncategorized'}</span>
                    <strong class="product-card-price">$${Number(product.price).toFixed(2)}</strong>
                </div>
                <a href="/products/${product.id}" class="product-card-details">View Details</a>
                <button type="button" class="product-to-cart" data-add-to-cart data-product-id="${product.id}">Add to Cart</button>
            </div>
        </article>
    `;

    async function addProductToCart(productId, buttonEl) {
        try {
            if (buttonEl) {
                buttonEl.disabled = true;
                buttonEl.textContent = 'Adding...';
            }

            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ productId, quantity: 1 })
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to add item to cart');
            }

            updateHeaderCartCount(data.cart?.itemCount ?? 0);

            if (buttonEl) {
                buttonEl.textContent = 'Added!';
                setTimeout(() => {
                    buttonEl.textContent = 'Add to Cart';
                    buttonEl.disabled = false;
                }, 900);
            }
        } catch (error) {
            console.error(error);
            if (buttonEl) {
                buttonEl.textContent = 'Try Again';
                buttonEl.disabled = false;
            }
            alert('Unable to add this item to cart right now.');
        }
    }

    async function fetchAndRenderProducts() {
        const controls = productsFilterForm.querySelectorAll('input[name], select[name], textarea[name]');
        const params = new URLSearchParams();

        for (const control of controls) {
            const value = control.value.trim();
            if (value !== '') {
                params.set(control.name, value);
            }
        }

        const queryString = params.toString();
        const apiUrl = queryString ? `/api/products?${queryString}` : '/api/products';

        try {
            const response = await fetch(apiUrl, { headers: { Accept: 'application/json' } });
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            const products = Array.isArray(data.products) ? data.products : [];

            if (productsGrid) {
                productsGrid.innerHTML = products.length > 0
                    ? products.map(buildProductCardMarkup).join('')
                    : 'No products matched your filters.';
            }

            if (productsCount) {
                productsCount.textContent = `${products.length} result(s)`;
            }

            const browserUrl = queryString ? `/products?${queryString}` : '/products';
            window.history.replaceState({}, '', browserUrl);
        } catch (error) {
            console.error(error);
        }
    }

    if (productsFilterForm) {
        productsFilterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            fetchAndRenderProducts();
        });

        productsFilterForm.addEventListener('input', () => {
            fetchAndRenderProducts();
        });

        fetchAndRenderProducts();
    }

    if (productsGrid) {
        productsGrid.addEventListener('click', (event) => {
            const button = event.target.closest('[data-add-to-cart]');
            if (!button) return;

            event.preventDefault();
            const productId = Number(button.dataset.productId);
            if (!Number.isFinite(productId) || productId <= 0) {
                alert('Invalid product selected.');
                return;
            }

            addProductToCart(productId, button);
        });
    }
});