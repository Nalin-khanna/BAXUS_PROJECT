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
    name: 'Total Wine',
    domainMatch: 'totalwine.com',
    productSelector: '.product-card',
    nameSelector: '.product-title',
    priceSelector: '.price-value',
    linkSelector: 'a.product-link',
    imageSelector: 'img.product-image',
    listingContainerSelector: '.product-grid',
    listingUrlPatterns: [/\/wine\//, /\/spirits\//]
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
      /\/search\.php\?.*section=product/  // Add this pattern for search results
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
      /\/(products|collections|search).*(?:\?.*)?$/ // Updated pattern to handle query parameters
    ],
    additionalSelectors: {
      brand: '.product__vendor',
      description: '.product__description',
      volume: '.product__title'
    }
  }
];