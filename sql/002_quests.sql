-- ============================================================
-- REAL QUEST — Phase 2: Quests & Quest Items Tables
-- Run in Supabase SQL Editor
-- ============================================================

-- Quests table
CREATE TABLE public.quests (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  rank TEXT NOT NULL DEFAULT 'C',
  difficulty INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL,
  category TEXT,
  format TEXT,
  genre TEXT,
  sub_genre TEXT,
  is_new BOOLEAN DEFAULT false,
  image_url TEXT,
  estimated_time TEXT,
  players TEXT,
  region TEXT,
  purposes TEXT[] DEFAULT '{}',
  prologue TEXT,
  cautions TEXT[] DEFAULT '{}',
  review_avg NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  shopify_product_id TEXT,
  shopify_variant_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quest items (included items in each quest)
CREATE TABLE public.quest_items (
  id SERIAL PRIMARY KEY,
  quest_id INTEGER REFERENCES public.quests(id) ON DELETE CASCADE,
  icon TEXT DEFAULT '◆',
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- RLS
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published quests are viewable by everyone"
  ON public.quests FOR SELECT
  USING (is_published = true);

CREATE POLICY "Quest items are viewable by everyone"
  ON public.quest_items FOR SELECT
  USING (true);

-- Seed data: 6 quests
INSERT INTO public.quests (id, title, tagline, rank, difficulty, price, category, format, genre, sub_genre, is_new, image_url, estimated_time, players, region, purposes, prologue, cautions, review_avg, review_count, sales_count) VALUES
(1, '大阪怪奇事件ファイル', '未解決事件の真相が、あなたの手元に届く——', 'B', 2, 3000, 'beginner', 'home', '推理', 'ミステリー', true, 'images/quest-1-alchemy.webp', '2〜4時間', '1〜3人', '自宅完結', ARRAY['puzzle', 'home'], '大阪で起きた連続怪奇事件——目撃者の証言は矛盾だらけ、現場には説明のつかない痕跡が残されていた。捜査本部がギルドに依頼した資料一式があなたの元に届く。封筒の中の鍵は、何を開けるためのものなのか。真相は、証拠の中に隠されている。', ARRAY['ネタバレ禁止', '筆記用具をご用意ください', '対象年齢: 12歳以上'], 4.7, 24, 156),
(2, '奈良・消えた鹿の暗号', '古都に眠る暗号が、あなたを導く——', 'A', 3, 3500, 'advanced', 'hybrid', '暗号解読', '歴史冒険', false, 'images/quest-2-library.webp', '3〜5時間', '1〜4人', '奈良', ARRAY['puzzle', 'outdoor'], '奈良公園の鹿が一頭、忽然と姿を消した。ただの迷子ではない——その鹿は、千年前から受け継がれてきた「神鹿」だった。古びた手紙に記された暗号を解けば、消えた鹿の行方と、古都に隠された秘密に辿り着ける。', ARRAY['ネタバレ禁止', '現地ステージあり（奈良市内）', '歩きやすい服装推奨', '対象年齢: 12歳以上'], 4.5, 18, 112),
(3, '古い携帯の未送信メッセージ', '10年前の想いが、今あなたの手元に——', 'C', 1, 2800, 'beginner', 'home', '謎解き', 'ヒューマンドラマ', true, 'images/quest-3-ruins.webp', '1〜2時間', '1人', '自宅完結', ARRAY['puzzle', 'home'], 'リサイクルショップで見つかった古い携帯電話。電源を入れると、下書きフォルダに未送信のメッセージが残されていた。誰が、誰に、何を伝えようとしていたのか——。携帯に残された手がかりから、10年前の想いを紐解け。', ARRAY['ネタバレ禁止', '対象年齢: 10歳以上'], 4.9, 31, 89),
(4, '失われた財布の秘密', '誰かの日常が、あなたの謎になる——', 'B', 2, 4000, 'beginner', 'home', '推理', 'リアルミステリー', false, 'images/quest-4-clocktower.webp', '2〜3時間', '1〜2人', '自宅完結', ARRAY['puzzle', 'home'], 'ギルドに届けられた落とし物——誰かの財布。中にはレシート、身分証、メモ、写真が入っている。持ち主を探すだけの簡単な依頼のはずだった。だが中身を調べるうちに、この財布が「落とされた」のではなく「残された」ものだと気づく。', ARRAY['ネタバレ禁止', '筆記用具をご用意ください', '対象年齢: 12歳以上'], 4.3, 15, 78),
(5, '闇オークションのボードゲーム', '招待されし者だけが、ゲームに参加できる——', 'A', 3, 4500, 'advanced', 'home', '体験型', 'ボードゲーム', true, 'images/quest-5-deepsea.webp', '3〜5時間', '2〜5人', '自宅完結', ARRAY['boardgame', 'home'], '届いたのは、封蝋で封じられた一通の招待状。「闇オークション」への参加権と、そこで使う専用ボードゲームが同封されていた。ゲームのルールは単純だが、裏には隠されたルールがある。全てのカードを読み解いた時、オークションの真の目的が明らかになる。', ARRAY['ネタバレ禁止', '2人以上での挑戦推奨', '対象年齢: 15歳以上'], 4.8, 42, 203),
(6, '回復のポーション', 'ヒントと共に、冒険の活力を——', 'C', 0, 500, 'beginner', 'home', '体験型', '共通アイテム', false, 'images/quest-6-potionshop.webp', '—', '—', '自宅完結', ARRAY['home'], '冒険に疲れた時、行き詰まった時——この「回復のポーション」があなたを助ける。リアクエ専用ドリンクと共に届くカードには、各クエストで使えるヒント解放コードが封入されている。飲んで、読んで、再び冒険へ。', ARRAY['賞味期限をご確認ください', '各クエストのヒントは1回限り'], 4.6, 35, 267);

-- Reset sequence
SELECT setval('quests_id_seq', 6);

-- Seed quest items
INSERT INTO public.quest_items (quest_id, icon, name, sort_order) VALUES
(1, '◆', '捜査資料ファイル（証拠写真・調書入り）', 1),
(1, '◆', '謎の鍵（金属製）', 2),
(1, '◆', '捜査本部からの依頼書', 3),
(2, '◆', '古びた手紙（暗号入り）', 1),
(2, '◆', '木札（ヒント刻印入り）', 2),
(2, '◆', 'ギルドからの依頼書', 3),
(3, '◆', '古い携帯電話本体（ギミック内蔵）', 1),
(3, '◆', 'ギルドからの依頼書', 2),
(4, '◆', '誰かの財布（レシートや身分証入り）', 1),
(4, '◆', 'ギルドからの依頼書', 2),
(5, '◆', '招待状（封蝋付き）', 1),
(5, '◆', '専用ボードゲーム一式', 2),
(5, '◆', 'ギルド最高機密依頼書', 3),
(6, '◆', 'リアクエ専用ドリンク', 1),
(6, '◆', 'ヒント解放コード付きカード', 2);
