-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  is_pandit BOOLEAN DEFAULT FALSE,
  phone TEXT,
  address TEXT,
  specialization TEXT,
  experience_years INTEGER,
  rate_per_hour INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create shop_items table
CREATE TABLE public.shop_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on shop_items
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  pandit_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  puja_type TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  address TEXT NOT NULL,
  special_requirements TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  total_amount INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  shop_item_id UUID REFERENCES public.shop_items(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, shop_item_id)
);

-- Enable RLS on cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Everyone can view pandit profiles" ON public.profiles
  FOR SELECT USING (is_pandit = true);

-- RLS Policies for shop_items
CREATE POLICY "Everyone can view shop items" ON public.shop_items
  FOR SELECT USING (true);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = pandit_id);

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Pandits can update their bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = pandit_id);

-- RLS Policies for cart_items
CREATE POLICY "Users can manage their own cart" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Insert sample shop items
INSERT INTO public.shop_items (name, description, price, image_url) VALUES
('Rudraksha Pendant', 'Original Rudraksha mala pendant for peace and spiritual power.', 299, 'https://images.pexels.com/photos/8832825/pexels-photo-8832825.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Pure Ghee Diya', 'Ready-to-use pure ghee diya pack for daily puja rituals.', 149, 'https://images.pexels.com/photos/6113355/pexels-photo-6113355.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Havan Samagri Pack', 'Premium havan samagri pack with natural ingredients for spiritual ceremonies.', 199, 'https://images.pexels.com/photos/8832770/pexels-photo-8832770.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Puja Thali Set', 'Complete puja thali set including all essential items.', 499, 'https://images.pexels.com/photos/8832804/pexels-photo-8832804.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Agarbatti (Incense Sticks)', 'Long-lasting fragrance agarbatti for meditation and prayer.', 99, 'https://images.pexels.com/photos/6707628/pexels-photo-6707628.jpeg?auto=compress&cs=tinysrgb&w=800');

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_pandit)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'is_pandit')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();