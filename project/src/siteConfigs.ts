import { SiteConfig } from './types';

export const siteConfigs: SiteConfig[] = [
  {
    name: 'The Whisky Exchange',
    domainMatch: 'thewhiskyexchange.com',
    productSelector: '.product-grid__item',
    nameSelector: '.product-card__name',
    priceSelector: '.product-card__price',
    linkSelector: 'a.product-card',
    imageSelector: '.product-card__image img',
    volumeSelector: '.product-card__meta',
    listingContainerSelector: '.product-grid',
    listingUrlPatterns: [/\/c\//, /\/p\//, /\/search\//],
    additionalSelectors: {
      age: '.product-card__meta',
      region: '.product-card__meta'
    }
  },
 
  {
    name: 'Whisky Shop USA',
    domainMatch: 'whiskyshopusa.com',
    productSelector: 'li.product article.card',
    nameSelector: '.card-title a',
    priceSelector: 'span[data-product-price-without-tax].price--withoutTax',
    linkSelector: '.card-title a',
    imageSelector: 'a.image-link.desktop img.card-image.primary',
    listingContainerSelector: '.product-grid',
    listingUrlPatterns: [
      /\/american-whiskey\//,
      /\/irish-whiskey\//,
      /\/scotch-whisky\//,
      /\/japanese-whisky\//,
      /\/blended-scotch\//,
      /\/rum\//,
      /\/beer\//,
      /\/gins-liqueurs\//,
      /\/world-whisk-e-y\//,
      /\/single-grain-scotch\//,
      /\/single-malt-scotch\//,
      /\/large-bottles\//,
      /\/search\.php\?.*section=product/  
    ],
    additionalSelectors: {
      brand: '.card-text.brand a.brand-link',
      sku: '.card-text.sku',
      rating: '.rating--small'
    }
  },
  {
    name: 'Old Town Tequila',
    domainMatch: 'oldtowntequila.com',
    productSelector: 'li.product',
    nameSelector: '.card-title a',
    priceSelector: 'span.price.price--withoutTax.price--main',
    linkSelector: '.card-title a',
    imageSelector: '.card-image img',
    listingContainerSelector: '.productGrid',
    listingUrlPatterns: [
      /\/[^\/]+\/?(?:\?.*)?$/
    ],
    additionalSelectors: {
      brand: '.card-text--brand',
      description: '.card-text--summary',
      volume: '.card-title'
    }
  },
  
  {
    name: 'PB Express Liquor',
    domainMatch: 'pbexpressliquor.com',
    productSelector: '.product.js-product',
    nameSelector: '.product__title',
    priceSelector: '.product__price-price .money',
    linkSelector: 'a.product-link',
    imageSelector: '.product__img.lazyloaded',
    listingContainerSelector: '.collection__products',
    listingUrlPatterns: [
      /\/(products|collections|search).*(?:\?.*)?$/ 
    ],
    additionalSelectors: {
      brand: '.product__vendor',
      description: '.product__description',
      volume: '.product__title'
    }
  },
 
  {
    name: 'Banks Wines & Spirits',
    domainMatch: 'bankswinesandspirits.com',
    productSelector: '.product-card__details',
    nameSelector: '.product-card__title',
    priceSelector: '.product-card__price-price .money',
    linkSelector: '.product-card__title a', // Adjust if product name is not a link
    imageSelector: '.product-card__image img', // Adjust based on actual HTML
    listingContainerSelector: '.product-grid, .collection', // Adjust based on actual HTML
    listingUrlPatterns: [
      /bankswinesandspirits\.com\/collections\//,
      /bankswinesandspirits\.com\/products\//,
      /bankswinesandspirits\.com\/search\?/,
      /bankswinesandspirits\.com\//
    ],
    additionalSelectors: {
      // Add more if needed, e.g. brand, description, volume
    }
  },
  
  {
    name: "ReserveBar",
    domainMatch: "reservebar.com",
    productSelector: "div[data-testid='product-card']",
    nameSelector: "h2.uppercase",
    priceSelector: "div.flex.h-6.items-center.justify-between.md\\:h-8 h2",
    linkSelector: "a[data-sentry-element='Link']",
    imageSelector: "img[data-sentry-element='Image']",
    volumeSelector: "span.text-\\[10px\\]",
    listingContainerSelector: "div[data-sentry-element='CardHeader']",
    listingUrlPatterns: [
      /reservebar\.com\/collections\//,
      /reservebar\.com\/products\//,
      /reservebar\.com\/search\?/,
      /reservebar\.com\//
    ],
    additionalSelectors: {
      // Add more if needed, e.g. brand, description
    }
  },
  {
    name: 'Whisky Shop USA',
    domainMatch: 'whiskyshopusa.com',
    productSelector: 'li.product article.card',
    nameSelector: '.card-title a',
    priceSelector: 'span[data-product-price-without-tax].price--withoutTax',
    linkSelector: '.card-title a',
    imageSelector: 'a.image-link.desktop img.card-image.primary',
    listingContainerSelector: '.product-grid',
    listingUrlPatterns: [
      /\/american-whiskey\//,
      /\/irish-whiskey\//,
      /\/scotch-whisky\//,
      /\/japanese-whisky\//,
      /\/blended-scotch\//,
      /\/rum\//,
      /\/beer\//,
      /\/gins-liqueurs\//,
      /\/world-whisk-e-y\//,
      /\/single-grain-scotch\//,
      /\/single-malt-scotch\//,
      /\/large-bottles\//,
      /\/search\.php\?.*section=product/  
    ],
    additionalSelectors: {
      brand: '.card-text.brand a.brand-link',
      sku: '.card-text.sku',
      rating: '.rating--small'
    }
  },
  {
    name: 'Old Town Tequila',
    domainMatch: 'oldtowntequila.com',
    productSelector: 'li.product',
    nameSelector: '.card-title a',
    priceSelector: 'span.price.price--withoutTax.price--main',
    linkSelector: '.card-title a',
    imageSelector: '.card-image img',
    listingContainerSelector: '.productGrid',
    listingUrlPatterns: [
      /\/[^\/]+\/?(?:\?.*)?$/
    ],
    additionalSelectors: {
      brand: '.card-text--brand',
      description: '.card-text--summary',
      volume: '.card-title'
    }
  },
  
  {
    name: 'PB Express Liquor',
    domainMatch: 'pbexpressliquor.com',
    productSelector: '.product.js-product',
    nameSelector: '.product__title',
    priceSelector: '.product__price-price .money',
    linkSelector: 'a.product-link',
    imageSelector: '.product__img.lazyloaded',
    listingContainerSelector: '.collection__products',
    listingUrlPatterns: [
      /\/(products|collections|search).*(?:\?.*)?$/ 
    ],
    additionalSelectors: {
      brand: '.product__vendor',
      description: '.product__description',
      volume: '.product__title'
    }
  },
  {
    name: 'Flask Fine Wines',
    domainMatch: 'flaskfinewines.com',
    productSelector: 'product-grid-item',
    nameSelector: '.grid-product__title',
    priceSelector: '.grid-product__price--current',
    linkSelector: '.grid-item__link',
    imageSelector: '.grid-product__image-wrap img',
    listingContainerSelector: '.grid',
    listingUrlPatterns: [
      /\/collections\//,
      /\/products\//,
      /\/search\?/
    ],
    additionalSelectors: {
      
    }
  },
  {
    name: 'The Whisky Vault',
    domainMatch: 'thewhiskyvault.com',
    productSelector: '.aerial-product-item',
    nameSelector: '.product-name a',
    priceSelector: '.aerial-product-item_price',
    linkSelector: '.product-name a',
    imageSelector: '.aerial-product-item_header img',
    listingContainerSelector: '.productlist', 
    listingUrlPatterns: [
      /thewhiskyvault\.com\/.*-c\.asp$/,   
      /thewhiskyvault\.com\/.*-p\.asp$/,   
      /thewhiskyvault\.com\/search\.asp/,  
      /thewhiskyvault\.com\//              
    ],
    additionalSelectors: {
      
    }
  },
  {
    name: 'Banks Wines & Spirits',
    domainMatch: 'bankswinesandspirits.com',
    productSelector: '.product-card__details',
    nameSelector: '.product-card__title',
    priceSelector: '.product-card__price .money',
    linkSelector: '.product-card__title a', // Adjust if product name is not a link
    imageSelector: '.product-card__image img', // Adjust based on actual HTML
    listingContainerSelector: '.product-grid, .collection', // Adjust based on actual HTML
    listingUrlPatterns: [
      /bankswinesandspirits\.com\/collections\//,
      /bankswinesandspirits\.com\/products\//,
      /bankswinesandspirits\.com\/search\?/,
      /bankswinesandspirits\.com\//
    ],
    additionalSelectors: {
      // Add more if needed, e.g. brand, description, volume
    }
  },
  {
    name: 'Caskers',
    domainMatch: 'caskers.com',
    productSelector: '.product-item-info', 
    nameSelector: '.product-item-link',
    priceSelector: '.price',
    linkSelector: '.product-item-link',
    imageSelector: '.product-image-photo',
    volumeSelector: '.product-item-size',
    listingContainerSelector: '.products-grid, .products.wrapper',
    listingUrlPatterns: [
      /caskers\.com\/spirits\//,
      /caskers\.com\/wine\//,
      /caskers\.com\/beer\//,
      /caskers\.com\/[a-z0-9\-]+\/?/,
      /caskers\.com\/search\?/,
      /caskers\.com\//
    ],
    additionalSelectors: {
      // Add more if needed, e.g. brand, description, rating
    }
  },
  {
    name: "Wooden Cork",
    domainMatch: "woodencork.com",
    productSelector: ".product-grid-item",
    nameSelector: ".grid-product__title",
    priceSelector: ".grid-product__price--current .visually-hidden",
    linkSelector: ".grid-item__link",
    imageSelector: ".grid-product__image-wrap img",
    listingContainerSelector: ".product-grid",
    listingUrlPatterns: [
      /woodencork\.com\/collections\//,
      /woodencork\.com\/products\//,
      /woodencork\.com\/search\?/,
      /woodencork\.com\//
    ],
    additionalSelectors: {
      brand: ".grid-product__vendor"
    }
  }
  ,
{
  name: "Kent Street Cellars",
  domainMatch: "kentstreetcellars.com.au",
  productSelector: ".productitem--info",
  nameSelector: ".productitem--title a",
  priceSelector: ".price--main .money",
  linkSelector: ".productitem--title a",
  imageSelector: ".productitem--image-primary",
  listingContainerSelector: ".productgrid--items, .collection__products, .productgrid--container",
  listingUrlPatterns: [
    /kentstreetcellars\.com\.au\/collections\//,
    /kentstreetcellars\.com\.au\/products\//,
    /kentstreetcellars\.com\.au\/search\?/,
    /kentstreetcellars\.com\.au\//
  ],
  additionalSelectors: {
    volume: ".productitem--title a", // Volume is often in the title, e.g., "700ml"
    description: ".productitem--description"
  }
}

];