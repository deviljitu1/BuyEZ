import { useState } from 'react';
// Added appliance-specific icons and removed some mobile-specific ones
import { Search, Clock, Star, Plus, Minus, ShoppingCart, MapPin, Filter, Grid3X3, List, Refrigerator, WashingMachine, Microwave, Tv, AirVent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Appliance categories
const applianceCategories = [
  { id: '1', name: 'Refrigerators', icon: '🧊', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'Washing Machines', icon: '🧼', color: 'bg-purple-100 text-purple-800' },
  { id: '3', name: 'Televisions', icon: '📺', color: 'bg-red-100 text-red-800' },
  { id: '4', name: 'Microwaves', icon: '🔥', color: 'bg-orange-100 text-orange-800' },
  { id: '5', name: 'Air Conditioners', icon: '❄️', color: 'bg-green-100 text-green-800' },
  { id: '6', name: 'LG', icon: ' L ', color: 'bg-pink-100 text-pink-800' },
  { id: '7', name: 'Samsung', icon: ' S ', color: 'bg-indigo-100 text-indigo-800' },
  { id: '8', name: 'Bosch', icon: ' B ', color: 'bg-yellow-100 text-yellow-800' },
];

// Appliance products data
const applianceProducts = [
  {
    id: '1',
    name: 'Samsung 653L Side-by-Side Refrigerator',
    brand: 'Samsung',
    price: 84990,
    originalPrice: 95990,
    capacity: '653 Litres',
    image: 'https://images.unsplash.com/photo-1601599589955-4c09ac74e1d3?w=300&h=300&fit=crop',
    rating: 4.7,
    deliveryTime: '3 days',
    discount: 11,
    stock: 10,
    features: ['Convertible 5-in-1', 'Digital Inverter', '10 Year Warranty'],
    color: 'Refined Inox'
  },
  {
    id: '2',
    name: 'LG 8 Kg Front Load Washing Machine',
    brand: 'LG',
    price: 33990,
    originalPrice: 41990,
    capacity: '8 Kg',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7957e?w=300&h=300&fit=crop',
    rating: 4.6,
    deliveryTime: '2 days',
    discount: 19,
    stock: 15,
    features: ['6 Motion DD Tech', 'In-Built Heater', 'Smart Diagnosis'],
    color: 'White'
  },
  {
    id: '3',
    name: 'Sony Bravia 55" 4K Ultra HD Smart TV',
    brand: 'Sony',
    price: 74999,
    originalPrice: 99900,
    capacity: '55 Inch',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f82e4f?w=300&h=300&fit=crop',
    rating: 4.8,
    deliveryTime: '1 day',
    discount: 25,
    stock: 7,
    features: ['4K HDR Processor X1', 'Google TV', 'Dolby Audio'],
    color: 'Black'
  },
  {
    id: '4',
    name: 'Bosch 8 Kg Front Load Washing Machine',
    brand: 'Bosch',
    price: 36490,
    originalPrice: 48599,
    capacity: '8 Kg',
    image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=300&h=300&fit=crop',
    rating: 4.5,
    deliveryTime: '2 days',
    discount: 25,
    stock: 12,
    features: ['EcoSilence Drive', 'Anti-Vibration', 'ActiveWater Plus'],
    color: 'Silver'
  },
  {
    id: '5',
    name: 'LG 1.5 Ton 5 Star AI DUAL Inverter Split AC',
    brand: 'LG',
    price: 46990,
    originalPrice: 55990,
    capacity: '1.5 Ton',
    image: 'https://images.unsplash.com/photo-1634747385129-23a5b64c7816?w=300&h=300&fit=crop',
    rating: 4.4,
    deliveryTime: '1 day',
    discount: 16,
    stock: 5,
    features: ['AI Convertible 6-in-1', '4 Way Swing', 'HD Filter'],
    color: 'White'
  },
  {
    id: '6',
    name: 'IFB 30 L Convection Microwave Oven',
    brand: 'IFB',
    price: 13990,
    originalPrice: 18490,
    capacity: '30 Litres',
    image: 'https://images.unsplash.com/photo-1605894179922-879163649b55?w=300&h=300&fit=crop',
    rating: 4.3,
    deliveryTime: '2 days',
    discount: 24,
    stock: 20,
    features: ['101 Auto Cook Menus', 'Steam Clean', 'Child Lock'],
    color: 'Black'
  }
];

// Banner offers can be reused or modified for appliances
const bannerOffers = [
  {
    id: '1',
    title: 'EMI Starting ₹1,999',
    subtitle: 'No cost EMI on all appliances',
    color: 'bg-gradient-to-r from-teal-400 to-teal-600',
    icon: '💳'
  },
  {
    id: '2',
    title: 'Hassle-free Installation',
    subtitle: 'On select large appliances',
    color: 'bg-gradient-to-r from-orange-400 to-orange-600',
    icon: '🛠️'
  },
  {
    id: '3',
    title: 'Extended Warranty',
    subtitle: 'Starting at just ₹599',
    color: 'bg-gradient-to-r from-rose-400 to-rose-600',
    icon: '🛡️'
  }
];

export function Appliances() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [priceRange, setPriceRange] = useState<'all' | 'under20k' | '20k-50k' | 'above50k'>('all');

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

  const filteredProducts = applianceProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || product.brand === selectedBrand || product.name.includes(selectedBrand);
    
    let matchesPrice = true;
    if (priceRange === 'under20k') matchesPrice = product.price < 20000;
    else if (priceRange === '20k-50k') matchesPrice = product.price >= 20000 && product.price <= 50000;
    else if (priceRange === 'above50k') matchesPrice = product.price > 50000;
    
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
                <div className="font-semibold">Delivery in 2-3 days</div>
                <div className="text-muted-foreground">Mumbai, 400001</div>
              </div>
            </div>
            
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for appliances, brands..."
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
              <option value="under20k">Under ₹20,000</option>
              <option value="20k-50k">₹20,000 - ₹50,000</option>
              <option value="above50k">Above ₹50,000</option>
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

      {/* Brand & Category Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Shop by Category</h2>
        </div>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {applianceCategories.map((brand) => (
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

      {/* Appliance Products Grid */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {selectedBrand || 'All Appliances'} 
            <span className="text-muted-foreground ml-2">({filteredProducts.length} appliances)</span>
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
                <p className="text-xs text-muted-foreground mb-2">{product.capacity} • {product.color}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.features.slice(0, 3).map((feature, idx) => (
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
            <div className="text-4xl mb-4">🧊</div>
            <h3 className="text-lg font-medium mb-2">No appliances found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
