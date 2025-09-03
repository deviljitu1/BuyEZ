import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export function useGroceryCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.product_id === productId);
      
      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (error) throw error;
        
        setCartItems(items => 
          items.map(item => 
            item.id === existingItem.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert([{
            product_id: productId,
            quantity: 1,
            user_id: user.id
          }])
          .select()
          .single();

        if (error) throw error;
        setCartItems(items => [data, ...items]);
      }

      toast({
        title: "Added to Cart",
        description: "Item added successfully",
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

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      const existingItem = cartItems.find(item => item.product_id === productId);
      if (!existingItem) return;

      if (existingItem.quantity > 1) {
        // Decrease quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity - 1 })
          .eq('id', existingItem.id);

        if (error) throw error;
        
        setCartItems(items => 
          items.map(item => 
            item.id === existingItem.id 
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      } else {
        // Remove item completely
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', existingItem.id);

        if (error) throw error;
        
        setCartItems(items => items.filter(item => item.id !== existingItem.id));
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
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cartItems.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    loading,
    user,
    addToCart,
    removeFromCart,
    clearCart,
    getCartItemQuantity,
    totalItems,
    refetch: fetchCartItems,
  };
}