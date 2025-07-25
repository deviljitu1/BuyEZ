import { useState } from 'react';
import { Search, Clock, Star, Plus, Minus, ShoppingCart, MapPin, Filter, Grid3X3, List, Smartphone, Battery, Camera, Cpu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Mobile categories
const mobileCategories = [
  { id: '1', name: 'iPhone', icon: '📱', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'Samsung', icon: '📲', color: 'bg-purple-100 text-purple-800' },
  { id: '3', name: 'OnePlus', icon: '📱', color: 'bg-red-100 text-red-800' },
  { id: '4', name: 'Xiaomi', icon: '📲', color: 'bg-orange-100 text-orange-800' },
  { id: '5', name: 'Google Pixel', icon: '📱', color: 'bg-green-100 text-green-800' },
  { id: '6', name: 'Realme', icon: '📲', color: 'bg-yellow-100 text-yellow-800' },
  { id: '7', name: 'Oppo', icon: '📱', color: 'bg-pink-100 text-pink-800' },
  { id: '8', name: 'Vivo', icon: '📲', color: 'bg-indigo-100 text-indigo-800' },
];

// Mobile products data
const mobileProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: 159900,
    originalPrice: 164900,
    storage: '256GB',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
    rating: 4.8,
    deliveryTime: '2 days',
    discount: 3,
    stock: 15,
    features: ['A17 Pro Chip', '48MP Camera', '5G Ready', 'Titanium Design'],
    color: 'Natural Titanium'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 129999,
    originalPrice: 139999,
    storage: '512GB',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop',
    rating: 4.7,
    deliveryTime: '1 day',
    discount: 7,
    stock: 8,
    features: ['S Pen Included', '200MP Camera', '5000mAh Battery', 'AI Features'],
    color: 'Phantom Black'
  },
  {
    id: '3',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    price: 64999,
    originalPrice: 69999,
    storage: '256GB',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
    rating: 4.6,
    deliveryTime: '1 day',
    discount: 7,
    stock: 12,
    features: ['Snapdragon 8 Gen 3', '50MP Triple Camera', '100W Charging', 'OxygenOS 14'],
    color: 'Silky Black'
  },
  {
    id: '4',
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    price: 84999,
    originalPrice: 89999,
    storage: '128GB',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop',
    rating: 4.5,
    deliveryTime: '2 days',
    discount: 6,
    stock: 20,
    features: ['Google Tensor G3', 'Magic Eraser', 'Pure Android', '5G Enabled'],
    color: 'Obsidian'
  },
  {
    id: '5',
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    price: 99999,
    originalPrice: 109999,
    storage: '512GB',
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300&h=300&fit=crop',
    rating: 4.4,
    deliveryTime: '1 day',
    discount: 9,
    stock: 6,
    features: ['Leica Cameras', '120W Charging', 'AMOLED Display', 'MIUI 15'],
    color: 'White'
  },
  {
    id: '6',
    name: 'iPhone 14',
    brand: 'Apple',
    price: 59900,
    originalPrice: 69900,
    storage: '128GB',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop',
    rating: 4.7,
    deliveryTime: '2 days',
    discount: 14,
    stock: 25,
    features: ['A15 Bionic', 'Dual Camera', 'Face ID', 'MagSafe'],
    color: 'Midnight'
  }
];

const bannerOffers = [
  {
    id: '1',
    title: 'EMI Starting ₹2,999',
    subtitle: 'No cost EMI available',
    color: 'bg-gradient-to-r from-blue-400 to-blue-600',
    icon: '💳'
  },
  {
    id: '2',
    title: 'Exchange Offer',
    subtitle: 'Up to ₹20,000 off',
    color: 'bg-gradient-to-r from-green-400 to-green-600',
    icon: '🔄'
  },
  {
    id: '3',
    title: 'Free Delivery',
    subtitle: 'On all mobile orders',
    color: 'bg-gradient-to-r from-purple-400 to-purple-600',
    icon: '🚚'
  }
];

export default function Mobiles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [priceRange, setPriceRange] = useState<'all' | 'under50k' | '50k-100k' | 'above100k'>('all');

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const filteredProducts = mobileProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    
    let matchesPrice = true;
    if (priceRange === 'under50k') matchesPrice = product.price < 50000;
    else if (priceRange === '50k-100k') matchesPrice = product.price >= 50000 && product.price <= 100000;
    else if (priceRange === 'above100k') matchesPrice = product.price > 100000;
    
    return matchesSearch && matchesBrand && matchesPrice;
  });

  const totalCartItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Location & Search */}
      <div className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Location */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <div className="font-semibold">Delivery in 1-2 days</div>
                <div className="text-muted-foreground">Mumbai, 400001</div>
              </div>
            </div>
            
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for mobiles, brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as any)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Prices</option>
              <option value="under50k">Under ₹50,000</option>
              <option value="50k-100k">₹50,000 - ₹1,00,000</option>
              <option value="above100k">Above ₹1,00,000</option>
            </select>

            {/* View Toggle & Cart */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              
              {totalCartItems > 0 && (
                <Button className="relative">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {totalCartItems}
                  </Badge>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Banner Offers */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bannerOffers.map((offer) => (
            <Card key={offer.id} className={`${offer.color} text-white border-0`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-2xl">{offer.icon}</div>
                <div>
                  <div className="font-semibold">{offer.title}</div>
                  <div className="text-sm opacity-90">{offer.subtitle}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Brand Categories */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Shop by Brand</h2>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {mobileCategories.map((brand) => (
            <Card
              key={brand.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedBrand === brand.name ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedBrand(
                selectedBrand === brand.name ? '' : brand.name
              )}
            >
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-2">{brand.icon}</div>
                <div className="text-xs font-medium leading-tight">{brand.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mobile Products Grid */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {selectedBrand || 'All Mobiles'} 
            <span className="text-muted-foreground ml-2">({filteredProducts.length} phones)</span>
          </h2>
        </div>

        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                {product.discount && (
                  <Badge className="absolute top-2 left-2 bg-warning text-warning-foreground">
                    {product.discount}% OFF
                  </Badge>
                )}
                <Badge className="absolute top-2 right-2 bg-success text-success-foreground">
                  {product.brand}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Delivery: {product.deliveryTime}</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{product.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{product.storage} • {product.color}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.features.slice(0, 2).map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs px-2 py-0">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-lg">₹{product.price.toLocaleString()}</div>
                    {product.originalPrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-success font-medium">
                          Save ₹{(product.originalPrice - product.price).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {cart[product.id] ? (
                    <div className="flex items-center gap-2 bg-primary text-primary-foreground rounded-md flex-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-primary-foreground hover:text-primary-foreground hover:bg-primary-glow"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium px-2">{cart[product.id]}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-primary-foreground hover:text-primary-foreground hover:bg-primary-glow"
                        onClick={() => addToCart(product.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(product.id)}
                      className="flex-1"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </div>
                
                {product.stock < 10 && (
                  <div className="mt-2 text-xs text-warning">Only {product.stock} left in stock!</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-medium mb-2">No mobiles found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}