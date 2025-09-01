import { useState } from 'react';
import { Search, Star, Plus, Minus, ShoppingCart, MapPin, Filter, Grid3X3, List, Zap, Gauge, Wrench, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

// Two Wheeler categories
const twoWheelerCategories = [
  { id: '1', name: 'Motorcycles', icon: '🏍️', color: 'bg-red-100 text-red-800' },
  { id: '2', name: 'Scooters', icon: '🛵', color: 'bg-blue-100 text-blue-800' },
  { id: '3', name: 'Electric Bikes', icon: '⚡', color: 'bg-green-100 text-green-800' },
  { id: '4', name: 'Bicycles', icon: '🚲', color: 'bg-purple-100 text-purple-800' },
  { id: '5', name: 'Sports Bikes', icon: '🏁', color: 'bg-orange-100 text-orange-800' },
  { id: '6', name: 'Cruisers', icon: '🌟', color: 'bg-yellow-100 text-yellow-800' },
];

// Two Wheeler products data
const twoWheelerProducts = [
  {
    id: 'tw1',
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    price: 195000,
    originalPrice: 205000,
    engine: '349cc',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    rating: 4.6,
    deliveryTime: '7-10 days',
    discount: 5,
    stock: 12,
    features: ['Air Cooled Engine', 'Electric Start', 'Dual Channel ABS', 'LED Headlight'],
    category: 'Motorcycles',
    mileage: '35-40 kmpl'
  },
  {
    id: 'tw2',
    name: 'Honda Activa 6G',
    brand: 'Honda',
    price: 75000,
    originalPrice: 78000,
    engine: '109.51cc',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
    rating: 4.8,
    deliveryTime: '3-5 days',
    discount: 4,
    stock: 25,
    features: ['HET Engine', 'LED Headlight', 'Mobile Charging Socket', 'Bigger Under Seat Storage'],
    category: 'Scooters',
    mileage: '60 kmpl'
  },
  {
    id: 'tw3',
    name: 'Ather 450X Gen 3',
    brand: 'Ather',
    price: 145000,
    originalPrice: 155000,
    engine: 'Electric',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop&sat=-100&bright=20',
    rating: 4.7,
    deliveryTime: '5-7 days',
    discount: 6,
    stock: 8,
    features: ['7" Touchscreen', 'Fast Charging', 'True Range 105 km', 'Google Maps Navigation'],
    category: 'Electric Bikes',
    mileage: '105 km range'
  },
  {
    id: 'tw4',
    name: 'Yamaha FZ-S V4',
    brand: 'Yamaha',
    price: 115000,
    originalPrice: 120000,
    engine: '149cc',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=300&fit=crop',
    rating: 4.5,
    deliveryTime: '4-6 days',
    discount: 4,
    stock: 15,
    features: ['Blue Core Engine', 'Single Channel ABS', 'LED Headlight', 'Side Stand Engine Cut-off'],
    category: 'Motorcycles',
    mileage: '45-50 kmpl'
  },
  {
    id: 'tw5',
    name: 'TVS Jupiter 125',
    brand: 'TVS',
    price: 85000,
    originalPrice: 88000,
    engine: '124.8cc',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&hue=240',
    rating: 4.4,
    deliveryTime: '3-5 days',
    discount: 3,
    stock: 20,
    features: ['ET-Fi Technology', 'LED DRL', 'Mobile Charging Port', 'Largest in Segment Storage'],
    category: 'Scooters',
    mileage: '62 kmpl'
  },
  {
    id: 'tw6',
    name: 'Bajaj Pulsar NS200',
    brand: 'Bajaj',
    price: 140000,
    originalPrice: 145000,
    engine: '199.5cc',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&hue=0',
    rating: 4.6,
    deliveryTime: '5-7 days',
    discount: 3,
    stock: 10,
    features: ['Liquid Cooled Engine', 'Perimeter Frame', 'Mono Shock Suspension', 'LED Tail Light'],
    category: 'Sports Bikes',
    mileage: '35-40 kmpl'
  }
];

export default function TwoWheelers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addToCart, getCartCount } = useCart();
  const { toast } = useToast();

  // Filter products based on search and category
  const filteredProducts = twoWheelerProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPriceRange = priceRange === 'all' || 
      (priceRange === 'under-100k' && product.price < 100000) ||
      (priceRange === '100k-200k' && product.price >= 100000 && product.price < 200000) ||
      (priceRange === 'above-200k' && product.price >= 200000);
    
    return matchesSearch && matchesCategory && matchesPriceRange;
  });

  const handleAddToCart = async (product: any) => {
    try {
      const cartProduct = {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        rating: product.rating,
        reviews: Math.floor(Math.random() * 500) + 100,
        stock: product.stock,
        description: `${product.brand} ${product.name} with ${product.engine} engine`
      };
      
      await addToCart(cartProduct);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

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
            {twoWheelerCategories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  selectedCategory === category.name ? 'border-primary bg-primary/5' : 'border-transparent hover:border-primary/20'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category.name ? 'all' : category.name)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{category.icon}</div>
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
            Showing {filteredProducts.length} two wheelers
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                    {product.discount}% OFF
                  </Badge>
                )}
                <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
                  {product.category}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-primary">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <span>{product.engine} | {product.mileage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Delivery in {product.deliveryTime}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
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
          ))}
        </div>

        {filteredProducts.length === 0 && (
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