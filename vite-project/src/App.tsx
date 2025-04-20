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
  } | null;
  savings: number;
}

function App() {
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    // Load results from storage
    chrome.storage.local.get(['comparisonResults', 'lastUpdated'], (data) => {
      if (data.comparisonResults) {
        setResults(data.comparisonResults);
        setLastUpdated(data.lastUpdated);
      }
    });

    // Listen for updates
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.comparisonResults) {
        setResults(changes.comparisonResults.newValue);
        setLastUpdated(changes.lastUpdated?.newValue || '');
      }
    });
  }, []);

  return (
    <div className="app-container">
      <h1>The Honey Barrel</h1>
      <p className="last-updated">
        Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
      </p>
      
      <div className="results-container">
        {results.length === 0 ? (
          <p>No products scanned yet. Visit a supported retailer to see comparisons.</p>
        ) : (
          results.map((result, index) => (
            <div key={index} className={`product-card ${result.savings > 0 ? 'has-savings' : ''}`}>
              <div className="product-info">
                <h3>{result.original.name}</h3>
                <p className="retailer">From: {result.original.retailer}</p>
                <p className="price">Price: ${result.original.price.toFixed(2)}</p>
                
                {result.baxusMatch && (
                  <div className="baxus-comparison">
                    <h4>BAXUS Comparison</h4>
                    <p>Price: ${result.baxusMatch.price.toFixed(2)}</p>
                    {result.savings > 0 && (
                      <p className="savings">Potential Savings: ${result.savings.toFixed(2)}</p>
                    )}
                    {result.baxusMatch.attributes && (
                      <div className="attributes">
                        {Object.entries(result.baxusMatch.attributes)
                          .filter(([key]) => !['Name', 'Blurhash'].includes(key))
                          .map(([key, value]) => (
                            <p key={key}><strong>{key}:</strong> {value}</p>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {result.baxusMatch?.imageUrl && (
                <img 
                  src={result.baxusMatch.imageUrl} 
                  alt={result.original.name}
                  className="product-image"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
