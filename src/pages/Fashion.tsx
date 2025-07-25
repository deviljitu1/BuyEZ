import { ProductGrid } from '@/components/ProductGrid';
import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/types/product';
import { useState } from 'react';
import { Heart, Filter } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';

type FashionProps = {
  addToCart: (product: Product) => void;
};

const Fashion = ({ addToCart }: FashionProps) => {
  const [sortBy, setSortBy] = useState('popularity');
  const { addToWishlist, isInWishlist } = useWishlist();

  // Filter products for fashion category (clothing, accessories, etc.)
  const fashionProducts = mockProducts.filter(product => 
    product.category.toLowerCase().includes('fashion') || 
    product.category.toLowerCase().includes('clothing') ||
    product.category.toLowerCase().includes('accessories') ||
    product.name.toLowerCase().includes('shirt') ||
    product.name.toLowerCase().includes('dress') ||
    product.name.toLowerCase().includes('shoes')
  );

  const sortedProducts = [...fashionProducts].sort((a, b) => {
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
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Fashion Collection</h1>
          <p className="text-lg text-muted-foreground mb-8">Discover the latest trends and timeless classics</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">New Arrivals</span>
            <span className="px-4 py-2 bg-secondary/10 text-secondary-foreground rounded-full text-sm font-medium">Trending</span>
            <span className="px-4 py-2 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium">Sale</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter and Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {sortedProducts.length} items found
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

        {/* Fashion Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { name: 'Men\'s Fashion', icon: '👔' },
            { name: 'Women\'s Fashion', icon: '👗' },
            { name: 'Accessories', icon: '👜' },
            { name: 'Footwear', icon: '👟' }
          ].map((category) => (
            <div key={category.name} className="bg-card rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer border border-border">
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-card-foreground">{category.name}</h3>
            </div>
          ))}
        </div>

        {/* Fashion Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 text-center border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Style Inspiration</h3>
            <p className="text-muted-foreground text-sm">Get inspired by the latest fashion trends and styling tips</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 text-center border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold">%</span>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Seasonal Sale</h3>
            <p className="text-muted-foreground text-sm">Up to 50% off on selected fashion items this season</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 text-center border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary">👑</span>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Premium Brands</h3>
            <p className="text-muted-foreground text-sm">Shop from top fashion brands and designers worldwide</p>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <ProductGrid products={sortedProducts} onAddToCart={addToCart} />
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👗</div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">No Fashion Items Found</h3>
            <p className="text-muted-foreground">We're updating our fashion collection. Please check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fashion;