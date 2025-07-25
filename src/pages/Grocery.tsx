import { useState } from 'react';
import { Search, Clock, Star, Plus, Minus, ShoppingCart, MapPin, Filter, Grid3X3, List } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Mock grocery data inspired by quick commerce apps
const categories = [
  { id: '1', name: 'Fruits & Vegetables', icon: '🥬', color: 'bg-green-100 text-green-800' },
  { id: '2', name: 'Dairy & Eggs', icon: '🥛', color: 'bg-blue-100 text-blue-800' },
  { id: '3', name: 'Snacks', icon: '🍿', color: 'bg-orange-100 text-orange-800' },
  { id: '4', name: 'Beverages', icon: '🥤', color: 'bg-purple-100 text-purple-800' },
  { id: '5', name: 'Bakery', icon: '🍞', color: 'bg-yellow-100 text-yellow-800' },
  { id: '6', name: 'Personal Care', icon: '🧴', color: 'bg-pink-100 text-pink-800' },
  { id: '7', name: 'Household', icon: '🧽', color: 'bg-gray-100 text-gray-800' },
  { id: '8', name: 'Baby Care', icon: '🍼', color: 'bg-red-100 text-red-800' },
];

const groceryProducts = [
  {
    id: '1',
    name: 'Fresh Bananas',
    category: 'Fruits & Vegetables',
    price: 40,
    originalPrice: 50,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop',
    rating: 4.5,
    deliveryTime: '10 mins',
    discount: 20,
    stock: 25,
    isOrganic: true
  },
  {
    id: '2',
    name: 'Amul Fresh Milk',
    category: 'Dairy & Eggs',
    price: 28,
    unit: '500 ml',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop',
    rating: 4.7,
    deliveryTime: '8 mins',
    stock: 50
  },
  {
    id: '3',
    name: 'Lay\'s Classic',
    category: 'Snacks',
    price: 20,
    originalPrice: 25,
    unit: '52g',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop',
    rating: 4.3,
    deliveryTime: '12 mins',
    discount: 20,
    stock: 30
  },
  {
    id: '4',
    name: 'Coca Cola',
    category: 'Beverages',
    price: 40,
    unit: '750 ml',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=300&fit=crop',
    rating: 4.6,
    deliveryTime: '10 mins',
    stock: 20
  },
  {
    id: '5',
    name: 'Brown Bread',
    category: 'Bakery',
    price: 35,
    unit: '400g',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop',
    rating: 4.4,
    deliveryTime: '15 mins',
    stock: 15
  },
  {
    id: '6',
    name: 'Red Apples',
    category: 'Fruits & Vegetables',
    price: 120,
    originalPrice: 150,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300&h=300&fit=crop',
    rating: 4.8,
    deliveryTime: '10 mins',
    discount: 20,
    stock: 35,
    isOrganic: true
  }
];

const bannerOffers = [
  {
    id: '1',
    title: 'Free Delivery',
    subtitle: 'On orders above ₹199',
    color: 'bg-gradient-to-r from-green-400 to-green-600',
    icon: '🚚'
  },
  {
    id: '2',
    title: 'Save 20%',
    subtitle: 'On fresh fruits & veggies',
    color: 'bg-gradient-to-r from-orange-400 to-orange-600',
    icon: '🥕'
  },
  {
    id: '3',
    title: '10 Min Delivery',
    subtitle: 'Lightning fast service',
    color: 'bg-gradient-to-r from-purple-400 to-purple-600',
    icon: '⚡'
  }
];

export default function Grocery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cart, setCart] = useState<Record<string, number>>({});

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

  const filteredProducts = groceryProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
                <div className="font-semibold">Delivery in 10 mins</div>
                <div className="text-muted-foreground">Home - Mumbai, 400001</div>
              </div>
            </div>
            
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

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

      {/* Categories */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Shop by Category</h2>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.name ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCategory(
                selectedCategory === category.name ? '' : category.name
              )}
            >
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-xs font-medium leading-tight">{category.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {selectedCategory || 'All Products'} 
            <span className="text-muted-foreground ml-2">({filteredProducts.length} items)</span>
          </h2>
        </div>

        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                />
                {product.discount && (
                  <Badge className="absolute top-2 left-2 bg-warning text-warning-foreground">
                    {product.discount}% OFF
                  </Badge>
                )}
                {product.isOrganic && (
                  <Badge className="absolute top-2 right-2 bg-success text-success-foreground">
                    Organic
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{product.deliveryTime}</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{product.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{product.unit}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  {cart[product.id] ? (
                    <div className="flex items-center gap-2 bg-primary text-primary-foreground rounded-md">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-primary-foreground hover:text-primary-foreground hover:bg-primary-glow"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs font-medium px-2">{cart[product.id]}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-primary-foreground hover:text-primary-foreground hover:bg-primary-glow"
                        onClick={() => addToCart(product.id)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => addToCart(product.id)}
                      className="h-7 px-3 text-xs"
                    >
                      ADD
                    </Button>
                  )}
                </div>
                
                {product.stock < 10 && (
                  <div className="mt-2 text-xs text-warning">Only {product.stock} left!</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}