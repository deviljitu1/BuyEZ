-- Create grocery categories table
CREATE TABLE public.grocery_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for grocery categories
ALTER TABLE public.grocery_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to grocery categories
CREATE POLICY "Grocery categories are viewable by everyone"
    ON public.grocery_categories
    FOR SELECT
    USING (true);

-- Create grocery products table
CREATE TABLE public.grocery_products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES public.grocery_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    unit TEXT NOT NULL,
    image_url TEXT NOT NULL,
    rating NUMERIC DEFAULT 4.0,
    delivery_time TEXT DEFAULT '10 mins',
    discount INTEGER,
    stock INTEGER NOT NULL DEFAULT 0,
    is_organic BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for grocery products
ALTER TABLE public.grocery_products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to grocery products
CREATE POLICY "Grocery products are viewable by everyone"
    ON public.grocery_products
    FOR SELECT
    USING (true);

-- Create trigger for updating timestamps on grocery products
CREATE TRIGGER update_grocery_products_updated_at
    BEFORE UPDATE ON public.grocery_products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert grocery categories
INSERT INTO public.grocery_categories (name, icon, description) VALUES
('Fruits & Vegetables', '🥬', 'Fresh fruits and organic vegetables'),
('Dairy & Eggs', '🥛', 'Milk, yogurt, cheese and fresh eggs'),
('Snacks', '🍿', 'Chips, cookies and healthy snacks'),
('Beverages', '🥤', 'Juices, sodas and energy drinks'),
('Bakery', '🍞', 'Fresh bread, cakes and pastries'),
('Personal Care', '🧴', 'Soaps, shampoos and hygiene products'),
('Household', '🧽', 'Cleaning supplies and home essentials'),
('Baby Care', '🍼', 'Baby food, diapers and care products');

-- Insert sample grocery products
INSERT INTO public.grocery_products (category_id, name, price, original_price, unit, image_url, rating, delivery_time, discount, stock, is_organic) VALUES
((SELECT id FROM public.grocery_categories WHERE name = 'Fruits & Vegetables' LIMIT 1), 'Fresh Bananas', 40, 50, '1 kg', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop', 4.5, '10 mins', 20, 25, true),
((SELECT id FROM public.grocery_categories WHERE name = 'Dairy & Eggs' LIMIT 1), 'Amul Fresh Milk', 28, NULL, '500 ml', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop', 4.7, '8 mins', NULL, 50, false),
((SELECT id FROM public.grocery_categories WHERE name = 'Snacks' LIMIT 1), 'Lays Classic', 20, 25, '52g', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop', 4.3, '12 mins', 20, 30, false),
((SELECT id FROM public.grocery_categories WHERE name = 'Beverages' LIMIT 1), 'Coca Cola', 40, NULL, '750 ml', 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=300&fit=crop', 4.6, '10 mins', NULL, 20, false),
((SELECT id FROM public.grocery_categories WHERE name = 'Bakery' LIMIT 1), 'Brown Bread', 35, NULL, '400g', 'https://images.unsplash.com/photo-1509440159596-0249440159596?w=300&h=300&fit=crop', 4.4, '15 mins', NULL, 15, false),
((SELECT id FROM public.grocery_categories WHERE name = 'Fruits & Vegetables' LIMIT 1), 'Red Apples', 120, 150, '1 kg', 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300&h=300&fit=crop', 4.8, '10 mins', 20, 35, true),
((SELECT id FROM public.grocery_categories WHERE name = 'Personal Care' LIMIT 1), 'Dove Soap', 45, 55, '100g', 'https://images.unsplash.com/photo-1585071267857-189222435891?w=300&h=300&fit=crop', 4.5, '15 mins', 18, 40, false),
((SELECT id FROM public.grocery_categories WHERE name = 'Household' LIMIT 1), 'Surf Excel', 85, 100, '1 kg', 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&h=300&fit=crop', 4.6, '12 mins', 15, 20, false);