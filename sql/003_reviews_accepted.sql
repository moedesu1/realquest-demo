-- ============================================================
-- REAL QUEST — Phase 3: Reviews & Accepted Quests
-- Run in Supabase SQL Editor
-- ============================================================

-- Reviews table
CREATE TABLE public.reviews (
  id SERIAL PRIMARY KEY,
  quest_id INTEGER REFERENCES public.quests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT NOT NULL,
  sub_ratings JSONB DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(quest_id, user_id)
);

-- Accepted quests table
CREATE TABLE public.accepted_quests (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id INTEGER REFERENCES public.quests(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'accepted',
  shopify_order_id TEXT,
  accepted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accepted_quests ENABLE ROW LEVEL SECURITY;

-- Reviews: everyone can read, authenticated users can insert their own
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Accepted quests: users can see/insert their own
CREATE POLICY "Users can view own accepted quests"
  ON public.accepted_quests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accepted quests"
  ON public.accepted_quests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger: auto-update quest review_avg and review_count on review insert
CREATE OR REPLACE FUNCTION public.update_quest_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.quests
  SET
    review_avg = (SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE quest_id = NEW.quest_id),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE quest_id = NEW.quest_id)
  WHERE id = NEW.quest_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_quest_review_stats();

CREATE TRIGGER on_review_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_quest_review_stats();
