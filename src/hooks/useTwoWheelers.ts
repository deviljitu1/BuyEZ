import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TwoWheelerProduct {
  id: string;
  name: string;
  brand: string;
  category_id: string;
  price: number;
  original_price: number | null;
  description: string | null;
  specifications: any;
  image_url: string;
  gallery_images: string[] | null;
  engine_capacity: string | null;
  fuel_type: string | null;
  mileage: string | null;
  top_speed: string | null;
  rating: number;
  review_count: number;
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  status: string;
  categories?: {
    name: string;
  };
}

export const useTwoWheelers = (categoryFilter?: string) => {
  const [products, setProducts] = useState<TwoWheelerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('two_wheeler_products')
          .select(`
            *,
            categories(name)
          `)
          .eq('status', 'active')
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (categoryFilter && categoryFilter !== 'all') {
          // First get the category ID
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('name', categoryFilter)
            .single();

          if (categoryData) {
            query = query.eq('category_id', categoryData.id);
          }
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter]);

  return { products, loading, error, refetch: () => {
    setLoading(true);
    setError(null);
  }};
};