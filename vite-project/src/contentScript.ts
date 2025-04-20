// src/contentScript.ts
import { SiteConfig, ProductData } from './types';
import { siteConfigs } from './siteConfigs';

// Main function to run when content script loads
function detectAndProcessPage() {
  // 1. Page Detection
  const currentDomain = window.location.hostname;
  const siteConfig = getSiteConfigForDomain(currentDomain);
  
  if (!siteConfig) {
    console.log('BAXUS extension: Not a supported wine/whiskey retailer');
    return;
  }
  
  console.log(`BAXUS extension: Detected ${siteConfig.name}`);
  
  // 2. Check if we're on a product listing page
  if (isProductListingPage(siteConfig)) {
    // 3. Content Parsing & Batch Processing
    const products = extractProductsFromPage(siteConfig);
    
    if (products.length > 0) {
      console.log(`BAXUS extension: Found ${products.length} products`);
      
      // Send to background script for API comparison
      chrome.runtime.sendMessage({
        action: 'compareProducts',
        products: products
      });
    }
  }
}

// Helper function to get site configuration
function getSiteConfigForDomain(domain: string): SiteConfig | null {
  const cleanDomain = domain.replace(/^www\./, '');
  return siteConfigs.find(config => 
    cleanDomain.includes(config.domainMatch)
  ) || null;
}

// Check if current page is a product listing page based on URL patterns or page elements
function isProductListingPage(config: SiteConfig): boolean {
  console.log('BAXUS: Checking URL patterns:', config.listingUrlPatterns);
  console.log('BAXUS: Current pathname:', window.location.pathname);
  
  // Check URL patterns
  if (config.listingUrlPatterns && config.listingUrlPatterns.some(pattern => {
    const matches = window.location.pathname.match(pattern);
    console.log('BAXUS: URL pattern match result:', pattern, matches);
    return matches;
  })) {
    return true;
  }
  
  // Check for presence of listing elements
  console.log('BAXUS: Checking listing container selector:', config.listingContainerSelector);
  const listingContainer = config.listingContainerSelector ? 
    document.querySelector(config.listingContainerSelector) : null;
  console.log('BAXUS: Found listing container:', listingContainer);
  
  if (listingContainer) {
    return true;
  }
  
  return false;
}

// Extract product data from the page
function extractProductsFromPage(config: SiteConfig): ProductData[] {
  const products: ProductData[] = [];
  console.log('BAXUS: Using product selector:', config.productSelector);
  
  const productElements = document.querySelectorAll(config.productSelector);
  console.log('BAXUS: Found product elements:', productElements.length);
  
  if (productElements.length === 0) {
    console.log('BAXUS: No products found. Checking page structure:');
    console.log('BAXUS: Document body:', document.body.innerHTML.substring(0, 500) + '...');
  }
  
  productElements.forEach((element, index) => {
    try {
      console.log(`BAXUS: Processing product element ${index + 1}:`, element);
      
      const product = extractProductData(element, config);
      console.log(`BAXUS: Product ${index + 1} extracted data:`, {
        name: product.name,
        price: product.price,
        retailer: product.retailer,
        url: product.url,
        imageUrl: product.imageUrl,
        volume: product.volume,
        additionalData: product.additionalData
      });
      
      if (product.name && product.price > 0) {
        products.push(product);
      } else {
        console.log(`BAXUS: Product ${index + 1} invalid - missing name or price`);
      }
    } catch (error) {
      console.error(`BAXUS: Error extracting product ${index}:`, error);
    }
  });
  
  console.log('BAXUS: Total valid products extracted:', products.length);
  return products;
}

// Extract data from a single product element
function extractProductData(element: Element, config: SiteConfig): ProductData {
  const product: ProductData = {
    name: '',
    price: 0,
    retailer: config.name,
    url: '',
    imageUrl: ''
  };
  
  // Extract name
  const nameElement = element.querySelector(config.nameSelector);
  if (nameElement) {
    product.name = nameElement.textContent?.trim() || '';
  }
  
  // Extract price
  const priceElement = element.querySelector(config.priceSelector);
  if (priceElement) {
    const priceText = priceElement.textContent?.trim() || '';
    product.price = extractPriceValue(priceText);
  }
  
  // Extract URL
  const linkElement = element.querySelector(config.linkSelector) as HTMLAnchorElement;
  if (linkElement && linkElement.href) {
    product.url = linkElement.href;
  }
  
  // Extract image URL
  const imgElement = element.querySelector(config.imageSelector) as HTMLImageElement;
  if (imgElement && imgElement.src) {
    product.imageUrl = imgElement.src;
  }
  
  // Extract volume if selector exists
  if (config.volumeSelector) {
    const volumeElement = element.querySelector(config.volumeSelector);
    if (volumeElement) {
      product.volume = extractVolume(volumeElement.textContent || '');
    }
  }
  
  // Extract additional attributes if defined in config
  if (config.additionalSelectors) {
    product.additionalData = {};
    
    for (const [key, selector] of Object.entries(config.additionalSelectors)) {
      const additionalElement = element.querySelector(selector);
      if (additionalElement) {
        product.additionalData[key] = additionalElement.textContent?.trim() || '';
      }
    }
  }
  
  return product;
}

// Extract numeric price from text
function extractPriceValue(priceText: string): number {
  // Remove currency symbols and extract numeric value
  const priceMatch = priceText.match(/[\d,]+\.?\d*/);
  if (priceMatch) {
    // Convert to number, remove commas
    return parseFloat(priceMatch[0].replace(/,/g, ''));
  }
  return 0;
}

// Extract volume from text
function extractVolume(text: string): string {
  const volumeMatch = text.match(/\d+\s*ml|\d+\s*[lL]|\d+\.\d+\s*[lL]/);
  return volumeMatch ? volumeMatch[0] : '';
}

// Run the script
// Use a slight delay to ensure page is fully loaded
window.addEventListener('load', () => {
  setTimeout(detectAndProcessPage, 1000);
});

// Also set up a mutation observer to detect any dynamic content changes
// This helps when sites load products via AJAX
const observer = new MutationObserver(() => {
  if (window.BAXUS_OBSERVER_TIMEOUT) {
    clearTimeout(window.BAXUS_OBSERVER_TIMEOUT);
  }
  
  window.BAXUS_OBSERVER_TIMEOUT = setTimeout(() => {
    detectAndProcessPage();
  }, 1000);
});

// Start observing after initial page load
setTimeout(() => {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}, 2000);

// Add this to the global window object for TypeScript
declare global {
  interface Window {
    BAXUS_OBSERVER_TIMEOUT?: number;
  }
}