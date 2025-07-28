import { useState, useEffect } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Filter, SlidersHorizontal, TrendingUp, Sparkles } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

// Mock fashion products data
const fashionProducts = {
  men: [
    {
      id: 'fashion-m1',
      name: 'Classic Denim Jacket',
      category: 'Men',
      price: 89.99,
      originalPrice: 120.00,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 245,
      stock: 15,
      isNew: true,
      description: 'Premium quality denim jacket with classic fit'
    },
    {
      id: 'fashion-m2',
      name: 'Cotton Polo Shirt',
      category: 'Men',
      price: 35.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 189,
      stock: 28,
      description: 'Comfortable cotton polo shirt for casual wear'
    },
    {
      id: 'fashion-m3',
      name: 'Slim Fit Chinos',
      category: 'Men',
      price: 65.99,
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 156,
      stock: 22,
      description: 'Modern slim fit chinos perfect for office wear'
    },
    {
      id: 'fashion-m4',
      name: 'Formal Dress Shirt',
      category: 'Men',
      price: 55.99,
      originalPrice: 75.99,
      image: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 203,
      stock: 12,
      description: 'Crisp white formal shirt for professional occasions'
    }
  ],
  women: [
    {
      id: 'fashion-w1',
      name: 'Floral Summer Dress',
      category: 'Women',
      price: 75.99,
      originalPrice: 95.99,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 312,
      stock: 18,
      isNew: true,
      description: 'Beautiful floral print summer dress'
    },
    {
      id: 'fashion-w2',
      name: 'Elegant Blazer',
      category: 'Women',
      price: 95.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 178,
      stock: 14,
      description: 'Professional blazer for business attire'
    },
    {
      id: 'fashion-w3',
      name: 'High-Waist Jeans',
      category: 'Women',
      price: 68.99,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 267,
      stock: 25,
      description: 'Trendy high-waist jeans with perfect fit'
    },
    {
      id: 'fashion-w4',
      name: 'Silk Blouse',
      category: 'Women',
      price: 85.99,
      image: 'https://images.unsplash.com/photo-1564257577802-0814a5b3b6c2?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 145,
      stock: 20,
      description: 'Luxurious silk blouse for elegant occasions'
    }
  ],
  kids: [
    {
      id: 'fashion-k1',
      name: 'Rainbow T-Shirt',
      category: 'Kids',
      price: 19.99,
      originalPrice: 29.99,
      image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad1ef?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 89,
      stock: 35,
      isNew: true,
      description: 'Colorful and comfortable t-shirt for kids'
    },
    {
      id: 'fashion-k2',
      name: 'Denim Overalls',
      category: 'Kids',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 67,
      stock: 18,
      description: 'Adorable denim overalls for everyday play'
    }
  ],
  footwear: [
    {
      id: 'fashion-f1',
      name: 'Running Sneakers',
      category: 'Footwear',
      price: 129.99,
      originalPrice: 159.99,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 234,
      stock: 28,
      isNew: true,
      description: 'High-performance running sneakers'
    },
    {
      id: 'fashion-f2',
      name: 'Leather Boots',
      category: 'Footwear',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 156,
      stock: 15,
      description: 'Premium leather boots for winter'
    }
  ],
  accessories: [
    {
      id: 'fashion-a1',
      name: 'Designer Handbag',
      category: 'Accessories',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 187,
      stock: 12,
      isNew: true,
      description: 'Elegant designer handbag for special occasions'
    },
    {
      id: 'fashion-a2',
      name: 'Silk Scarf',
      category: 'Accessories',
      price: 45.99,
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 98,
      stock: 22,
      description: 'Luxurious silk scarf with elegant patterns'
    }
  ]
};

const Fashion = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceFilter, setPriceFilter] = useState('all');
  const { addToCart } = useCart();

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'all' || (hash && Object.keys(fashionProducts).includes(hash))) {
        setActiveTab(hash || 'all');
      }
    };

    // Set initial tab from hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const getAllProducts = () => {
    return Object.values(fashionProducts).flat();
  };

  const getFilteredProducts = () => {
    let products = activeTab === 'all' ? getAllProducts() : fashionProducts[activeTab as keyof typeof fashionProducts] || [];
    
    // Apply price filter
    if (priceFilter === 'under-50') {
      products = products.filter(p => p.price < 50);
    } else if (priceFilter === '50-100') {
      products = products.filter(p => p.price >= 50 && p.price <= 100);
    } else if (priceFilter === 'over-100') {
      products = products.filter(p => p.price > 100);
    }

    // Apply sorting
    if (sortBy === 'price-low') {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      products = [...products].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      products = [...products].sort((a, b) => b.rating - a.rating);
    }

    return products;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Fashion Collection 2024
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Discover Your Style
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our curated collection of fashion-forward clothing and accessories for men, women, and kids.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="px-8 py-3">
              Shop New Arrivals
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              <TrendingUp className="w-5 h-5 mr-2" />
              Trending Now
            </Button>
          </div>
        </div>
      </section>

      {/* Fashion Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you're looking for in our organized collections
            </p>
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-wrap gap-4 justify-between items-center mb-8 p-4 bg-card rounded-lg border">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All Prices</option>
                <option value="under-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="over-100">Over $100</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <span>🛍️</span>
                All
              </TabsTrigger>
              <TabsTrigger value="men" className="flex items-center gap-2">
                <span>👨</span>
                Men
              </TabsTrigger>
              <TabsTrigger value="women" className="flex items-center gap-2">
                <span>👩</span>
                Women
              </TabsTrigger>
              <TabsTrigger value="kids" className="flex items-center gap-2">
                <span>🧒</span>
                Kids
              </TabsTrigger>
              <TabsTrigger value="footwear" className="flex items-center gap-2">
                <span>👟</span>
                Footwear
              </TabsTrigger>
              <TabsTrigger value="accessories" className="flex items-center gap-2">
                <span>👜</span>
                Accessories
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8" id="all">
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {getFilteredProducts().map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow p-4"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-md"
                      />
                      {product.isNew && (
                        <Badge className="absolute top-2 left-2" variant="secondary">
                          New
                        </Badge>
                      )}
                      {product.originalPrice && (
                        <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="text-sm ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({product.reviews})</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {Object.keys(fashionProducts).map((category) => (
              <TabsContent key={category} value={category} className="mt-8" id={category}>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getFilteredProducts().map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow p-4"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative mb-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-md"
                        />
                        {product.isNew && (
                          <Badge className="absolute top-2 left-2" variant="secondary">
                            New
                          </Badge>
                        )}
                        {product.originalPrice && (
                          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="text-sm ml-1">{product.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">({product.reviews})</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        
                        <Button 
                          className="w-full mt-4" 
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Featured Deals
            </h2>
            <p className="text-lg text-muted-foreground">
              Don't miss out on these amazing offers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getAllProducts()
              .filter(p => p.originalPrice)
              .slice(0, 6)
              .map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-primary">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <>
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice}
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Fashion;