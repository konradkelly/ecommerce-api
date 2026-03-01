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
fetchAllProducts()
    .then(products => {    
        console.log(products);  
    })
    .catch(error => {
        console.error(error);
    });