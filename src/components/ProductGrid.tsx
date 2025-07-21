import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            Featured Products
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium tech products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {visibleProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
        <div className="text-center mt-10 sm:mt-12">
            <button
              className="px-6 sm:px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors font-semibold text-base sm:text-lg"
              onClick={() => setVisibleCount(c => Math.min(c + 8, products.length))}
            >
            Load More Products
          </button>
        </div>
        )}
      </div>
    </section>
  );
};