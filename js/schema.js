/* Schema markup for product pages */
function addProductSchema() {
  // Only run on product pages
  if (!document.querySelector('.product-overview')) {
    return;
  }
  
  // Get product data from the page
  const productName = document.querySelector('h1').innerText;
  const productImage = document.querySelector('.main-product-image').src;
  const productDescription = document.querySelector('.product-summary p').innerText;
  const productPrice = document.querySelector('.product-price').innerText.replace('$', '');
  const ratingText = document.querySelector('.product-rating span').innerText;
  const rating = parseFloat(ratingText.replace(/[()]/g, '').split('/')[0]);
  const reviewCount = 10; // Default value, should be replaced with actual count if available
  
  // Get affiliate link
  const affiliateLink = document.querySelector('a[data-affiliate="true"]').href;
  
  // Create schema markup
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": productName,
    "image": productImage,
    "description": productDescription,
    "brand": {
      "@type": "Brand",
      "name": productName.split(' ')[0] // Extract first word as brand name
    },
    "offers": {
      "@type": "Offer",
      "url": affiliateLink,
      "priceCurrency": "USD",
      "price": productPrice,
      "availability": "https://schema.org/InStock"
    },
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": rating,
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Camping Affiliate Hub"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    }
  };
  
  // Add schema to page
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(productSchema);
  document.head.appendChild(script);
}

/* Schema markup for category pages */
function addCategorySchema() {
  // Only run on category pages
  if (!document.querySelector('.category-header')) {
    return;
  }
  
  // Get category data from the page
  const categoryName = document.querySelector('.category-header h1').innerText;
  const categoryDescription = document.querySelector('.category-header p').innerText;
  const categoryUrl = window.location.href;
  
  // Create schema markup
  const categorySchema = {
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    "name": categoryName,
    "description": categoryDescription,
    "url": categoryUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": []
    }
  };
  
  // Add products to schema
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach((card, index) => {
    const productName = card.querySelector('.product-title').innerText;
    const productUrl = card.querySelector('a.btn').href;
    
    categorySchema.mainEntity.itemListElement.push({
      "@type": "ListItem",
      "position": index + 1,
      "url": productUrl,
      "name": productName
    });
  });
  
  // Add schema to page
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(categorySchema);
  document.head.appendChild(script);
}

/* Schema markup for homepage */
function addHomepageSchema() {
  // Only run on homepage
  if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    return;
  }
  
  // Create schema markup
  const websiteSchema = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "Camping Affiliate Hub",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": window.location.origin + "/search.html?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
  
  // Add organization schema
  const organizationSchema = {
    "@context": "https://schema.org/",
    "@type": "Organization",
    "name": "Camping Affiliate Hub",
    "url": window.location.origin,
    "logo": window.location.origin + "/images/logo.png",
    "sameAs": [
      "https://www.facebook.com/campingaffiliatehub",
      "https://www.twitter.com/campingaffhub",
      "https://www.instagram.com/campingaffiliatehub",
      "https://www.pinterest.com/campingaffiliatehub"
    ]
  };
  
  // Add breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": window.location.origin
      }
    ]
  };
  
  // Add schemas to page
  const websiteScript = document.createElement('script');
  websiteScript.type = 'application/ld+json';
  websiteScript.text = JSON.stringify(websiteSchema);
  document.head.appendChild(websiteScript);
  
  const organizationScript = document.createElement('script');
  organizationScript.type = 'application/ld+json';
  organizationScript.text = JSON.stringify(organizationSchema);
  document.head.appendChild(organizationScript);
  
  const breadcrumbScript = document.createElement('script');
  breadcrumbScript.type = 'application/ld+json';
  breadcrumbScript.text = JSON.stringify(breadcrumbSchema);
  document.head.appendChild(breadcrumbScript);
}

// Initialize schema markup when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  addProductSchema();
  addCategorySchema();
  addHomepageSchema();
});
