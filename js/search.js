/**
 * Camping Affiliate Hub - Search Functionality
 * Author: Manus AI
 * Version: 1.0
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    initSearch();
});

/**
 * Initialize search functionality
 */
function initSearch() {
    // Get search elements
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    
    // If we're on the search results page
    if (searchForm && searchInput && searchResults) {
        // Get search query from URL
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        
        // If there's a query, perform search
        if (query) {
            searchInput.value = query;
            performSearch(query, searchResults);
        }
    }
    
    // Add event listener to search form
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query) {
                // If we're already on the search page, perform search
                if (searchResults) {
                    performSearch(query, searchResults);
                    // Update URL without reloading
                    const url = new URL(window.location);
                    url.searchParams.set('q', query);
                    window.history.pushState({}, '', url);
                } else {
                    // Navigate to search page
                    window.location.href = '/search.html?q=' + encodeURIComponent(query);
                }
            }
        });
    }
}

/**
 * Perform search and display results
 * @param {string} query - Search query
 * @param {HTMLElement} resultsContainer - Container for search results
 */
async function performSearch(query, resultsContainer) {
    // Show loading indicator
    resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
    
    try {
        // Fetch product data
        const productData = await fetchProductData();
        
        // Search products
        const results = searchProducts(query, productData);
        
        // Display results
        displaySearchResults(results, query, resultsContainer);
    } catch (error) {
        console.error('Error performing search:', error);
        resultsContainer.innerHTML = '<div class="error-message">An error occurred while searching. Please try again.</div>';
    }
}

/**
 * Fetch product data from JSON file
 * @returns {Promise<Array>} - Array of product objects
 */
async function fetchProductData() {
    try {
        const response = await fetch('/js/data/products.json');
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error fetching product data:', error);
        throw error;
    }
}

/**
 * Search products based on query
 * @param {string} query - Search query
 * @param {Array} products - Array of product objects
 * @returns {Array} - Array of matching product objects
 */
function searchProducts(query, products) {
    // Normalize query
    const normalizedQuery = query.toLowerCase();
    const queryTerms = normalizedQuery.split(' ').filter(term => term.length > 2);
    
    // Filter products
    return products.filter(product => {
        // Check name
        if (product.name.toLowerCase().includes(normalizedQuery)) {
            return true;
        }
        
        // Check category
        if (product.category.toLowerCase().includes(normalizedQuery)) {
            return true;
        }
        
        // Check description
        if (product.description.toLowerCase().includes(normalizedQuery)) {
            return true;
        }
        
        // Check if product matches any query term
        for (const term of queryTerms) {
            if (
                product.name.toLowerCase().includes(term) ||
                product.category.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term)
            ) {
                return true;
            }
            
            // Check features
            if (product.features && product.features.some(feature => feature.toLowerCase().includes(term))) {
                return true;
            }
            
            // Check pros
            if (product.pros && product.pros.some(pro => pro.toLowerCase().includes(term))) {
                return true;
            }
        }
        
        return false;
    });
}

/**
 * Display search results
 * @param {Array} results - Array of matching product objects
 * @param {string} query - Search query
 * @param {HTMLElement} container - Container for search results
 */
function displaySearchResults(results, query, container) {
    // Clear container
    container.innerHTML = '';
    
    // Display search info
    const searchInfo = document.createElement('div');
    searchInfo.className = 'search-info';
    searchInfo.innerHTML = `<h2>Search Results for "${query}"</h2>
                           <p>${results.length} result${results.length !== 1 ? 's' : ''} found</p>`;
    container.appendChild(searchInfo);
    
    // If no results
    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `<p>No products found matching "${query}".</p>
                              <p>Try using different keywords or browse our <a href="index.html">categories</a>.</p>`;
        container.appendChild(noResults);
        return;
    }
    
    // Create results grid
    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'products-grid';
    
    // Add each result
    results.forEach(product => {
        const productCard = createProductCard(product);
        resultsGrid.appendChild(productCard);
    });
    
    container.appendChild(resultsGrid);
}

/**
 * Create product card element
 * @param {Object} product - Product object
 * @returns {HTMLElement} - Product card element
 */
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    // Create image
    const productImg = document.createElement('div');
    productImg.className = 'product-img';
    productImg.style.backgroundImage = `url('${product.image || 'images/placeholder.jpg'}')`;
    
    // Create content
    const productContent = document.createElement('div');
    productContent.className = 'product-content';
    
    // Create title
    const productTitle = document.createElement('h3');
    productTitle.className = 'product-title';
    productTitle.textContent = product.name;
    
    // Create price
    const productPrice = document.createElement('div');
    productPrice.className = 'product-price';
    productPrice.textContent = `$${product.price.toFixed(2)}`;
    
    // Create rating
    const productRating = document.createElement('div');
    productRating.className = 'product-rating';
    
    // Add stars
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        productRating.appendChild(star);
    }
    
    if (hasHalfStar) {
        const halfStar = document.createElement('i');
        halfStar.className = 'fas fa-star-half-alt';
        productRating.appendChild(halfStar);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        const emptyStar = document.createElement('i');
        emptyStar.className = 'far fa-star';
        productRating.appendChild(emptyStar);
    }
    
    const ratingText = document.createElement('span');
    ratingText.textContent = `(${product.rating}/5)`;
    productRating.appendChild(ratingText);
    
    // Create description
    const productDescription = document.createElement('p');
    productDescription.className = 'product-description';
    productDescription.textContent = product.description;
    
    // Create buttons
    const productButtons = document.createElement('div');
    productButtons.className = 'product-buttons';
    
    // Create review button
    const reviewButton = document.createElement('a');
    reviewButton.href = `pages/product-pages/${product.id}.html`;
    reviewButton.className = 'btn';
    reviewButton.textContent = 'Read Review';
    
    // Create affiliate button
    const affiliateButton = document.createElement('a');
    affiliateButton.href = product.affiliateLink;
    affiliateButton.className = 'btn btn-secondary';
    affiliateButton.setAttribute('data-affiliate', 'true');
    affiliateButton.setAttribute('data-product-id', product.id);
    affiliateButton.setAttribute('data-product-name', product.name);
    affiliateButton.setAttribute('data-product-price', product.price);
    affiliateButton.setAttribute('data-product-category', product.category);
    affiliateButton.textContent = 'View on Amazon';
    
    // Append elements
    productButtons.appendChild(reviewButton);
    productButtons.appendChild(affiliateButton);
    
    productContent.appendChild(productTitle);
    productContent.appendChild(productPrice);
    productContent.appendChild(productRating);
    productContent.appendChild(productDescription);
    productContent.appendChild(productButtons);
    
    productCard.appendChild(productImg);
    productCard.appendChild(productContent);
    
    return productCard;
}
