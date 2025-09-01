-- Create categories table for two-wheelers
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create two-wheeler products table
CREATE TABLE public.two_wheeler_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  description TEXT,
  specifications JSONB,
  image_url TEXT NOT NULL,
  gallery_images TEXT[],
  engine_capacity TEXT,
  fuel_type TEXT CHECK (fuel_type IN ('Petrol', 'Electric', 'Diesel')),
  mileage TEXT,
  top_speed TEXT,
  rating DECIMAL(2,1) DEFAULT 4.0,
  review_count INTEGER DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for users
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  pincode TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.two_wheeler_products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  delivery_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.two_wheeler_products(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.two_wheeler_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public read policies for categories and products
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.two_wheeler_products FOR SELECT USING (true);

-- Profile policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Cart policies
CREATE POLICY "Users can view their own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cart items" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Order policies
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their own order items" ON public.order_items 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

-- Insert sample categories
INSERT INTO public.categories (name, description, image_url) VALUES
('Motorcycles', 'High-performance motorcycles for adventure and commuting', '/api/placeholder/300/200'),
('Scooters', 'Convenient and fuel-efficient scooters for city rides', '/api/placeholder/300/200'),
('Electric Bikes', 'Eco-friendly electric two-wheelers', '/api/placeholder/300/200'),
('Sports Bikes', 'High-speed sports and racing motorcycles', '/api/placeholder/300/200');

-- Insert sample two-wheeler products
INSERT INTO public.two_wheeler_products (name, brand, category_id, price, original_price, description, specifications, image_url, engine_capacity, fuel_type, mileage, top_speed, rating, review_count, stock, is_featured, is_new) 
SELECT 
  'Honda CB Shine SP', 
  'Honda', 
  c.id, 
  78000.00, 
  82000.00,
  'Reliable and fuel-efficient motorcycle perfect for daily commuting',
  '{"transmission": "Manual", "brakes": "Drum/Disc", "warranty": "2 years"}'::jsonb,
  '/api/placeholder/400/300',
  '125cc',
  'Petrol',
  '65 kmpl',
  '100 kmph',
  4.2,
  1247,
  15,
  true,
  false
FROM public.categories c WHERE c.name = 'Motorcycles';

INSERT INTO public.two_wheeler_products (name, brand, category_id, price, original_price, description, specifications, image_url, engine_capacity, fuel_type, mileage, top_speed, rating, review_count, stock, is_featured, is_new)
SELECT 
  'Hero Electric Optima',
  'Hero Electric',
  c.id,
  65000.00,
  70000.00,
  'Eco-friendly electric scooter with long-range battery',
  '{"battery": "Lithium-ion", "charging_time": "4-5 hours", "range": "82 km"}'::jsonb,
  '/api/placeholder/400/300',
  'Electric Motor',
  'Electric',
  '82 km per charge',
  '45 kmph',
  4.0,
  856,
  12,
  true,
  true
FROM public.categories c WHERE c.name = 'Electric Bikes';

INSERT INTO public.two_wheeler_products (name, brand, category_id, price, original_price, description, specifications, image_url, engine_capacity, fuel_type, mileage, top_speed, rating, review_count, stock, is_featured)
SELECT 
  'TVS Jupiter 125',
  'TVS',
  c.id,
  73000.00,
  76000.00,
  'Stylish and comfortable scooter with premium features',
  '{"storage": "33L", "ground_clearance": "165mm", "kerb_weight": "108kg"}'::jsonb,
  '/api/placeholder/400/300',
  '125cc',
  'Petrol',
  '62 kmpl',
  '87 kmph',
  4.1,
  923,
  8,
  true
FROM public.categories c WHERE c.name = 'Scooters';

-- Create function for automatic updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_two_wheeler_products_updated_at
  BEFORE UPDATE ON public.two_wheeler_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();