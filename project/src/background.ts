// src/background.ts
import { ProductData } from './types';
import { set, get } from 'idb-keyval';

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === 'compareProducts' && request.products) {
    compareWithBaxusAPI(request.products)
      .then(results => {
        // Store the result
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
  
  return true;
});

// Function to compare with BAXUS API
async function compareWithBaxusAPI(products: ProductData[]) {
  const CACHE_KEY = 'baxusApiCache';
  const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  try {
    // Try to get cached data
    const cached = await get(CACHE_KEY);
    const now = Date.now();

    let baxusData;
    if (cached && cached.data && (now - cached.timestamp < CACHE_TTL)) {
      baxusData = cached.data;
    } else {
      const response = await fetch('https://services.baxus.co/api/search/listings?from=0&size=3000&listed=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      baxusData = await response.json();
      // Store in IndexedDB
      await set(CACHE_KEY, { data: baxusData, timestamp: now });
    }

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
            iD: match._id,
            nftAddress: match._source.nftAddress
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
    return products.map(product => ({
      original: product,
      baxusMatch: "API error",
      savings: 0,
      error: true
    }));
  }
}

// Implement matching algorithm
function findBestMatch(product: ProductData, possibleMatches: any[]) {
  const normalizedProductName = product.name.toLowerCase().trim().replace(/\s+/g, ' ');

  //  regex to match ml, cl, l, liter, litre (with decimals)
  const productVolume = normalizedProductName.match(/(\d+(\.\d+)?)\s*(ml|cl|l|liter|litre)/i);

  let normalizedProductVolume = null;
  if (productVolume) {
    const value = parseFloat(productVolume[1]);
    const unit = productVolume[3].toLowerCase();
    if (unit === 'cl') normalizedProductVolume = value * 10;
    else if (unit === 'l' || unit === 'liter' || unit === 'litre') normalizedProductVolume = value * 1000;
    else normalizedProductVolume = value;
  }

  const match = possibleMatches.find(match => {
    const sourceName = (match._source.name || '').toLowerCase().trim().replace(/\s+/g, ' ');
    const attributesName = (match._source.attributes?.Name || '').toLowerCase().trim().replace(/\s+/g, ' ');

    const baseProductName = normalizedProductName.replace(/\s+\d+(\.\d+)?\s*(ml|cl|l|liter|litre)\b/i, '').trim();
    const baseSourceName = sourceName.replace(/\s+\d+(\.\d+)?\s*(ml|cl|l|liter|litre)\b/i, '').trim();
    const baseAttributesName = attributesName.replace(/\s+\d+(\.\d+)?\s*(ml|cl|l|liter|litre)\b/i, '').trim();

    // Updated regex for match volume
    const matchVolume = match._source.attributes?.Size?.match(/(\d+(\.\d+)?)\s*(ml|cl|l|liter|litre)/i);

    let normalizedMatchVolume = null;
    if (matchVolume) {
      const value = parseFloat(matchVolume[1]);
      const unit = matchVolume[3].toLowerCase();
      if (unit === 'cl') normalizedMatchVolume = value * 10;
      else if (unit === 'l' || unit === 'liter' || unit === 'litre') normalizedMatchVolume = value * 1000;
      else normalizedMatchVolume = value;
    }

    
    const nameMatches =
      baseSourceName.includes(baseProductName) ||
      baseProductName.includes(baseSourceName) ||
      baseAttributesName.includes(baseProductName) ||
      baseProductName.includes(baseAttributesName);

    // If no volume on the site, match if names match
    if (normalizedProductVolume === null) {
      return nameMatches;
    }
    const volumesAreComparable = normalizedProductVolume !== null && normalizedMatchVolume !== null;
    const volumeMatches = volumesAreComparable
      ? (normalizedProductVolume === normalizedMatchVolume)
      : false;

    return nameMatches && volumeMatches;
  });

  return match || "no matches found";
}