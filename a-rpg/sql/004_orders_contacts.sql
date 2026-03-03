-- ============================================================
-- REAL QUEST — Phase 5: Orders & Contact Submissions
-- Run in Supabase SQL Editor
-- ============================================================

-- Orders table (synced from Shopify via webhook)
CREATE TABLE public.orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  shopify_order_id TEXT UNIQUE NOT NULL,
  shopify_order_number TEXT,
  status TEXT DEFAULT 'pending',
  total_price INTEGER NOT NULL,
  line_items JSONB DEFAULT '[]',
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact form submissions
CREATE TABLE public.contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  contact_type TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Orders: users can see their own
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Contact submissions: anyone can insert (no auth required for contact form)
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);
