-- Add admin role to profiles table
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create grocery_cart_items table for persistent cart
CREATE TABLE public.grocery_cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.grocery_products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on grocery_cart_items
ALTER TABLE public.grocery_cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for grocery_cart_items
CREATE POLICY "Users can manage their own cart items" 
ON public.grocery_cart_items 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create grocery_orders table
CREATE TABLE public.grocery_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  delivery_address JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on grocery_orders
ALTER TABLE public.grocery_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for grocery_orders
CREATE POLICY "Users can view their own orders" 
ON public.grocery_orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.grocery_orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Admin can view and update all orders
CREATE POLICY "Admins can view all orders" 
ON public.grocery_orders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update all orders" 
ON public.grocery_orders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create grocery_order_items table
CREATE TABLE public.grocery_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.grocery_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.grocery_products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price_at_time NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on grocery_order_items
ALTER TABLE public.grocery_order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for grocery_order_items
CREATE POLICY "Users can view their own order items" 
ON public.grocery_order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.grocery_orders 
    WHERE id = grocery_order_items.order_id AND user_id = auth.uid()
  )
);

-- Admin policies for grocery products and categories
CREATE POLICY "Admins can manage grocery products" 
ON public.grocery_products 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage grocery categories" 
ON public.grocery_categories 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_grocery_cart_items_updated_at
BEFORE UPDATE ON public.grocery_cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grocery_orders_updated_at
BEFORE UPDATE ON public.grocery_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();