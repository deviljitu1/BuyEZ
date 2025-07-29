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
import { AiChat } from '@/components/AiChat';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Rewards from './pages/Rewards';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Grocery from './pages/Grocery';
import Mobiles from './pages/Mobiles';
import Fashion from './pages/Fashion';
import { Appliances } from './pages/Appliances';

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
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/grocery" element={<Grocery />} />
            <Route path="/mobiles" element={<Mobiles />} />
            <Route path="/fashion" element={<Fashion />} />
            <Route path="/fashion/:category" element={<Fashion />} />
            <Route path="/appliances" element={<Appliances />} />
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
          <AiChat />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
};

export default App;
