// Product Loader Script
document.addEventListener('DOMContentLoaded', function() {
    // Load products from JSON file
    fetch('/js/data/products.json')
        .then(response => response.json())
        .then(data => {
            // Get the current page category from the URL
            const currentPath = window.location.pathname;
            let currentCategory = '';
            
            if (currentPath.includes('tents.html')) {
                currentCategory = 'tents';
            } else if (currentPath.includes('hiking-gear.html')) {
                currentCategory = 'hiking-gear';
            } else if (currentPath.includes('furniture.html')) {
                currentCategory = 'furniture';
            } else if (currentPath.includes('lights-lanterns.html') || currentPath.includes('lighting.html')) {
                currentCategory = 'lighting';
            } else if (currentPath.includes('water-filtration.html')) {
                currentCategory = 'water';
            } else if (currentPath.includes('camping-cookware.html')) {
                currentCategory = 'cooking';
            }
            
            // Filter products by category if on a category page
            let productsToDisplay = data.products;
            if (currentCategory) {
                productsToDisplay = data.products.filter(product => product.category === currentCategory);
            }
            
            // Find product grid on the page
            const productGrid = document.querySelector('.products-grid');
            if (productGrid && productsToDisplay.length > 0) {
                // Clear existing products
                productGrid.innerHTML = '';
                
                // Add products to the grid
                productsToDisplay.forEach(product => {
                    const productCard = createProductCard(product);
                    productGrid.appendChild(productCard);
                });
            }
        })
        .catch(error => console.error('Error loading products:', error));
});

// Function to create a product card element
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    // Format price
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(product.price);
    
    // Create star rating HTML
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    // Build product card HTML
    productCard.innerHTML = `
        <div class="product-img" style="background-image: url('${product.image}');"></div>
        <div class="product-content">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">${formattedPrice}</div>
            <div class="product-rating">
                ${starsHTML}
                <span>(${product.rating}/5)</span>
            </div>
            <p class="product-description">${product.description}</p>
            <div class="product-buttons">
                <a href="../product-pages/${product.id}.html" class="btn">Read Review</a>
                <a href="${product.affiliateLink}" class="btn btn-secondary" data-affiliate="true" 
                   data-product-id="${product.id}" 
                   data-product-name="${product.name}" 
                   data-product-price="${product.price}" 
                   data-product-category="${product.category}">View on Amazon</a>
            </div>
        </div>
    `;
    
    return productCard;
}
