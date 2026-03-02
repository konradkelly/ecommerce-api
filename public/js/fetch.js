// async function fetchAllProducts() {
//     const response = await fetch('/api/products', {
//         headers: { Accept: 'application/json' }
//     });
//     if (!response.ok) {
//         throw new Error('Failed to fetch products');
//     }
//     const data = await response.json();
//     // data.products contains the array of all products
//     return data.products;
// }

// // when you visit /products, it should appear in the console tab of inspect elements, that means this file:
// // fetch.js has access to the entire products page and is ready to do some filtering stuff on the frontend.

// document.addEventListener('DOMContentLoaded', () => {
//     const productsFilterForm = document.querySelector('[data-products-filter-form]');
//     const productsGrid = document.querySelector('[data-products-grid]');
//     const productsCount = document.querySelector('[data-products-count]');

//     // Helper to build product card HTML
//     const buildProductCardMarkup = (product) => `
//         <article class="product-card">
//             <div class="product-card-media">
//                 <a href="/products/${product.id}" class="product-card-link-media" aria-label="View details for ${product.name}">
//                     <img src="${product.image_url || 'https://via.placeholder.com/640x420?text=No+Image'}" alt="${product.name}" loading="lazy" />
//                 </a>
//             </div>
//             <div class="product-card-body">
//                 <h2 class="product-card-title"><a href="/products/${product.id}" class="product-card-link">${product.name}</a></h2>
//                 <p class="product-card-description">${product.description}</p>
//                 <div class="product-card-meta">
//                     <span class="product-card-category">${product.category_name || 'Uncategorized'}</span>
//                     <strong class="product-card-price">$${Number(product.price).toFixed(2)}</strong>
//                 </div>
//                 <a href="/products/${product.id}" class="product-card-details">View Details</a>
//             </div>
//         </article>
//     `;

//     // Fetch and update products
//     async function fetchAndRenderProducts() {
//         const formData = new FormData(productsFilterForm);
//         const params = new URLSearchParams();
//         for (const [key, value] of formData.entries()) {
//             if (value.trim() !== '') params.set(key, value.trim());
//         }
//         const queryString = params.toString();
//         const apiUrl = queryString ? `/api/products?${queryString}` : '/api/products';

//         try {
//             const response = await fetch(apiUrl, { headers: { Accept: 'application/json' } });
//             if (!response.ok) throw new Error('Failed to fetch products');
//             const data = await response.json();
//             const products = Array.isArray(data.products) ? data.products : [];

//             // Update product grid
//             if (productsGrid) {
//                 productsGrid.innerHTML = products.map(buildProductCardMarkup).join('');
//             }
//             // Update count
//             if (productsCount) {
//                 productsCount.textContent = `${products.length} result(s)`;
//             }
//             // Handle empty state
//             let emptyMsg = document.querySelector('[data-products-empty]');
//             if (products.length === 0) {
//                 if (!emptyMsg) {
//                     emptyMsg = document.createElement('p');
//                     emptyMsg.setAttribute('data-products-empty', 'true');
//                     emptyMsg.textContent = 'No products matched your filters.';
//                     productsGrid?.insertAdjacentElement('afterend', emptyMsg);
//                 }
//             } else if (emptyMsg) {
//                 emptyMsg.remove();
//             }
//             // Update browser URL (optional)
//             const browserUrl = queryString ? `/products?${queryString}` : '/products';
//             window.history.replaceState({}, '', browserUrl);
//         } catch (error) {
//             console.error(error);
//         }
//     }

//     if (productsFilterForm) {
//         // Intercept form submit
//         productsFilterForm.addEventListener('submit', (event) => {
//             event.preventDefault();
//             fetchAndRenderProducts();
//         });

//         // Optionally, listen for input changes for instant filtering
//         productsFilterForm.addEventListener('input', () => {
//             fetchAndRenderProducts();
//         });
//     }
// });
