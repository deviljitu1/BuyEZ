import { useWishlist } from '@/hooks/useWishlist';
import { useUnifiedCart } from '@/hooks/useUnifiedCart';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useUnifiedCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight flex items-center gap-2">
            <Heart className="w-7 h-7 text-red-500" /> Wishlist
          </h1>
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearWishlist}>
              <Trash2 className="w-4 h-4 mr-1" /> Clear All
            </Button>
          )}
        </div>
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            Your wishlist is empty.<br />
            <Link to="/products" className="text-primary underline">Browse products</Link> to add some!
          </div>
        ) : (
          <div className="grid gap-6">
            {items.map(product => (
              <Card key={product.id} className="flex flex-col sm:flex-row items-center gap-4 p-4">
                <img src={product.image} alt={product.name} className="w-24 h-24 rounded-lg object-cover border" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg truncate">{product.name}</div>
                  <div className="text-sm text-muted-foreground mb-2">{product.category}</div>
                  <div className="font-bold text-primary text-xl mb-2">${product.price.toFixed(2)}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" onClick={() => addToCart(product)}>
                      <ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => removeFromWishlist(product.id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 