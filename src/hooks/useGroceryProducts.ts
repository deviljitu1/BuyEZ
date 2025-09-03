import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GroceryProduct {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  unit: string;
  image_url: string;
  rating: number;
  delivery_time: string;
  discount: number | null;
  stock: number;
  is_organic: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  // Joined category data
  category?: {
    name: string;
    icon: string;
  };
}

export function useGroceryProducts() {
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('grocery_products')
        .select(`
          *,
          category:grocery_categories(name, icon)
        `)
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
}