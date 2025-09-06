-- Create products table for unified cart system
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  image TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  sku TEXT,
  brand TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table for unified cart
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products (public read access)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Create RLS policies for cart_items (user-specific access)
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
ON public.cart_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
ON public.cart_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample products
INSERT INTO public.products (name, description, price, category, image, rating, reviews_count, stock_quantity, sku, brand) VALUES
  ('iPhone 14 Pro', 'Latest iPhone with Pro camera system', 999.99, 'Electronics', '/placeholder.svg', 4.8, 1205, 50, 'IPHONE14PRO', 'Apple'),
  ('MacBook Pro', 'High-performance laptop for professionals', 1999.99, 'Electronics', '/placeholder.svg', 4.9, 892, 25, 'MACBOOKPRO', 'Apple'),
  ('AirPods Pro', 'Wireless earbuds with noise cancellation', 249.99, 'Electronics', '/placeholder.svg', 4.7, 2341, 100, 'AIRPODSPRO', 'Apple'),
  ('Samsung Galaxy S23', 'Latest Samsung flagship smartphone', 799.99, 'Electronics', '/placeholder.svg', 4.6, 987, 75, 'GALAXYS23', 'Samsung'),
  ('Nike Air Max', 'Comfortable running shoes', 129.99, 'Fashion', '/placeholder.svg', 4.5, 567, 200, 'NIKEAIRMAX', 'Nike'),
  ('Organic Bananas', 'Fresh organic bananas', 2.99, 'Grocery', '/placeholder.svg', 4.3, 123, 500, 'BANANAS', 'Organic Farms'),
  ('Whole Milk', 'Fresh whole milk 1L', 3.49, 'Grocery', '/placeholder.svg', 4.4, 89, 300, 'MILK1L', 'DairyFresh'),
  ('Bread Loaf', 'Whole wheat bread loaf', 2.49, 'Grocery', '/placeholder.svg', 4.2, 76, 150, 'BREADWW', 'Baker''s Choice')
ON CONFLICT (id) DO NOTHING;