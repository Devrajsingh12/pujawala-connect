-- Update profiles table
ALTER TABLE public.profiles 
  ADD COLUMN user_type TEXT CHECK (user_type IN ('user', 'pandit')),
  ADD COLUMN experience INTEGER,
  ADD COLUMN location TEXT,
  ADD COLUMN rate_per_ceremony INTEGER,
  ADD COLUMN profile_pic_url TEXT;

-- Migrate existing data
UPDATE public.profiles 
SET user_type = CASE 
  WHEN is_pandit = true THEN 'pandit' 
  ELSE 'user' 
END;

UPDATE public.profiles 
SET experience = experience_years 
WHERE experience_years IS NOT NULL;

UPDATE public.profiles 
SET location = address 
WHERE address IS NOT NULL;

UPDATE public.profiles 
SET rate_per_ceremony = rate_per_hour 
WHERE rate_per_hour IS NOT NULL;

-- Remove old columns
ALTER TABLE public.profiles 
  DROP COLUMN is_pandit,
  DROP COLUMN phone,
  DROP COLUMN address,
  DROP COLUMN experience_years,
  DROP COLUMN rate_per_hour;

-- Make user_type required
ALTER TABLE public.profiles 
  ALTER COLUMN user_type SET NOT NULL;

-- Update bookings table
ALTER TABLE public.bookings 
  ADD COLUMN ceremony_type TEXT,
  ADD COLUMN date DATE,
  ADD COLUMN additional_notes TEXT;

-- Migrate existing data
UPDATE public.bookings 
SET ceremony_type = puja_type 
WHERE puja_type IS NOT NULL;

UPDATE public.bookings 
SET date = preferred_date 
WHERE preferred_date IS NOT NULL;

UPDATE public.bookings 
SET additional_notes = special_requirements 
WHERE special_requirements IS NOT NULL;

-- Remove old columns
ALTER TABLE public.bookings 
  DROP COLUMN puja_type,
  DROP COLUMN preferred_date,
  DROP COLUMN preferred_time,
  DROP COLUMN address,
  DROP COLUMN special_requirements,
  DROP COLUMN total_amount;

-- Make ceremony_type and date required
ALTER TABLE public.bookings 
  ALTER COLUMN ceremony_type SET NOT NULL,
  ALTER COLUMN date SET NOT NULL;

-- Update shop_items table
ALTER TABLE public.shop_items 
  ADD COLUMN title TEXT,
  ADD COLUMN stock INTEGER DEFAULT 0;

-- Migrate existing data
UPDATE public.shop_items 
SET title = name 
WHERE name IS NOT NULL;

-- Remove old columns
ALTER TABLE public.shop_items 
  DROP COLUMN name,
  DROP COLUMN created_at;

-- Make title required
ALTER TABLE public.shop_items 
  ALTER COLUMN title SET NOT NULL;

-- Update cart_items table
ALTER TABLE public.cart_items 
  ADD COLUMN item_id UUID;

-- Migrate existing data
UPDATE public.cart_items 
SET item_id = shop_item_id 
WHERE shop_item_id IS NOT NULL;

-- Remove old columns
ALTER TABLE public.cart_items 
  DROP COLUMN shop_item_id,
  DROP COLUMN created_at;

-- Make item_id required
ALTER TABLE public.cart_items 
  ALTER COLUMN item_id SET NOT NULL;

-- Update RLS policies for profiles table to use user_type
DROP POLICY IF EXISTS "Everyone can view pandit profiles" ON public.profiles;
CREATE POLICY "Everyone can view pandit profiles" 
ON public.profiles 
FOR SELECT 
USING (user_type = 'pandit');