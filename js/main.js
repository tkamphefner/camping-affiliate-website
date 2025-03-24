/**
 * Camping Affiliate Hub - Main JavaScript
 * Author: Manus AI
 * Version: 1.0
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
    
    // Product image gallery
    const productThumbnails = document.querySelectorAll('.product-thumbnail');
    const mainProductImage = document.querySelector('.main-product-image');
    
    if (productThumbnails.length > 0 && mainProductImage) {
        productThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const newSrc = this.getAttribute('data-src');
                mainProductImage.src = newSrc;
                
                // Remove active class from all thumbnails
                productThumbnails.forEach(thumb => {
                    thumb.classList.remove('active');
                });
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
            });
        });
    }
    
    // Newsletter form validation
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showFormError(emailInput, 'Please enter a valid email address');
                return;
            }
            
            // If validation passes, show success message
            this.innerHTML = '<p class="success-message">Thank you for subscribing!</p>';
            
            // In a real implementation, you would send the form data to a server here
            console.log('Newsletter subscription:', email);
        });
    }
    
    // Affiliate link tracking
    const affiliateLinks = document.querySelectorAll('a[data-affiliate="true"]');
    
    if (affiliateLinks.length > 0) {
        affiliateLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Track click event
                trackAffiliateClick({
                    productId: this.getAttribute('data-product-id'),
                    productName: this.getAttribute('data-product-name'),
                    productPrice: this.getAttribute('data-product-price')
                });
            });
        });
    }
    
    // Lazy loading images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Helper functions

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @return {boolean} - True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show form error message
 * @param {HTMLElement} inputElement - The input element with error
 * @param {string} message - Error message to display
 */
function showFormError(inputElement, message) {
    // Remove any existing error messages
    const existingError = inputElement.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and append error message
    const errorElement = document.createElement('p');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    
    inputElement.parentNode.appendChild(errorElement);
    inputElement.classList.add('error');
    
    // Remove error styling when input changes
    inputElement.addEventListener('input', function() {
        this.classList.remove('error');
        const error = this.parentNode.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }, { once: true });
}

/**
 * Track affiliate link clicks
 * @param {Object} data - Product data
 */
function trackAffiliateClick(data) {
    // In a real implementation, this would send data to an analytics service
    console.log('Affiliate link clicked:', data);
    
    // Example of how you might track with Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'affiliate_click', {
            'event_category': 'Affiliate',
            'event_label': data.productName,
            'value': parseFloat(data.productPrice)
        });
    }
}

/**
 * Format price with currency symbol
 * @param {number|string} price - Price to format
 * @param {string} currency - Currency code (default: USD)
 * @return {string} - Formatted price
 */
function formatPrice(price, currency = 'USD') {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    });
    
    return formatter.format(price);
}
