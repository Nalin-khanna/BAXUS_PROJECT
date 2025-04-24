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
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const baxusData = await response.json();
    
    // Match and calculate savings
    return products.map(product => {
      const match = findBestMatch(product, baxusData);
      if (match && typeof match !== 'string' && match._source) {
        const savings = product.price - match._source.price;
        return {
          original: product,
          baxusMatch: {
            name: match._source.name,
            price: match._source.price,
            imageUrl: match._source.imageUrl,
            attributes: match._source.attributes,
            iD: match._id  ,
            nftAddress : match._source.nftAddress
          },
          savings: savings > 0 ? savings : 0
        };
      }
      return {
        original: product,
        baxusMatch: "no matches found",
        savings: 0
      };
    });
  } catch (error) {
    console.error('API error:', error);
    return products.map(product => ({
      original: product,
      baxusMatch: "no matches found", // Changed from null to "no matches found"
      savings: 0,
      error: true
    }));
  }
}

// Implement matching algorithm
function findBestMatch(product: ProductData, possibleMatches: any[]) {
  const normalizedProductName = product.name.toLowerCase().trim().replace(/\s+/g, ' ');
  
  const match = possibleMatches.find(match => {
    const sourceName = (match._source.name || '').toLowerCase().trim().replace(/\s+/g, ' ');
    const attributesName = (match._source.attributes?.Name || '').toLowerCase().trim().replace(/\s+/g, ' ');
    
  
    const baseProductName = normalizedProductName.replace(/\s+\d+\s*ml\b|\s+\d+\s*cl\b/i, '').trim();
    const baseSourceName = sourceName.replace(/\s+\d+\s*ml\b|\s+\d+\s*cl\b/i, '').trim();
    const baseAttributesName = attributesName.replace(/\s+\d+\s*ml\b|\s+\d+\s*cl\b/i, '').trim();
    
   
    const productVolume = normalizedProductName.match(/(\d+)\s*(ml|cl)/i);
    const matchVolume = match._source.attributes?.Size?.match(/(\d+)\s*(ml|cl)/i);
    
    // Convert volumes to ml for comparison (if in cl)
    const normalizedProductVolume = productVolume ? 
      (productVolume[2].toLowerCase() === 'cl' ? parseInt(productVolume[1]) * 10 : parseInt(productVolume[1])) : null;
    const normalizedMatchVolume = matchVolume ? 
      (matchVolume[2].toLowerCase() === 'cl' ? parseInt(matchVolume[1]) * 10 : parseInt(matchVolume[1])) : null;
    
    // More flexible name matching
    const nameMatches = 
      baseSourceName.includes(baseProductName) || 
      baseProductName.includes(baseSourceName) ||
      baseAttributesName.includes(baseProductName) ||
      baseProductName.includes(baseAttributesName);
    
    // Volume matching is always required when volumes are present
    const volumeMatches = !normalizedProductVolume || !normalizedMatchVolume || 
                         normalizedProductVolume === normalizedMatchVolume;
    
    return nameMatches && volumeMatches;
  });
  
  return match || "no matches found";
}