import React from 'react';
import { useLocation } from 'react-router-dom';
import { mockProducts } from '../data/mockProducts';
import { ProductCard } from '../components/ProductCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Helper to highlight match
function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="bg-primary/20 text-primary font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

const SearchResults: React.FC = () => {
  const query = useQuery();
  const search = query.get('q')?.toLowerCase() || '';
  const results = mockProducts.filter(
    p =>
      p.name.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search) ||
      p.category?.toLowerCase().includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto px-2 py-6">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{search}"</h1>
      {results.length === 0 ? (
        <div className="text-center text-muted-foreground py-12 text-lg">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {results.map(product => (
            <div key={product.id}>
              <ProductCard product={product} onAddToCart={() => {}} />
              <div className="mt-1 text-xs text-muted-foreground">
                {highlightMatch(product.name, search)}
                {product.category && (
                  <span className="ml-2">{highlightMatch(product.category, search)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 