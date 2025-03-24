// Amazon Affiliate Link Utility for Camping Affiliate Hub
// This file provides utility functions for creating and tracking Amazon affiliate links

/**
 * Generate an Amazon affiliate link with the proper format
 * @param {string} productId - Amazon product ID/ASIN
 * @param {string} affiliateTag - Amazon affiliate tag (default: kamphefner-20)
 * @return {string} - Formatted Amazon affiliate link
 */
function generateAffiliateLink(productId, affiliateTag = 'kamphefner-20') {
    if (!productId) {
        console.error('Product ID is required to generate affiliate link');
        return '';
    }
    
    return `https://www.amazon.com/dp/${productId}/ref=nosim?tag=${affiliateTag}`;
}

/**
 * Track affiliate link click
 * @param {Object} productData - Product data for tracking
 * @param {string} productData.id - Product ID/ASIN
 * @param {string} productData.name - Product name
 * @param {string} productData.category - Product category
 * @param {number} productData.price - Product price
 */
function trackAffiliateClick(productData) {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
        return;
    }
    
    // Log click for analytics
    console.log('Affiliate link clicked:', productData);
    
    // Send tracking data to backend API
    fetch('/api/track-affiliate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productId: productData.id,
            productName: productData.name,
            category: productData.category,
            price: productData.price
        })
    })
    .then(response => response.json())
    .catch(error => console.error('Error tracking affiliate click:', error));
    
    // Track with Google Analytics if available
    if (typeof gtag === 'function') {
        gtag('event', 'affiliate_click', {
            'event_category': 'Affiliate',
            'event_label': productData.name,
            'value': parseFloat(productData.price)
        });
    }
}

/**
 * Create an affiliate link element with tracking
 * @param {Object} product - Product data
 * @param {string} linkText - Text to display for the link
 * @param {string} className - CSS class for styling
 * @return {HTMLElement} - Anchor element with affiliate link
 */
function createAffiliateElement(product, linkText, className = 'affiliate-link') {
    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
        return null;
    }
    
    const link = document.createElement('a');
    link.href = product.affiliateLink || generateAffiliateLink(product.id);
    link.textContent = linkText || 'View on Amazon';
    link.className = className;
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'nofollow noopener');
    link.setAttribute('data-affiliate', 'true');
    link.setAttribute('data-product-id', product.id);
    link.setAttribute('data-product-name', product.name);
    link.setAttribute('data-product-price', product.price);
    
    // Add click event listener for tracking
    link.addEventListener('click', function(e) {
        trackAffiliateClick(product);
    });
    
    return link;
}

/**
 * Initialize all affiliate links on a page
 */
function initAffiliateLinks() {
    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
        return;
    }
    
    // Find all affiliate links
    const affiliateLinks = document.querySelectorAll('a[data-affiliate="true"]');
    
    // Add click tracking to each link
    affiliateLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const productData = {
                id: this.getAttribute('data-product-id'),
                name: this.getAttribute('data-product-name'),
                price: this.getAttribute('data-product-price'),
                category: this.getAttribute('data-product-category') || 'unknown'
            };
            
            trackAffiliateClick(productData);
        });
    });
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateAffiliateLink,
        trackAffiliateClick,
        createAffiliateElement,
        initAffiliateLinks
    };
}

// Auto-initialize when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initAffiliateLinks);
}
