-- ============================================================
-- REAL QUEST — Phase 5b: Review Likes
-- Run in Supabase SQL Editor
-- ============================================================

-- Review likes table (one like per user per review)
CREATE TABLE public.review_likes (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- RLS
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

-- Everyone can see likes (for count display)
CREATE POLICY "Review likes are viewable by everyone"
  ON public.review_likes FOR SELECT
  USING (true);

-- Authenticated users can insert their own likes
CREATE POLICY "Authenticated users can like reviews"
  ON public.review_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own likes
CREATE POLICY "Users can unlike their own likes"
  ON public.review_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger: auto-update reviews.likes_count on like insert/delete
CREATE OR REPLACE FUNCTION public.update_review_likes_count()
RETURNS TRIGGER AS $$
DECLARE
  target_review_id INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_review_id := OLD.review_id;
  ELSE
    target_review_id := NEW.review_id;
  END IF;

  UPDATE public.reviews
  SET likes_count = (
    SELECT COUNT(*) FROM public.review_likes WHERE review_id = target_review_id
  )
  WHERE id = target_review_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_like_insert
  AFTER INSERT ON public.review_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_review_likes_count();

CREATE TRIGGER on_review_like_delete
  AFTER DELETE ON public.review_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_review_likes_count();
