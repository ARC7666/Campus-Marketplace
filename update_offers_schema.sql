-- ============================================================
-- Update Offers Table Schema to match Application Logic
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Ensure the 'offers' table exists (if not already)
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT,
    product_image TEXT,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    original_price NUMERIC,
    message TEXT,
    payment_method TEXT,
    delivery_preference TEXT,
    status TEXT DEFAULT 'pending',
    counter_amount NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Add missing columns if they were skipped by 'IF NOT EXISTS' above
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS amount NUMERIC;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS delivery_preference TEXT;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS counter_amount NUMERIC;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS original_price NUMERIC;

-- 3. Ensure the 'conversations' table has the necessary columns
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS last_message TEXT;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 4. Re-apply RLS policies
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Buyers can insert offers" ON public.offers;
    CREATE POLICY "Buyers can insert offers"
      ON public.offers FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = buyer_id);
      
    DROP POLICY IF EXISTS "Users can view their offers" ON public.offers;
    CREATE POLICY "Users can view their offers"
      ON public.offers FOR SELECT
      TO authenticated
      USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
      
    DROP POLICY IF EXISTS "Sellers can update received offers" ON public.offers;
    CREATE POLICY "Sellers can update received offers"
      ON public.offers FOR UPDATE
      TO authenticated
      USING (auth.uid() = seller_id OR auth.uid() = buyer_id);
END $$;
