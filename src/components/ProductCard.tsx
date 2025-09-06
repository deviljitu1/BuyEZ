import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { Link } from 'react-router-dom';
import { useUnifiedCart } from '@/hooks/useUnifiedCart';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { items, updateQuantity } = useUnifiedCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const liked = isInWishlist(product.id);

  const cartItem = items.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
    onAddToCart(product);
    setIsLoading(false);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="block group cursor-pointer border-0 bg-card shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-scale-in h-96 min-h-[400px] flex flex-col">
      <Card className="h-full flex flex-col">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Image Container */}
          <div className="relative overflow-hidden rounded-t-lg flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-44 xs:h-52 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay Actions (centered on image, as before) */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
              <Button
                variant={liked ? 'destructive' : 'secondary'}
                size="icon"
                className="bg-background/90 hover:bg-background shadow-lg"
                onClick={e => {
                  e.preventDefault();
                  liked ? removeFromWishlist(product.id) : addToWishlist(product);
                }}
                title={liked ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 transition-colors ${liked ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary-glow shadow-lg transform transition-transform hover:scale-105"
                onClick={e => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                disabled={isLoading}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                {isLoading ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>
          </div>
          {/* Content */}
          <div className="flex flex-col justify-between flex-1 p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div>
              {/* Category */}
              <div className="text-[11px] sm:text-xs font-medium text-primary uppercase tracking-wide">
                {product.category}
              </div>
              {/* Title */}
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2 text-base sm:text-lg">
                {product.name}
              </h3>
              {/* Rating */}
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-warning fill-current'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] sm:text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>
            </div>
            <div>
              {/* Price and Actions Row */}
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-foreground">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs sm:text-sm text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-warning text-warning-foreground">
                    -{discountPercentage}%
                  </Badge>
                )}
                {/* Quantity Selector */}
                {quantity > 0 && (
                  <div className="flex items-center space-x-2 ml-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 min-w-6 min-h-6"
                      onClick={e => {
                        e.preventDefault();
                        updateQuantity(product.id, Math.max(0, quantity - 1));
                      }}
                    >
                      <span className="text-base">-</span>
                    </Button>
                    <span className="text-xs sm:text-sm font-medium w-6 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 min-w-6 min-h-6"
                      onClick={e => {
                        e.preventDefault();
                        updateQuantity(product.id, quantity + 1);
                      }}
                    >
                      <span className="text-base">+</span>
                    </Button>
                  </div>
                )}
              </div>
              {/* Stock Badge */}
              {product.stock < 5 && product.stock > 0 && (
                <div>
                  <Badge variant="destructive" className="text-xs">
                    Only {product.stock} left
                  </Badge>
                </div>
              )}
              {/* Quick Add Button - Mobile */}
              <Button
                variant="outline"
                size="sm"
                className="w-full md:hidden mt-2 text-sm"
                onClick={e => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                disabled={isLoading}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isLoading ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};