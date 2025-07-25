import { ProductGrid } from '@/components/ProductGrid';
import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/types/product';
import { useState } from 'react';
import { Leaf, Truck, Award } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';

type GroceryProps = {
  addToCart: (product: Product) => void;
};

const Grocery = ({ addToCart }: GroceryProps) => {
  const [sortBy, setSortBy] = useState('popularity');
  const { addToWishlist, isInWishlist } = useWishlist();

  // Filter products for grocery category
  const groceryProducts = mockProducts.filter(product => 
    product.category.toLowerCase().includes('grocery') || 
    product.category.toLowerCase().includes('food') ||
    product.name.toLowerCase().includes('apple') ||
    product.name.toLowerCase().includes('banana')
  );

  const sortedProducts = [...groceryProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Fresh Groceries</h1>
          <p className="text-lg text-muted-foreground mb-8">Farm fresh produce delivered to your doorstep</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Farm Fresh</span>
            <span className="px-4 py-2 bg-secondary/10 text-secondary-foreground rounded-full text-sm font-medium">Organic</span>
            <span className="px-4 py-2 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium">Daily Deals</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter and Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            <span className="text-sm text-muted-foreground">
              {sortedProducts.length} fresh items available
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-foreground">Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="popularity">Popularity</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Grocery Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 text-center border border-border">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Farm Fresh</h3>
            <p className="text-muted-foreground text-sm">Directly sourced from local farms for maximum freshness</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 text-center border border-border">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground text-sm">Get your groceries delivered within 10-30 minutes</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 text-center border border-border">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Quality Assured</h3>
            <p className="text-muted-foreground text-sm">100% quality guarantee on all products</p>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <ProductGrid products={sortedProducts} onAddToCart={addToCart} />
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🥬</div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">No Grocery Items Found</h3>
            <p className="text-muted-foreground">We're updating our fresh inventory. Please check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grocery;