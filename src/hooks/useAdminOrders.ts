import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminOrder {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_method: string | null;
  payment_status: string;
  delivery_address: any;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('grocery_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, refetch: fetchOrders };
}