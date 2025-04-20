// src/background.ts
import { ProductData } from './types';

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === 'compareProducts' && request.products) {
    compareWithBaxusAPI(request.products)
      .then(results => {
        // Store the results
        chrome.storage.local.set({ 
          comparisonResults: results,
          lastUpdated: new Date().toISOString()
        });
        
        // Update badge if there are savings
        const savingsCount = results.filter(r => r.savings > 0).length;
        if (savingsCount > 0 && sender.tab?.id) {
          chrome.action.setBadgeText({ 
            text: savingsCount.toString(),
            tabId: sender.tab.id
          });
          chrome.action.setBadgeBackgroundColor({ 
            color: '#4CAF50',
            tabId: sender.tab.id
          });
        }
      })
      .catch(error => {
        console.error('Error comparing with BAXUS API:', error);
      });
  }
  
  // Must return true if response is async
  return true;
});

// Function to compare with BAXUS API
async function compareWithBaxusAPI(products: ProductData[]) {
  try {
    const response = await fetch('https://services.baxus.co/api/search/listings?from=0&size=20&listed=true', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const baxusData = await response.json();
    
    // Match and calculate savings
    return products.map(product => {
      const match = findBestMatch(product, baxusData);
      if (match) {
        const savings = product.price - match._source.price;
        return {
          original: product,
          baxusMatch: match._source,
          savings: savings > 0 ? savings : 0
        };
      }
      return {
        original: product,
        baxusMatch: null,
        savings: 0
      };
    });
  } catch (error) {
    console.error('API error:', error);
    return products.map(product => ({
      original: product,
      baxusMatch: null,
      savings: 0,
      error: true
    }));
  }
}

// Implement matching algorithm
function findBestMatch(product: ProductData, possibleMatches: any[]) {
  return possibleMatches.find(match => 
    match._source.name.toLowerCase().includes(product.name.toLowerCase()) ||
    match._source.attributes?.Name?.toLowerCase().includes(product.name.toLowerCase())
  );
}