export interface ProductData {
  name: string;
  price: number;
  retailer: string;
  url: string;
  imageUrl: string;
  volume?: string;
  additionalData?: Record<string, string>;
}

export interface SiteConfig {
  name: string;
  domainMatch: string;
  productSelector: string;
  nameSelector: string;
  priceSelector: string;
  linkSelector: string;
  imageSelector: string;
  volumeSelector?: string;
  listingContainerSelector?: string;
  listingUrlPatterns?: RegExp[];
  additionalSelectors?: Record<string, string>;
} 