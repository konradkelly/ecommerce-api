/* global document, window */

const productsFilterForm = document.querySelector('[data-products-filter-form]');

if (productsFilterForm) {
	const productsGrid = document.querySelector('[data-products-grid]');
	const productsCount = document.querySelector('[data-products-count]');

	const escapeHtml = (value) => String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

	const buildProductCardMarkup = (product) => {
		const safeName = escapeHtml(product.name || 'Product');
		const safeDescription = escapeHtml(product.description || '');
		const safeCategory = escapeHtml(product.category_name || 'Uncategorized');
		const safePrice = Number(product.price || 0).toFixed(2);
		const safeImage = escapeHtml(product.image_url || 'https://via.placeholder.com/640x420?text=No+Image');
		const productPath = `/products/${product.id}`;

		return `
			<article class="product-card">
				<div class="product-card-media">
					<a href="${productPath}" class="product-card-link-media" aria-label="View details for ${safeName}">
						<img src="${safeImage}" alt="${safeName}" loading="lazy" />
					</a>
				</div>
				<div class="product-card-body">
					<h2 class="product-card-title"><a href="${productPath}" class="product-card-link">${safeName}</a></h2>
					<p class="product-card-description">${safeDescription}</p>
					<div class="product-card-meta">
						<span class="product-card-category">${safeCategory}</span>
						<strong class="product-card-price">$${safePrice}</strong>
					</div>
					<a href="${productPath}" class="product-card-details">View Details</a>
				</div>
			</article>
		`;
	};

	const updateEmptyState = (products) => {
		const existingEmpty = document.querySelector('[data-products-empty]');

		if (products.length === 0) {
			if (!existingEmpty) {
				const emptyMessage = document.createElement('p');
				emptyMessage.setAttribute('data-products-empty', 'true');
				emptyMessage.textContent = 'No products matched your filters.';
				productsGrid?.insertAdjacentElement('afterend', emptyMessage);
			}
			return;
		}

		if (existingEmpty) {
			existingEmpty.remove();
		}
	};

	productsFilterForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		const formData = new FormData(productsFilterForm);
		const params = new URLSearchParams();

		for (const [key, value] of formData.entries()) {
			const normalized = String(value).trim();
			if (normalized !== '') {
				params.set(key, normalized);
			}
		}

		const queryString = params.toString();
		const apiUrl = queryString ? `/api/products?${queryString}` : '/api/products';

		try {
			const response = await fetch(apiUrl, {
				headers: { Accept: 'application/json' }
			});

			if (!response.ok) {
				throw new Error('Failed to fetch products');
			}

			const data = await response.json();
			const products = Array.isArray(data.products) ? data.products : [];

			if (productsGrid) {
				productsGrid.innerHTML = products.map(buildProductCardMarkup).join('');
			}

			if (productsCount) {
				productsCount.textContent = `${products.length} result(s)`;
			}

			updateEmptyState(products);

			const browserUrl = queryString ? `/products?${queryString}` : '/products';
			window.history.replaceState({}, '', browserUrl);
		} catch (error) {
			console.error(error);
			productsFilterForm.submit();
		}
	});
}