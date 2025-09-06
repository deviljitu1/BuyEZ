import { useState } from 'react';
import { Search, Star, ShoppingCart, MapPin, Grid3X3, List, Gauge, Loader } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUnifiedCart } from '@/hooks/useUnifiedCart';
import { useCategories } from '@/hooks/useCategories';
import { useTwoWheelers } from '@/hooks/useTwoWheelers';

const categoryIcons: { [key: string]: string } = {
  'Motorcycles': '🏍️',
  'Scooters': '🛵', 
  'Electric Bikes': '⚡',
  'Sports Bikes': '🏁',
  'Cruisers': '🌟',
  'Bicycles': '🚲'
};

export default function TwoWheelers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading } = useTwoWheelers(selectedCategory);
  const { addToCart, user } = useUnifiedCart();

  // Filter products based on search and price range
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriceRange = priceRange === 'all' || 
      (priceRange === 'under-100k' && product.price < 100000) ||
      (priceRange === '100k-200k' && product.price >= 100000 && product.price < 200000) ||
      (priceRange === 'above-200k' && product.price >= 200000);
    
    return matchesSearch && matchesPriceRange;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
      default:
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    }
  });

  const handleAddToCart = async (product: any) => {
    if (!user) {
      // Handle guest users - you might want to redirect to login or show a message
      return;
    }
    await addToCart(product.id);
  };

  const calculateDiscount = (price: number, originalPrice: number | null) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading two wheelers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Two Wheelers
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8">
              Discover the perfect ride - from motorcycles to electric scooters
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for bikes, scooters, brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 text-lg border-2 focus:border-primary rounded-xl"
              />
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Brands</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Free</div>
                <div className="text-sm text-muted-foreground">Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                selectedCategory === 'all' ? 'border-primary bg-primary/5' : 'border-transparent hover:border-primary/20'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">🚗</div>
                <h3 className="font-semibold text-sm">All</h3>
              </CardContent>
            </Card>
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  selectedCategory === category.name ? 'border-primary bg-primary/5' : 'border-transparent hover:border-primary/20'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category.name ? 'all' : category.name)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{categoryIcons[category.name] || '🛴'}</div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Filters and View Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Prices</option>
              <option value="under-100k">Under ₹1,00,000</option>
              <option value="100k-200k">₹1,00,000 - ₹2,00,000</option>
              <option value="above-200k">Above ₹2,00,000</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {sortedProducts.length} two wheelers
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {sortedProducts.map((product) => {
            const discount = calculateDiscount(product.price, product.original_price);
            return (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      {discount}% OFF
                    </Badge>
                  )}
                  {product.is_new && (
                    <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                      NEW
                    </Badge>
                  )}
                  <Badge className="absolute bottom-2 right-2 bg-background/90 text-foreground">
                    {product.categories?.name}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                      <span className="text-muted-foreground">({product.review_count})</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.original_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.original_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Gauge className="w-4 h-4 text-muted-foreground" />
                      <span>{product.engine_capacity} | {product.mileage || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>Free Delivery Available</span>
                    </div>
                  </div>
                  
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {Object.entries(product.specifications).slice(0, 2).map(([key, value], index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {value as string}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? (
                      'Out of Stock'
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  
                  {product.stock <= 5 && product.stock > 0 && (
                    <p className="text-xs text-red-500 mt-2 text-center">
                      Only {product.stock} left in stock!
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No two wheelers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse our categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
}