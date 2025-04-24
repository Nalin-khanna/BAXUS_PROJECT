import { useState, useEffect } from 'react'
import './App.css'

interface ComparisonResult {
  original: {
    name: string;
    price: number;
    retailer: string;
    url: string;
  };
  baxusMatch: {
    name: string;
    price: number;
    imageUrl: string;
    attributes?: Record<string, string>;
    iD?: string; // Ensure this matches the case used in background.ts
    nftAddress?: string;
  } | "no matches found";
  savings: number;
  error?: boolean;
}

function App() {
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    chrome.storage.local.get(['comparisonResults', 'lastUpdated'], (data) => {
      console.log('Retrieved from storage:', data);
      if (data.comparisonResults) {
        setResults(data.comparisonResults);
        setLastUpdated(data.lastUpdated);
      }
    });

    chrome.storage.onChanged.addListener((changes) => {
      console.log('Storage changes:', changes);
      if (changes.comparisonResults) {
        setResults(changes.comparisonResults.newValue);
        setLastUpdated(changes.lastUpdated?.newValue || '');
      }
    });
  }, []);

  // Check for errors first
  const hasError = results.some(result => result.error === true);

  // Find if there are any matches with savings, excluding errors
  const hasMatches = results.some(result =>
    !result.error && // Ensure we don't count errored results as matches
    result.baxusMatch &&
    result.baxusMatch !== "no matches found" &&
    result.savings > 0
  );

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container">
          <h1>The Honey Barrel</h1>
          <span className="tagline">Bourbon Price Comparison</span>
        </div>
        <p className="last-updated">
          Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
        </p>
      </header>
      
      <div className="results-container">
        {results.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🥃</div>
            <p>No products scanned yet</p>
            <p className="help-text">Visit a supported retailer to see bourbon comparisons</p>
          </div>
        ) : hasError ? ( // Check for error state first
          <div className="error-container">
            <div className="icon">⚠️</div>
            <p>Error fetching comparison data</p>
            <p className="help-text">Could not connect to BAXUS API. Please try again later.</p>
          </div>
        ) : !hasMatches ? (
          <div className="no-match-container">
            <div className="icon">🔍</div>
            <p>No better prices found in BAXUS database</p>
            <p className="help-text">Try scanning another product</p>
          </div>
        ) : (
          <div className="products-grid">
            {results.map((result, index) => {
              // Only render products that have matches AND savings AND no error
              if (!result.error && // Add error check here too
                  result.baxusMatch &&
                  result.baxusMatch !== "no matches found" &&
                  result.savings > 0) {
                // Type guard to ensure baxusMatch is not "no matches found"
                if (typeof result.baxusMatch === 'string') return null;

                return (
                  <div key={index} className="product-card has-savings">
                    <div className="card-header">
                      <h3 className="product-title">{result.original.name}</h3>
                      <span className="retailer-badge">{result.original.retailer}</span>
                    </div>
                    
                    <div className="card-content">
                      <div className="price-comparison">
                        <div className="price-box original">
                          <div className="price-label">Retail Price</div>
                          <div className="price-value">${result.original.price.toFixed(2)}</div>
                        </div>
                        
                        <div className="price-box baxus">
                          <div className="price-label">BAXUS Price</div>
                          <div className="price-value">${result.baxusMatch.price.toFixed(2)}</div>
                        </div>
                      </div>
                      
                      {result.savings > 0 && (
                        <div className="savings-highlight">
                          <div className="savings-icon">💰</div>
                          <div className="savings-text">
                            <span>Potential Savings</span>
                            <strong>${result.savings.toFixed(2)}</strong>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="product-details">
                      {result.baxusMatch.imageUrl && (
                        <div className="image-container">
                          <img 
                            src={result.baxusMatch.imageUrl} 
                            alt={result.original.name}
                            className="product-image"
                          />
                        </div>
                      )}
                      
                      <div className="attributes-container">
                        {result.baxusMatch.attributes && (
                          <div className="attributes">
                            <h4>Details</h4>
                            <ul className="attributes-list">
                              {Object.entries(result.baxusMatch.attributes)
                                .filter(([key]) => !['Name', 'Blurhash'].includes(key))
                                .map(([key, value]) => (
                                  <li key={key}><span className="attribute-key">{key}:</span> {value}</li>
                                ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Ensure correct property name 'iD' is used */}
                        {result.baxusMatch.iD && (
                          <a
                            href={`https://www.baxus.co/asset/${result.baxusMatch.iD}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="baxus-link"
                          >
                            View on BAXUS
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
      
      <footer className="footer">
        <p>© The Honey Barrel - Bourbon Price Comparison</p>
      </footer>
    </div>
  );
}

export default App;