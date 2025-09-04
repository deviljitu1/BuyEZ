import { useState, useEffect } from 'react';
import { Search, Clock, Star, Plus, Minus, ShoppingCart, MapPin, Filter, Grid3X3, List, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useGroceryCategories } from '@/hooks/useGroceryCategories';
import { useGroceryProducts } from '@/hooks/useGroceryProducts';
import { useGroceryCart } from '@/hooks/useGroceryCart';
import { supabase } from '@/integrations/supabase/client';

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useGroceryCategories();
  const { products, loading: productsLoading } = useGroceryProducts();
  const { addToCart, removeFromCart, getCartItemQuantity, totalItems, user } = useGroceryCart();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const handleAuth = () => {
    navigate('/auth');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

            {/* View Toggle, Auth & Cart */}
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
              
              {/* Auth Button */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  {/* Check if user is admin and show admin link */}
                  {currentUser && (
                    <Button variant="outline" size="sm" asChild>
                      <a href="/admin">Admin</a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <User className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={handleAuth}>
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
              
              {totalItems > 0 && (
                <Button className="relative" onClick={() => navigate('/grocery-checkout')}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {totalItems}
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
          {categoriesLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-3 text-center">
                  <div className="w-8 h-8 bg-muted rounded mb-2 mx-auto"></div>
                  <div className="w-full h-3 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            categories.map((category) => (
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
            ))
          )}
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

        {productsLoading ? (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
              : 'grid-cols-1'
          }`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="w-full h-40 bg-muted"></div>
                <CardContent className="p-3 space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-6 bg-muted rounded w-12"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => {
              const quantity = getCartItemQuantity(product.id);
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all group">
                  <div className="relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                    />
                    {product.discount && (
                      <Badge className="absolute top-2 left-2 bg-warning text-warning-foreground">
                        {product.discount}% OFF
                      </Badge>
                    )}
                    {product.is_organic && (
                      <Badge className="absolute top-2 right-2 bg-success text-success-foreground">
                        Organic
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{product.delivery_time}</span>
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
                        {product.original_price && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{product.original_price}
                          </span>
                        )}
                      </div>
                      
                      {quantity > 0 ? (
                        <div className="flex items-center gap-2 bg-primary text-primary-foreground rounded-md">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-primary-foreground hover:text-primary-foreground hover:bg-primary-glow"
                            onClick={() => removeFromCart(product.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-medium px-2">{quantity}</span>
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
              );
            })}
          </div>
        )}

        {!productsLoading && filteredProducts.length === 0 && (
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