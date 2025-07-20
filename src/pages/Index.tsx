import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { Cart } from '@/components/Cart';
import { useCart } from '@/hooks/useCart';
import { mockProducts } from '@/data/mockProducts';

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, addToCart, updateQuantity, removeFromCart, getCartCount } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartCount={getCartCount()} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      <main>
        <Hero />
        <ProductGrid 
          products={mockProducts} 
          onAddToCart={addToCart} 
        />
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
};

export default Index;
