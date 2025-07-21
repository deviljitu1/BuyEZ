import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Products from "./pages/Products.tsx";
import Categories from "./pages/Categories.tsx";
import About from "./pages/About.tsx";
import { Header } from "@/components/Header";
import { Cart } from '@/components/Cart';
import { useCart } from '@/hooks/useCart';
import ProductDetail from './pages/ProductDetail.tsx';
import { lazy } from 'react';
import Checkout from './pages/Checkout.tsx';
import OrderConfirm from './pages/OrderConfirm.tsx';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';

const queryClient = new QueryClient();

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, addToCart, updateQuantity, removeFromCart, getCartCount } = useCart();

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
          <Header cartCount={getCartCount()} onCartClick={() => setIsCartOpen(true)} />
        <Routes>
            <Route path="/" element={<Index addToCart={addToCart} />} />
            <Route path="/products" element={<Products addToCart={addToCart} />} />
            <Route path="/categories" element={<Categories addToCart={addToCart} />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirm" element={<OrderConfirm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<SearchResults />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={items}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
          />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
};

export default App;
