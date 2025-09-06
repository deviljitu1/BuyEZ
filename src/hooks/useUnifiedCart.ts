import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { mockProducts } from '@/data/mockProducts';

interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

interface CartItemWithProduct extends CartItem {
  product: Product;
}

export const useUnifiedCart = () => {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Initialize user and fetch cart
  useEffect(() => {
    const initializeCart = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      
      if (currentUser) {
        await fetchCartItems(currentUser.id);
      } else {
        // Load from localStorage for anonymous users
        loadLocalCart();
      }
    };

    initializeCart();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchCartItems(session.user.id);
      } else {
        setUser(null);
        setCartItems([]);
        loadLocalCart();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadLocalCart = () => {
    try {
      const savedCart = localStorage.getItem('shopez-unified-cart');
      if (savedCart) {
        const localItems: CartItemWithProduct[] = JSON.parse(savedCart);
        setCartItems(localItems);
      }
    } catch (error) {
      console.error('Error loading local cart:', error);
    }
  };

  const saveLocalCart = (items: CartItemWithProduct[]) => {
    try {
      localStorage.setItem('shopez-unified-cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  };

  const fetchCartItems = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      // Manually join with product data from mock products
      const itemsWithProducts: CartItemWithProduct[] = (data || []).map(item => {
        const product = mockProducts.find(p => p.id === item.product_id);
        if (product) {
          return {
            ...item,
            product
          };
        }
        return null;
      }).filter(Boolean) as CartItemWithProduct[];

      setCartItems(itemsWithProducts);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      if (!user) {
        // Handle anonymous user with localStorage
        const existingItem = cartItems.find(item => item.product_id === product.id);
        let updatedItems: CartItemWithProduct[];

        if (existingItem) {
          updatedItems = cartItems.map(item =>
            item.product_id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newItem: CartItemWithProduct = {
            id: `local-${Date.now()}`,
            user_id: 'anonymous',
            product_id: product.id,
            quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            product
          };
          updatedItems = [...cartItems, newItem];
        }

        setCartItems(updatedItems);
        saveLocalCart(updatedItems);
        
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart`,
        });
        return;
      }

      // Handle authenticated user with Supabase
      const existingItem = cartItems.find(item => item.product_id === product.id);

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity
          });

        if (error) throw error;
      }

      await fetchCartItems(user.id);
      
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    try {
      if (!user) {
        // Handle anonymous user
        const updatedItems = cartItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        setCartItems(updatedItems);
        saveLocalCart(updatedItems);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
      await fetchCartItems(user.id);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (!user) {
        // Handle anonymous user
        const item = cartItems.find(item => item.id === itemId);
        const updatedItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedItems);
        saveLocalCart(updatedItems);
        
        if (item?.product) {
          toast({
            title: "Removed from Cart",
            description: `${item.product.name} has been removed from your cart`,
          });
        }
        return;
      }

      const item = cartItems.find(item => item.id === itemId);
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      await fetchCartItems(user.id);
      
      if (item?.product) {
        toast({
          title: "Removed from Cart",
          description: `${item.product.name} has been removed from your cart`,
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      if (!user) {
        // Handle anonymous user
        setCartItems([]);
        localStorage.removeItem('shopez-unified-cart');
        
        toast({
          title: "Cart Cleared",
          description: "All items have been removed from your cart",
        });
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      
      setCartItems([]);
      
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart",
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  const getCartItemQuantity = (productId: string): number => {
    const item = cartItems.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Convert cart items to the format expected by existing components
  const items = cartItems.map(item => ({
    ...item.product,
    quantity: item.quantity,
    id: item.product_id
  }));

  return {
    cartItems,
    items, // For backward compatibility
    loading,
    user,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItemQuantity,
    getCartTotal,
    getCartCount,
    totalItems: getCartCount()
  };
};