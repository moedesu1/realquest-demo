/* ============================================================
   REAL QUEST — App v3
   Production: Supabase Auth + DB + Shopify Cart + Analytics
   ============================================================ */

/* ── CONFIG (from js/config.js) ── */
const SUPABASE_URL = (typeof RQ_CONFIG !== 'undefined' && RQ_CONFIG.SUPABASE_URL) || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = (typeof RQ_CONFIG !== 'undefined' && RQ_CONFIG.SUPABASE_ANON_KEY) || 'YOUR_SUPABASE_ANON_KEY';
const SHOPIFY_DOMAIN = (typeof RQ_CONFIG !== 'undefined' && RQ_CONFIG.SHOPIFY_DOMAIN) || 'YOUR_STORE.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = (typeof RQ_CONFIG !== 'undefined' && RQ_CONFIG.SHOPIFY_STOREFRONT_TOKEN) || 'YOUR_STOREFRONT_ACCESS_TOKEN';
const GA4_ID = (typeof RQ_CONFIG !== 'undefined' && RQ_CONFIG.GA4_ID) || 'G-XXXXXXXXXX';

/* ── SUPABASE CLIENT ── */
let supabaseClient = null;
function getSupabase() {
  if (!supabaseClient && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

/* ── SHOPIFY CLIENT ── */
let shopifyClient = null;
let shopifyCheckout = null;

async function initShopify() {
  if (!window.ShopifyBuy) return;
  try {
    shopifyClient = ShopifyBuy.buildClient({
      domain: SHOPIFY_DOMAIN,
      storefrontAccessToken: SHOPIFY_STOREFRONT_TOKEN,
    });
    // Restore or create checkout
    const savedCheckoutId = localStorage.getItem('rq_checkout_id');
    if (savedCheckoutId) {
      try {
        shopifyCheckout = await shopifyClient.checkout.fetch(savedCheckoutId);
        if (shopifyCheckout.completedAt) {
          shopifyCheckout = await shopifyClient.checkout.create();
          localStorage.setItem('rq_checkout_id', shopifyCheckout.id);
        }
      } catch {
        shopifyCheckout = await shopifyClient.checkout.create();
        localStorage.setItem('rq_checkout_id', shopifyCheckout.id);
      }
    } else {
      shopifyCheckout = await shopifyClient.checkout.create();
      localStorage.setItem('rq_checkout_id', shopifyCheckout.id);
    }
    updateCartBadge();
  } catch (e) {
    console.error('Shopify init error:', e);
  }
}

/* ── FALLBACK QUEST DATA ── */
const fallbackQuests = [
  {
    id: 1,
    title: '大阪怪奇事件ファイル',
    tagline: '未解決事件の真相が、あなたの手元に届く——',
    rank: 'B',
    difficulty: 2,
    price: 3000,
    category: 'beginner',
    format: 'home',
    genre: '推理',
    subGenre: 'ミステリー',
    isNew: true,
    image: 'images/quest-1-alchemy.webp',
    estimatedTime: '2〜4時間',
    players: '1〜3人',
    region: '自宅完結',
    purposes: ['puzzle', 'home'],
    items: [
      { icon: '◆', name: '捜査資料ファイル（証拠写真・調書入り）' },
      { icon: '◆', name: '謎の鍵（金属製）' },
      { icon: '◆', name: '捜査本部からの依頼書' },
    ],
    prologue: '大阪で起きた連続怪奇事件——目撃者の証言は矛盾だらけ、現場には説明のつかない痕跡が残されていた。捜査本部がギルドに依頼した資料一式があなたの元に届く。封筒の中の鍵は、何を開けるためのものなのか。真相は、証拠の中に隠されている。',
    cautions: ['ネタバレ禁止', '筆記用具をご用意ください', '対象年齢: 12歳以上'],
    reviews: [
      { user: '黒鉄の剣士', title: '冒険者', avatar: '黒', level: 28, rank: 'C', stars: 5, date: '2026.02.15', text: '捜査資料のリアルさに驚いた。証拠写真を並べて推理する過程が本格的で没入感がすごい。家族3人で挑んで3時間で解決。鍵のギミックが特に秀逸！', sub: { craft: 5, story: 4, volume: 4 }, likes: 12 },
      { user: '月影の魔女', title: '勇者', avatar: '月', level: 45, rank: 'B', stars: 4, date: '2026.02.10', text: '調書の作り込みが凝っていて感動。もう少しヒントがあると初心者にも優しいかも。最後の真相に辿り着いた時の達成感が最高でした。', sub: { craft: 5, story: 4, volume: 3 }, likes: 8 },
      { user: '旅の商人', title: '見習い', avatar: '旅', level: 12, rank: 'D', stars: 5, date: '2026.01.28', text: '友達3人でやって最高に盛り上がった。大阪が舞台なのもリアルで面白い。次のクエストも必ずやります。', sub: { craft: 4, story: 5, volume: 4 }, likes: 5 },
    ],
    reviewAvg: 4.7,
    reviewCount: 24,
    salesCount: 156,
  },
  {
    id: 2,
    title: '奈良・消えた鹿の暗号',
    tagline: '古都に眠る暗号が、あなたを導く——',
    rank: 'A',
    difficulty: 3,
    price: 3500,
    category: 'advanced',
    format: 'hybrid',
    genre: '暗号解読',
    subGenre: '歴史冒険',
    isNew: false,
    image: 'images/quest-2-library.webp',
    estimatedTime: '3〜5時間',
    players: '1〜4人',
    region: '奈良',
    purposes: ['puzzle', 'outdoor'],
    items: [
      { icon: '◆', name: '古びた手紙（暗号入り）' },
      { icon: '◆', name: '木札（ヒント刻印入り）' },
      { icon: '◆', name: 'ギルドからの依頼書' },
    ],
    prologue: '奈良公園の鹿が一頭、忽然と姿を消した。ただの迷子ではない——その鹿は、千年前から受け継がれてきた「神鹿」だった。古びた手紙に記された暗号を解けば、消えた鹿の行方と、古都に隠された秘密に辿り着ける。',
    cautions: ['ネタバレ禁止', '現地ステージあり（奈良市内）', '歩きやすい服装推奨', '対象年齢: 12歳以上'],
    reviews: [
      { user: '星読みの賢者', title: '冒険者', avatar: '星', level: 33, rank: 'C', stars: 5, date: '2026.02.12', text: '奈良の街を歩きながら暗号を解く体験は格別。木札のギミックが面白くて、観光としても楽しめる。歴史の知識が自然と身につくのもいい。', sub: { craft: 5, story: 5, volume: 3 }, likes: 15 },
      { user: '森の狩人', title: '見習い', avatar: '森', level: 8, rank: 'E', stars: 4, date: '2026.02.01', text: 'カップルでやったら最高。古びた手紙の質感がリアルで、開封する瞬間のドキドキ感がいい。初めてのリアクエだったけど、すっかりハマりました。', sub: { craft: 4, story: 5, volume: 3 }, likes: 7 },
    ],
    reviewAvg: 4.5,
    reviewCount: 18,
    salesCount: 112,
  },
  {
    id: 3,
    title: '古い携帯の未送信メッセージ',
    tagline: '10年前の想いが、今あなたの手元に——',
    rank: 'C',
    difficulty: 1,
    price: 2800,
    category: 'beginner',
    format: 'home',
    genre: '謎解き',
    subGenre: 'ヒューマンドラマ',
    isNew: true,
    image: 'images/quest-3-ruins.webp',
    estimatedTime: '1〜2時間',
    players: '1人',
    region: '自宅完結',
    purposes: ['puzzle', 'home'],
    items: [
      { icon: '◆', name: '古い携帯電話本体（ギミック内蔵）' },
      { icon: '◆', name: 'ギルドからの依頼書' },
    ],
    prologue: 'リサイクルショップで見つかった古い携帯電話。電源を入れると、下書きフォルダに未送信のメッセージが残されていた。誰が、誰に、何を伝えようとしていたのか——。携帯に残された手がかりから、10年前の想いを紐解け。',
    cautions: ['ネタバレ禁止', '対象年齢: 10歳以上'],
    reviews: [
      { user: '古代の探究者', title: '勇者', avatar: '古', level: 52, rank: 'B', stars: 5, date: '2026.02.20', text: '携帯電話が本物みたいで驚いた。メッセージを一つずつ読み解いていく過程に感動。最後のメッセージの内容に泣きました。', sub: { craft: 5, story: 5, volume: 2 }, likes: 23 },
    ],
    reviewAvg: 4.9,
    reviewCount: 31,
    salesCount: 89,
  },
  {
    id: 4,
    title: '失われた財布の秘密',
    tagline: '誰かの日常が、あなたの謎になる——',
    rank: 'B',
    difficulty: 2,
    price: 4000,
    category: 'beginner',
    format: 'home',
    genre: '推理',
    subGenre: 'リアルミステリー',
    isNew: false,
    image: 'images/quest-4-clocktower.webp',
    estimatedTime: '2〜3時間',
    players: '1〜2人',
    region: '自宅完結',
    purposes: ['puzzle', 'home'],
    items: [
      { icon: '◆', name: '誰かの財布（レシートや身分証入り）' },
      { icon: '◆', name: 'ギルドからの依頼書' },
    ],
    prologue: 'ギルドに届けられた落とし物——誰かの財布。中にはレシート、身分証、メモ、写真が入っている。持ち主を探すだけの簡単な依頼のはずだった。だが中身を調べるうちに、この財布が「落とされた」のではなく「残された」ものだと気づく。',
    cautions: ['ネタバレ禁止', '筆記用具をご用意ください', '対象年齢: 12歳以上'],
    reviews: [
      { user: '鉄壁の騎士', title: '冒険者', avatar: '鉄', level: 22, rank: 'D', stars: 4, date: '2026.01.25', text: 'レシートや身分証のリアルさに驚いた。推理していくうちにゾクッとする展開が待っていた。日常の中に潜む謎というコンセプトが新鮮。', sub: { craft: 4, story: 5, volume: 3 }, likes: 9 },
      { user: '風の吟遊詩人', title: '見習い', avatar: '風', level: 5, rank: 'E', stars: 5, date: '2026.01.18', text: 'リアルな小道具の作り込みが素晴らしい！レシートの日付や店名まで手がかりになっているのが面白い。推理好きには絶対おすすめ。', sub: { craft: 5, story: 5, volume: 3 }, likes: 6 },
    ],
    reviewAvg: 4.3,
    reviewCount: 15,
    salesCount: 78,
  },
  {
    id: 5,
    title: '闇オークションのボードゲーム',
    tagline: '招待されし者だけが、ゲームに参加できる——',
    rank: 'A',
    difficulty: 3,
    price: 4500,
    category: 'advanced',
    format: 'home',
    genre: '体験型',
    subGenre: 'ボードゲーム',
    isNew: true,
    image: 'images/quest-5-deepsea.webp',
    estimatedTime: '3〜5時間',
    players: '2〜5人',
    region: '自宅完結',
    purposes: ['boardgame', 'home'],
    items: [
      { icon: '◆', name: '招待状（封蝋付き）' },
      { icon: '◆', name: '専用ボードゲーム一式' },
      { icon: '◆', name: 'ギルド最高機密依頼書' },
    ],
    prologue: '届いたのは、封蝋で封じられた一通の招待状。「闇オークション」への参加権と、そこで使う専用ボードゲームが同封されていた。ゲームのルールは単純だが、裏には隠されたルールがある。全てのカードを読み解いた時、オークションの真の目的が明らかになる。',
    cautions: ['ネタバレ禁止', '2人以上での挑戦推奨', '対象年齢: 15歳以上'],
    reviews: [
      { user: '深淵の探索者', title: '賢者', avatar: '深', level: 78, rank: 'A', stars: 5, date: '2026.02.22', text: 'ボードゲームとしても謎解きとしても完成度が高い。5人でやったけど全員が役割を持てるバランスが素晴らしい。隠しルールを発見した時の衝撃がたまらない。', sub: { craft: 5, story: 5, volume: 5 }, likes: 31 },
      { user: '炎の魔術師', title: '勇者', avatar: '炎', level: 56, rank: 'B', stars: 5, date: '2026.02.18', text: '封蝋の招待状を開ける瞬間からテンション爆上がり。ボードゲーム部分も戦略性があって面白い。何度でも遊べるのもいい。', sub: { craft: 5, story: 5, volume: 5 }, likes: 19 },
      { user: '銀の盗賊', title: '冒険者', avatar: '銀', level: 31, rank: 'C', stars: 4, date: '2026.02.05', text: '招待状の演出が最高。ただ2人だと少し物足りない場面があったので、3人以上推奨。ゲーム自体のクオリティは文句なし。', sub: { craft: 5, story: 4, volume: 5 }, likes: 11 },
    ],
    reviewAvg: 4.8,
    reviewCount: 42,
    salesCount: 203,
  },
  {
    id: 6,
    title: '回復のポーション',
    tagline: 'ヒントと共に、冒険の活力を——',
    rank: 'C',
    difficulty: 0,
    price: 500,
    category: 'beginner',
    format: 'home',
    genre: '体験型',
    subGenre: '共通アイテム',
    isNew: false,
    image: 'images/quest-6-potionshop.webp',
    estimatedTime: '—',
    players: '—',
    region: '自宅完結',
    purposes: ['home'],
    items: [
      { icon: '◆', name: 'リアクエ専用ドリンク' },
      { icon: '◆', name: 'ヒント解放コード付きカード' },
    ],
    prologue: '冒険に疲れた時、行き詰まった時——この「回復のポーション」があなたを助ける。リアクエ専用ドリンクと共に届くカードには、各クエストで使えるヒント解放コードが封入されている。飲んで、読んで、再び冒険へ。',
    cautions: ['賞味期限をご確認ください', '各クエストのヒントは1回限り'],
    reviews: [
      { user: '白銀の聖女', title: '見習い', avatar: '白', level: 15, rank: 'D', stars: 5, date: '2026.02.08', text: 'ドリンクが意外と美味しい！ヒントコードのおかげで詰まっていたクエストをクリアできた。冒険のお供に最適。', sub: { craft: 4, story: 3, volume: 2 }, likes: 18 },
      { user: '大地の守人', title: '見習い', avatar: '大', level: 3, rank: 'F', stars: 4, date: '2026.01.30', text: 'ポーション瓶のデザインが可愛い。ヒントコードが思った以上に役立つ。気軽に買えるのがいい。', sub: { craft: 4, story: 3, volume: 2 }, likes: 10 },
    ],
    reviewAvg: 4.6,
    reviewCount: 35,
    salesCount: 267,
  },
];

/* ── QUEST DATA (mutable, loaded from Supabase or fallback) ── */
let quests = [...fallbackQuests];

/* ── USER STATE ── */
const userState = {
  loggedIn: false,
  userId: null,
  role: null,
  name: '名もなき冒険者',
  avatar: '冒',
  title: '見習い',
  questsCompleted: 0,
  questsAccepted: 0,
  coins: 2450,
  acceptedQuests: [],
  reviewedQuests: [],
};

/* Title progression */
const titleLevels = [
  { name: '見習い', min: 0 },
  { name: '冒険者', min: 2 },
  { name: '勇者', min: 5 },
  { name: '賢者', min: 10 },
];

/* ── GA4 ANALYTICS ── */
function trackEvent(name, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', name, params);
  }
}

/* ── NAVIGATION ── */
let currentPage = 'opening';
let savedScrollPositions = {};

function navigateTo(pageId, options = {}) {
  const pageMap = {
    'opening': 'page-opening',
    'quest-board': 'page-quest-board',
    'detail': 'page-detail',
    'rankings': 'page-rankings',
    'mypage': 'page-mypage',
    'creator': 'page-creator',
    'terms': 'page-terms',
    'privacy': 'page-privacy',
    'tokushoho': 'page-tokushoho',
    'contact': 'page-contact',
  };

  const targetEl = pageMap[pageId];
  if (!targetEl) return;

  // Save current scroll
  const currentEl = document.querySelector('.page.active');
  if (currentEl) savedScrollPositions[currentEl.id] = currentEl.scrollTop;

  // Track page view
  trackEvent('page_view', { page_name: pageId });

  // Transition
  if (options.transition !== false) {
    const overlay = document.getElementById('transition-overlay');
    overlay.querySelector('.transition-text').textContent = options.transitionText || 'ページを読み込んでいます...';
    overlay.classList.add('active');

    setTimeout(() => {
      showPage(targetEl);
      currentPage = pageId;
      if (options.onShow) options.onShow();
      setTimeout(() => overlay.classList.remove('active'), 400);
    }, options.delay || 600);
  } else {
    showPage(targetEl);
    currentPage = pageId;
    if (options.onShow) options.onShow();
  }
}

function showPage(targetId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(targetId);
  if (target) {
    target.classList.add('active');
    target.scrollTop = savedScrollPositions[targetId] || 0;
  }
  updateActiveNavLinks();
}

function updateActiveNavLinks() {
  document.querySelectorAll('.header-nav-link').forEach(link => {
    link.classList.remove('active');
    const page = link.getAttribute('onclick')?.match(/navigateTo\('(.+?)'\)/)?.[1];
    if (page === currentPage) link.classList.add('active');
  });
}

/* ── AUTHENTICATION ── */
function switchAuthTab(mode) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.auth-tab[data-mode="${mode}"]`)?.classList.add('active');

  const nameField = document.getElementById('auth-name-field');
  const submitBtn = document.getElementById('auth-submit-btn');
  const authError = document.getElementById('auth-error');

  if (mode === 'register') {
    nameField.style.display = 'block';
    submitBtn.textContent = '冒険を始める';
  } else {
    nameField.style.display = 'none';
    submitBtn.textContent = 'ログイン';
  }
  authError.textContent = '';
  authError.style.display = 'none';
}

async function handleAuth(e) {
  e.preventDefault();
  const sb = getSupabase();
  if (!sb) {
    // Fallback: no Supabase configured
    loginAsAdventurerFallback();
    return;
  }

  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const activeTab = document.querySelector('.auth-tab.active')?.dataset.mode || 'login';
  const authError = document.getElementById('auth-error');
  const submitBtn = document.getElementById('auth-submit-btn');

  authError.style.display = 'none';
  submitBtn.disabled = true;
  submitBtn.textContent = '処理中...';

  try {
    if (activeTab === 'register') {
      const displayName = document.getElementById('auth-name').value.trim() || '名もなき冒険者';
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });
      if (error) throw error;
      if (data.user && !data.session) {
        authError.textContent = '確認メールを送信しました。メールを確認してください。';
        authError.style.display = 'block';
        authError.classList.add('auth-success');
        submitBtn.disabled = false;
        submitBtn.textContent = '冒険を始める';
        return;
      }
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
    trackEvent('login', { method: 'email' });
  } catch (err) {
    authError.classList.remove('auth-success');
    authError.textContent = getAuthErrorMessage(err.message);
    authError.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = activeTab === 'register' ? '冒険を始める' : 'ログイン';
  }
}

function getAuthErrorMessage(msg) {
  if (msg.includes('Invalid login')) return 'メールアドレスまたはパスワードが正しくありません。';
  if (msg.includes('already registered')) return 'このメールアドレスは既に登録されています。';
  if (msg.includes('Password should be')) return 'パスワードは6文字以上で設定してください。';
  if (msg.includes('valid email')) return '有効なメールアドレスを入力してください。';
  return 'エラーが発生しました。もう一度お試しください。';
}

/* ── PASSWORD RESET ── */
function showPasswordReset() {
  document.querySelector('.auth-form').style.display = 'none';
  document.querySelector('.auth-tabs').style.display = 'none';
  document.getElementById('auth-forgot-link').style.display = 'none';
  document.getElementById('auth-reset-form').style.display = 'block';
  document.getElementById('reset-error').style.display = 'none';
  document.getElementById('reset-success').style.display = 'none';
}

function backToLogin() {
  document.querySelector('.auth-form').style.display = 'block';
  document.querySelector('.auth-tabs').style.display = 'flex';
  document.getElementById('auth-forgot-link').style.display = 'block';
  document.getElementById('auth-reset-form').style.display = 'none';
}

async function handlePasswordReset(e) {
  e.preventDefault();
  const sb = getSupabase();
  const email = document.getElementById('reset-email').value.trim();
  const errorEl = document.getElementById('reset-error');
  const successEl = document.getElementById('reset-success');
  const submitBtn = document.getElementById('reset-submit-btn');

  errorEl.style.display = 'none';
  successEl.style.display = 'none';

  if (!email) {
    errorEl.textContent = 'メールアドレスを入力してください。';
    errorEl.style.display = 'block';
    return;
  }

  if (!sb) {
    errorEl.textContent = 'サービスに接続できません。';
    errorEl.style.display = 'block';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '送信中...';

  try {
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname,
    });
    if (error) throw error;

    successEl.textContent = 'リセットリンクを送信しました。メールをご確認ください。';
    successEl.style.display = 'block';
  } catch (err) {
    errorEl.textContent = 'リセットメールの送信に失敗しました。メールアドレスをご確認ください。';
    errorEl.style.display = 'block';
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'リセットリンクを送信';
}

async function handleLogout() {
  const sb = getSupabase();
  if (sb) {
    await sb.auth.signOut();
  }

  // Reset state
  userState.loggedIn = false;
  userState.userId = null;
  userState.role = null;
  userState.name = '名もなき冒険者';
  userState.avatar = '冒';
  userState.title = '見習い';
  userState.questsCompleted = 0;
  userState.questsAccepted = 0;
  userState.coins = 2450;
  userState.acceptedQuests = [];
  userState.reviewedQuests = [];

  stopBGM();
  trackEvent('logout');
  navigateTo('opening', { transitionText: 'ログアウトしています...', delay: 600 });
}

async function loadUserProfile(userId) {
  const sb = getSupabase();
  if (!sb) return;

  try {
    // Load profile
    const { data: profile } = await sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profile) {
      userState.name = profile.display_name;
      userState.avatar = profile.avatar_char;
      userState.title = profile.title;
      userState.questsCompleted = profile.quests_completed;
      userState.questsAccepted = profile.quests_accepted;
      userState.coins = profile.coins;
      userState.role = profile.role;
    }

    // Load accepted quests
    const { data: accepted } = await sb
      .from('accepted_quests')
      .select('quest_id, status, accepted_at')
      .eq('user_id', userId)
      .order('accepted_at', { ascending: false });

    if (accepted) {
      userState.acceptedQuests = accepted.map(a => a.quest_id);
    }

    // Load reviewed quest IDs
    const { data: reviewed } = await sb
      .from('reviews')
      .select('quest_id')
      .eq('user_id', userId);

    if (reviewed) {
      userState.reviewedQuests = reviewed.map(r => r.quest_id);
    }
  } catch (e) {
    console.error('Profile load error:', e);
  }
}

/* Fallback login (when Supabase not configured) */
function loginAsAdventurerFallback() {
  userState.loggedIn = true;
  userState.role = 'adventurer';
  const nameInput = document.getElementById('auth-name')?.value?.trim();
  if (nameInput) userState.name = nameInput;

  playStartSFX();
  setTimeout(() => startBGM(), 300);

  navigateTo('quest-board', {
    transitionText: 'ギルド掲示板を開いています...',
    delay: 1200,
    onShow: async () => {
      await loadQuestsFromDB();
      renderQuestCards(quests);
      updateHeaderUser();
    }
  });
}

function loginAsCreator() {
  navigateTo('creator', {
    transitionText: '創造者ギルドを準備中...',
    delay: 800,
  });
}

function updateHeaderUser() {
  document.querySelectorAll('#header-username').forEach(el => el.textContent = userState.name);
  document.querySelectorAll('#header-title').forEach(el => el.textContent = userState.title);
}

/* ── LOAD QUESTS FROM SUPABASE ── */
async function loadQuestsFromDB() {
  const sb = getSupabase();
  if (!sb) return;

  try {
    const { data: dbQuests, error } = await sb
      .from('quests')
      .select('*, quest_items(*)')
      .eq('is_published', true)
      .order('id');

    if (error) throw error;
    if (!dbQuests || dbQuests.length === 0) return;

    // Map DB format to app format
    quests = dbQuests.map(q => {
      const fallback = fallbackQuests.find(fq => fq.id === q.id);
      return {
        id: q.id,
        title: q.title,
        tagline: q.tagline,
        rank: q.rank,
        difficulty: q.difficulty,
        price: q.price,
        category: q.category,
        format: q.format,
        genre: q.genre,
        subGenre: q.sub_genre,
        isNew: q.is_new,
        image: q.image_url || (fallback ? fallback.image : ''),
        estimatedTime: q.estimated_time,
        players: q.players,
        region: q.region,
        purposes: q.purposes || [],
        items: q.quest_items
          ? q.quest_items.sort((a, b) => a.sort_order - b.sort_order).map(i => ({ icon: i.icon, name: i.name }))
          : (fallback ? fallback.items : []),
        prologue: q.prologue,
        cautions: q.cautions || [],
        reviewAvg: parseFloat(q.review_avg) || 0,
        reviewCount: q.review_count || 0,
        salesCount: q.sales_count || 0,
        shopifyVariantId: q.shopify_variant_id,
        shopifyProductId: q.shopify_product_id,
        // Reviews loaded dynamically
        reviews: fallback ? fallback.reviews : [],
      };
    });
  } catch (e) {
    console.error('Failed to load quests from DB, using fallback:', e);
  }
}

/* ── LOAD REVIEWS FROM SUPABASE ── */
async function loadReviews(questId) {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data: reviews, error } = await sb
      .from('reviews')
      .select(`
        id, rating, text, sub_ratings, likes_count, created_at,
        profiles:user_id (display_name, avatar_char, title, quests_completed)
      `)
      .eq('quest_id', questId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!reviews || reviews.length === 0) return null;

    return reviews.map(r => ({
      user: r.profiles?.display_name || '冒険者',
      title: r.profiles?.title || '見習い',
      avatar: r.profiles?.avatar_char || '冒',
      level: r.profiles?.quests_completed || 0,
      rank: 'C',
      stars: r.rating,
      date: new Date(r.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
      text: r.text,
      sub: r.sub_ratings || {},
      likes: r.likes_count || 0,
      reviewId: r.id,
    }));
  } catch (e) {
    console.error('Failed to load reviews:', e);
    return null;
  }
}

/* ── SUBMIT REVIEW ── */
async function submitReview(questId) {
  const sb = getSupabase();
  if (!sb || !userState.userId) return;

  const rating = parseInt(document.getElementById('review-rating')?.value);
  const text = document.getElementById('review-text')?.value?.trim();
  const craftRating = parseInt(document.getElementById('review-sub-craft')?.value) || 3;
  const storyRating = parseInt(document.getElementById('review-sub-story')?.value) || 3;
  const volumeRating = parseInt(document.getElementById('review-sub-volume')?.value) || 3;
  const errorEl = document.getElementById('review-error');
  const formEl = document.getElementById('review-report-form');
  const successEl = document.getElementById('review-success');

  if (errorEl) { errorEl.style.display = 'none'; }

  if (!rating || rating < 1 || rating > 5) {
    if (errorEl) { errorEl.textContent = '総合評価の星を選択してください。'; errorEl.style.display = 'block'; }
    shakeElement(errorEl);
    return;
  }
  if (!text || text.length < 10) {
    if (errorEl) { errorEl.textContent = '冒険の報告は10文字以上でお願いします。'; errorEl.style.display = 'block'; }
    shakeElement(errorEl);
    return;
  }

  const submitBtn = document.getElementById('review-submit-btn');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '報告書を提出中...'; }

  try {
    const { error } = await sb.from('reviews').insert({
      quest_id: questId,
      user_id: userState.userId,
      rating,
      text,
      sub_ratings: { craft: craftRating, story: storyRating, volume: volumeRating },
    });

    if (error) {
      if (error.code === '23505') {
        throw new Error('このクエストの報告書は既に提出済みです。');
      }
      throw error;
    }

    // Mark as reviewed
    if (!userState.reviewedQuests.includes(questId)) {
      userState.reviewedQuests.push(questId);
    }

    trackEvent('review_submit', { quest_id: questId, rating });
    playReviewSFX();

    // Show success state
    if (formEl) formEl.style.display = 'none';
    if (successEl) {
      successEl.style.display = 'block';
      successEl.classList.add('animate-in');
    }

    // Refresh quest data in background
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      const dbReviews = await loadReviews(questId);
      if (dbReviews) quest.reviews = dbReviews;
      const { data: updated } = await sb.from('quests').select('review_avg, review_count').eq('id', questId).single();
      if (updated) {
        quest.reviewAvg = parseFloat(updated.review_avg) || quest.reviewAvg;
        quest.reviewCount = updated.review_count || quest.reviewCount;
      }
    }
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = err.message || '報告書の提出に失敗しました。もう一度お試しください。';
      errorEl.style.display = 'block';
      shakeElement(errorEl);
    }
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '報告書を提出する'; }
  }
}

/* Shake animation helper */
function shakeElement(el) {
  if (!el) return;
  el.classList.remove('shake');
  void el.offsetWidth; // reflow
  el.classList.add('shake');
}

/* Review submission SFX */
function playReviewSFX() {
  try {
    const ctx = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = 0.1;
    gain.connect(ctx.destination);

    // Quill writing sound + seal stamp
    const notes = [392, 440, 523.25, 587.33, 659.25];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0.3, now + i * 0.12);
      env.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.3);
      osc.connect(env);
      env.connect(gain);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.35);
    });

    // Final stamp chord
    [523.25, 659.25, 783.99].forEach(freq => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0.4, now + 0.7);
      env.gain.exponentialRampToValueAtTime(0.01, now + 1.8);
      osc.connect(env);
      env.connect(gain);
      osc.start(now + 0.7);
      osc.stop(now + 2.0);
    });
  } catch (e) {}
}

/* Load user's existing review for a quest */
async function loadMyReview(questId) {
  const sb = getSupabase();
  if (!sb || !userState.userId) return null;

  try {
    const { data } = await sb
      .from('reviews')
      .select('rating, text, sub_ratings, created_at')
      .eq('quest_id', questId)
      .eq('user_id', userState.userId)
      .single();
    return data;
  } catch {
    return null;
  }
}

/* ── QUEST CARD RENDERING ── */
function renderQuestCards(list) {
  const grid = document.getElementById('quest-grid');
  if (!list.length) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div>
        <p>条件に合うクエストが見つかりませんでした</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(q => {
    const stars = Array.from({ length: 5 }, (_, i) =>
      `<span class="star ${i < q.difficulty ? 'filled' : ''}">★</span>`
    ).join('');

    const formatLabel = { home: '自宅完結', outdoor: '現地型', hybrid: 'ハイブリッド' }[q.format] || q.format;

    return `
      <div class="quest-card" onclick="openQuestDetail(${q.id})">
        ${q.isNew ? '<div class="card-badge">NEW</div>' : ''}
        <div class="card-image">
          ${q.image ? `<img src="${q.image}" alt="${q.title}" loading="lazy">` : `<div style="width:100%;height:100%;background:var(--bg-panel)"></div>`}
        </div>
        <div class="card-body">
          <div class="card-tags">
            <span class="card-tag genre">${q.genre}</span>
            <span class="card-tag format">${formatLabel}</span>
            ${q.subGenre ? `<span class="card-tag">${q.subGenre}</span>` : ''}
          </div>
          <div class="card-title">${q.title}</div>
          <div class="card-tagline">${q.tagline}</div>
          <div class="card-meta">
            <div class="card-meta-item">
              <span class="card-meta-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg></span>
              <div class="card-difficulty">${stars}</div>
            </div>
            <div class="card-meta-item">
              <span class="card-meta-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
              <span>${q.players}</span>
            </div>
            <div class="card-meta-item">
              <span class="card-meta-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
              <span>${q.estimatedTime}</span>
            </div>
            <div class="card-meta-item">
              <span class="card-meta-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
              <span>${q.region}</span>
            </div>
          </div>
          <div class="card-meta" style="margin-top:0.3rem">
            <div class="card-meta-item">
              <span class="card-meta-icon" style="color:var(--star-fill)">★</span>
              <span style="color:var(--neon-gold)">${q.reviewAvg}</span>
              <span>(${q.reviewCount}件)</span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <div class="card-price">
            <span class="currency">¥</span>${q.price.toLocaleString()}
            <span class="tax">(税込・送料込)</span>
          </div>
          <div class="card-cta">詳細を見る →</div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('result-count').textContent = `${list.length}件のクエスト`;
}

/* ── SEARCH & FILTER ── */
const activeFilters = {
  keyword: '',
  category: 'all',
};

function setPurposeFilter(purpose) {
  if (purpose === 'region') {
    activeFilters.category = activeFilters.category === 'outdoor' ? 'all' : 'outdoor';
  } else {
    activeFilters.category = activeFilters.category === purpose ? 'all' : purpose;
  }

  document.querySelectorAll('.purpose-card').forEach(card => {
    card.classList.remove('active');
    const cardPurpose = card.getAttribute('onclick')?.match(/setPurposeFilter\('(.+?)'\)/)?.[1];
    if (cardPurpose === purpose && activeFilters.category !== 'all') {
      card.classList.add('active');
    }
  });

  syncFilterChips();
  applyFilters();

  setTimeout(() => {
    const header = document.getElementById('search-results-header');
    const target = (header && header.style.display !== 'none') ? header : document.getElementById('quest-grid');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function setFilter(filter, btn) {
  activeFilters.category = filter;
  document.querySelectorAll('#filter-row .filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.purpose-card').forEach(card => card.classList.remove('active'));
  applyFilters();
}

function syncFilterChips() {
  document.querySelectorAll('#filter-row .filter-chip').forEach(c => {
    c.classList.remove('active');
    const chipFilter = c.getAttribute('onclick')?.match(/setFilter\('(.+?)'/)?.[1];
    if (chipFilter === activeFilters.category) c.classList.add('active');
  });
  if (activeFilters.category === 'all') {
    document.querySelector('#filter-row .filter-chip')?.classList.add('active');
  }
}

function handleSearch() {
  activeFilters.keyword = document.getElementById('search-input').value.trim().toLowerCase();
  applyFilters();
}

function handleSort() {
  applyFilters();
}

function applyFilters() {
  const { keyword, category } = activeFilters;
  const sort = document.getElementById('sort-select').value;
  const isFiltered = keyword !== '' || category !== 'all';

  let filtered = quests.filter(q => {
    if (keyword && !q.title.toLowerCase().includes(keyword) &&
        !q.genre.toLowerCase().includes(keyword) &&
        !q.subGenre?.toLowerCase().includes(keyword) &&
        !q.tagline.toLowerCase().includes(keyword)) {
      return false;
    }
    if (category !== 'all') {
      if (category === 'beginner' && q.difficulty > 2) return false;
      if (category === 'advanced' && q.difficulty < 3) return false;
      if (['puzzle', 'outdoor', 'boardgame', 'home'].includes(category)) {
        if (!q.purposes || !q.purposes.includes(category)) return false;
      }
    }
    return true;
  });

  switch (sort) {
    case 'newest': filtered.sort((a, b) => b.id - a.id); break;
    case 'popular': filtered.sort((a, b) => b.salesCount - a.salesCount); break;
    case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
    case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
    case 'difficulty-low': filtered.sort((a, b) => a.difficulty - b.difficulty); break;
    case 'difficulty-high': filtered.sort((a, b) => b.difficulty - a.difficulty); break;
  }

  const header = document.getElementById('search-results-header');
  if (header) {
    if (isFiltered) {
      header.style.display = 'flex';
      document.getElementById('search-results-count').textContent =
        `${filtered.length}件のクエストが見つかりました`;
    } else {
      header.style.display = 'none';
    }
  }

  renderQuestCards(filtered);
}

function clearFilters() {
  activeFilters.keyword = '';
  activeFilters.category = 'all';
  document.getElementById('search-input').value = '';
  document.querySelectorAll('.purpose-card').forEach(card => card.classList.remove('active'));
  syncFilterChips();
  applyFilters();
}

/* ── QUEST DETAIL ── */
function openQuestDetail(questId) {
  const quest = quests.find(q => q.id === questId);
  if (!quest) return;

  trackEvent('view_item', { item_id: questId, item_name: quest.title, price: quest.price });

  navigateTo('detail', {
    transitionText: '依頼書を準備中...',
    delay: 700,
    onShow: async () => {
      // Try to load reviews from DB
      const dbReviews = await loadReviews(questId);
      if (dbReviews && dbReviews.length > 0) {
        quest.reviews = dbReviews;
      }
      renderDetail(quest);
    },
  });
}

function renderDetail(quest) {
  const stars = n => Array.from({ length: 5 }, (_, i) => `<span class="star ${i < n ? 'filled' : ''}">★</span>`).join('');
  const reviewStars = n => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
  const isAccepted = userState.acceptedQuests.includes(quest.id);
  const formatLabel = { home: '自宅完結', outdoor: '現地型', hybrid: 'ハイブリッド' }[quest.format] || quest.format;
  const hasShopify = !!quest.shopifyVariantId;

  // Review distribution
  const dist = [0, 0, 0, 0, 0];
  quest.reviews.forEach(r => dist[r.stars - 1]++);
  const maxDist = Math.max(...dist, 1);

  const container = document.getElementById('detail-content');
  container.innerHTML = `
    <button class="detail-back" onclick="navigateTo('quest-board', {transitionText:'掲示板に戻ります...',delay:500})">
      ← 掲示板に戻る
    </button>

    <div class="detail-hero">
      ${quest.image ? `<img src="${quest.image}" alt="${quest.title}">` : '<div style="width:100%;height:100%;background:var(--bg-panel)"></div>'}
    </div>

    <div class="detail-header">
      <div class="detail-rank">RANK ${quest.rank}</div>
      <div class="detail-title">${quest.title}</div>
      <div class="detail-tagline">${quest.tagline}</div>
    </div>

    <div class="detail-specs">
      <div class="spec-item">
        <div class="spec-label">難易度</div>
        <div class="spec-value"><div class="card-difficulty">${stars(quest.difficulty)}</div></div>
      </div>
      <div class="spec-item">
        <div class="spec-label">プレイ人数</div>
        <div class="spec-value">${quest.players}</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">所要時間</div>
        <div class="spec-value">${quest.estimatedTime}</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">形式</div>
        <div class="spec-value">${formatLabel}</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">ジャンル</div>
        <div class="spec-value">${quest.genre} × ${quest.subGenre}</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">評価</div>
        <div class="spec-value"><span class="stars">${reviewStars(quest.reviewAvg)}</span> ${quest.reviewAvg}</div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">プロローグ</div>
      <div class="prologue-box">${quest.prologue}</div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">支給アイテム</div>
      <div class="items-grid">
        ${quest.items.map(it => `
          <div class="item-card">
            <div class="item-icon">${it.icon}</div>
            <div class="item-name">${it.name}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">注意事項</div>
      <ul class="caution-list">
        ${(quest.cautions || []).map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>

    <!-- ACCEPTANCE / CART AREA -->
    <div class="accept-area ${isAccepted ? 'accepted' : ''}" id="accept-area-${quest.id}">
      <div class="accept-header">
        <div class="accept-title">クエスト受注書</div>
        <div class="accept-subtitle">— QUEST ORDER FORM —</div>
      </div>
      <div class="accept-body">
        <div class="supply-label">◆ 支給予定アイテム</div>
        <div class="supply-items">
          ${quest.items.map(it => `
            <div class="supply-item">
              <div class="supply-item-icon">${it.icon}</div>
              <div class="supply-item-name">${it.name}</div>
            </div>
          `).join('')}
        </div>

        <div class="accept-price-area">
          <div class="accept-price-label">報酬金（お支払い額）</div>
          <div class="accept-price">¥${quest.price.toLocaleString()}</div>
          <div class="accept-shipping">税込・送料込 ／ 発送目安：受注後3〜5営業日</div>
        </div>

        ${isAccepted ? '' : (hasShopify ? `
          <button class="btn-accept btn-cart" onclick="addToCart(${quest.id})" aria-label="カートに追加">
            カートに追加する
          </button>
        ` : `
          <button class="btn-accept" onclick="acceptQuest(${quest.id})" aria-label="クエストを受諾する">
            このクエストを受諾する
          </button>
        `)}
      </div>

      <div class="acceptance-stamp" id="stamp-${quest.id}">受 諾</div>

      <div class="accept-complete-msg">
        <p>クエストを受諾しました。</p>
        <p><span class="highlight">数日後、あなたのポストに "物語の始まり" が届きます。</span></p>
        <button class="btn-outline" onclick="navigateTo('mypage')" style="margin-top:1rem">
          マイクエストを確認する →
        </button>
      </div>
    </div>

    <!-- REVIEW FORM / SUBMITTED STATE -->
    ${isAccepted && userState.loggedIn ? renderReviewSection(quest) : ''}
    ${!isAccepted && userState.loggedIn ? `
    <div class="review-locked-notice">
      <span class="review-locked-icon">◆</span>
      クエストを受諾するとレビューを投稿できます
    </div>
    ` : ''}

    <!-- REVIEWS -->
    <div class="reviews-section">
      <div class="detail-section-title">冒険者レビュー</div>

      <div class="reviews-header">
        <div class="reviews-total">総数：<strong>${quest.reviewCount}</strong>件</div>
      </div>

      <div class="review-summary">
        <div class="review-avg">
          <div class="review-avg-num">${quest.reviewAvg}</div>
          <div class="review-avg-stars">${reviewStars(quest.reviewAvg)}</div>
          <div class="review-avg-count">${quest.reviewCount}件の評価</div>
        </div>
        <div class="review-bars">
          ${[5,4,3,2,1].map(n => `
            <div class="review-bar-row">
              <div class="review-bar-label">${n}</div>
              <div class="review-bar"><div class="review-bar-fill" style="width:${(dist[n-1] / maxDist) * 100}%"></div></div>
              <div class="review-bar-count">${dist[n-1]}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="review-list">
        ${quest.reviews.map((r, ri) => `
          <div class="review-card">
            <div class="review-quest-bar" onclick="openQuestDetail(${quest.id})">
              <span class="review-quest-bar-icon">◆</span>
              【${quest.title}】
            </div>
            <div class="review-card-body">
              <div class="review-card-header">
                <div class="review-user">
                  <div class="review-user-avatar">${r.avatar}</div>
                  <div class="review-user-info">
                    <div class="review-user-name">${r.user}</div>
                    <div class="review-user-rank">
                      Lv.${r.level || '?'} / RANK : ${r.rank || '?'}
                      <span class="review-user-title-badge">${r.title}</span>
                    </div>
                  </div>
                </div>
                <div class="review-date">${r.date}</div>
              </div>

              <div class="review-stars-row">
                <div class="review-stars">${'★'.repeat(r.stars)}${'<span class="empty">★</span>'.repeat(5 - r.stars)}</div>
              </div>

              <div class="review-text">${escapeHtml(r.text)}</div>

              ${r.sub ? `
                <div class="review-sub-ratings">
                  <div class="review-sub-item"><span class="review-sub-label">できたえ：</span><span class="review-sub-value">${r.sub.craft}</span></div>
                  <div class="review-sub-item"><span class="review-sub-label">ストーリー：</span><span class="review-sub-value">${r.sub.story}</span></div>
                  <div class="review-sub-item"><span class="review-sub-label">ボリューム：</span><span class="review-sub-value">${r.sub.volume}</span></div>
                </div>
              ` : ''}

              <div class="review-card-footer">
                <button class="review-like-btn" onclick="event.stopPropagation(); toggleLike(this, ${quest.id}, ${ri})" aria-label="いいね">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg> ${r.likes || 0}
                </button>
                <span class="review-report">不適切なレビューを報告</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* XSS prevention helper */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ── REVIEW SECTION RENDERER ── */
function renderReviewSection(quest) {
  const isReviewed = userState.reviewedQuests.includes(quest.id);

  if (isReviewed) {
    // Find the user's review in loaded reviews
    const myReview = quest.reviews.find(r =>
      r.user === userState.name || r.reviewId
    );
    const reviewStarsStr = n => '★'.repeat(n) + '<span class="empty">★</span>'.repeat(5 - n);

    return `
    <div class="review-form-section">
      <div class="report-scroll">
        <div class="report-header">
          <div class="report-ornament">◆ ◇ ◆</div>
          <div class="report-title">冒険報告書</div>
          <div class="report-subtitle">— ADVENTURE REPORT —</div>
        </div>
        <div class="report-submitted">
          <div class="report-stamp">提出済</div>
          <div class="report-submitted-info">
            <div class="report-submitted-quest">【${escapeHtml(quest.title)}】</div>
            ${myReview ? `
              <div class="report-submitted-rating">
                <span class="report-submitted-stars">${reviewStarsStr(myReview.stars || myReview.rating || 5)}</span>
              </div>
              <div class="report-submitted-text">${escapeHtml(myReview.text)}</div>
              ${myReview.sub ? `
                <div class="report-submitted-subs">
                  <span>できたえ: ${reviewStarsStr(myReview.sub.craft || 3)}</span>
                  <span>ストーリー: ${reviewStarsStr(myReview.sub.story || 3)}</span>
                  <span>ボリューム: ${reviewStarsStr(myReview.sub.volume || 3)}</span>
                </div>
              ` : ''}
            ` : `
              <p class="report-submitted-note">冒険報告書は正常に受理されました。</p>
            `}
          </div>
        </div>
      </div>
    </div>`;
  }

  // Show the form
  const starRow = (name, hiddenId) => `
    <div class="report-star-row">
      <div class="report-star-label">${name}</div>
      <div class="report-star-group" data-target="${hiddenId}">
        ${[1,2,3,4,5].map(n => `
          <button type="button" class="rstar" data-rating="${n}"
            onmouseenter="previewStars(this)" onmouseleave="unpreviewStars(this)"
            onclick="setStarRating(this)">★</button>
        `).join('')}
      </div>
      <input type="hidden" id="${hiddenId}" value="0">
    </div>`;

  return `
  <div class="review-form-section">
    <div class="report-scroll" id="review-report-form">
      <div class="report-header">
        <div class="report-ornament">◆ ◇ ◆</div>
        <div class="report-title">冒険報告書</div>
        <div class="report-subtitle">— ADVENTURE REPORT —</div>
        <div class="report-quest-name">依頼: 【${escapeHtml(quest.title)}】</div>
        <div class="report-reporter">報告者: ${escapeHtml(userState.name)}（${userState.title}）</div>
      </div>

      <form class="report-form" onsubmit="event.preventDefault(); submitReview(${quest.id})">
        <div class="report-section">
          <div class="report-section-label">◆ 総合評価</div>
          ${starRow('この冒険を総合的に評価', 'review-rating')}
        </div>

        <div class="report-divider"></div>

        <div class="report-section">
          <div class="report-section-label">◆ 項目別評価</div>
          ${starRow('できたえ（アイテムの質）', 'review-sub-craft')}
          ${starRow('ストーリー（物語の魅力）', 'review-sub-story')}
          ${starRow('ボリューム（満足度）', 'review-sub-volume')}
        </div>

        <div class="report-divider"></div>

        <div class="report-section">
          <div class="report-section-label">◆ 冒険の記録</div>
          <div class="report-textarea-wrap">
            <textarea id="review-text" class="report-textarea"
              rows="5" placeholder="この冒険で印象に残ったこと、感動したこと、他の冒険者に伝えたいことを記してください..."
              ></textarea>
            <div class="report-textarea-count" id="review-char-count">0文字</div>
          </div>
        </div>

        <div class="review-error" id="review-error" style="display:none"></div>

        <button type="submit" class="btn-report-submit" id="review-submit-btn">
          <span class="btn-report-icon">◆</span>
          報告書を提出する
        </button>

        <div class="report-note">
          ※ 報告書は1つのクエストにつき1回のみ提出できます
        </div>
      </form>
    </div>

    <div class="report-success" id="review-success" style="display:none">
      <div class="report-success-stamp">受 理</div>
      <div class="report-success-title">冒険報告書が受理されました</div>
      <div class="report-success-text">
        あなたの報告は、これから冒険に挑む者たちの道標となります。
      </div>
      <button class="btn-outline" onclick="navigateTo('quest-board')" style="margin-top:1rem">
        掲示板に戻る →
      </button>
    </div>
  </div>`;
}

/* ── STAR RATING INTERACTIONS ── */
function previewStars(btn) {
  const group = btn.closest('.report-star-group');
  const rating = parseInt(btn.dataset.rating);
  group.querySelectorAll('.rstar').forEach(s => {
    s.classList.toggle('preview', parseInt(s.dataset.rating) <= rating);
  });
}

function unpreviewStars(btn) {
  const group = btn.closest('.report-star-group');
  const currentVal = parseInt(document.getElementById(group.dataset.target)?.value) || 0;
  group.querySelectorAll('.rstar').forEach(s => {
    s.classList.remove('preview');
    s.classList.toggle('active', parseInt(s.dataset.rating) <= currentVal);
  });
}

function setStarRating(btn) {
  const group = btn.closest('.report-star-group');
  const rating = parseInt(btn.dataset.rating);
  const hiddenInput = document.getElementById(group.dataset.target);
  if (hiddenInput) hiddenInput.value = rating;

  group.querySelectorAll('.rstar').forEach(s => {
    s.classList.remove('preview');
    s.classList.toggle('active', parseInt(s.dataset.rating) <= rating);
  });

  // Pulse animation
  btn.classList.add('pulse');
  setTimeout(() => btn.classList.remove('pulse'), 300);
}

/* Textarea character counter */
document.addEventListener('input', (e) => {
  if (e.target.id === 'review-text') {
    const count = e.target.value.length;
    const counter = document.getElementById('review-char-count');
    if (counter) {
      counter.textContent = `${count}文字`;
      counter.classList.toggle('valid', count >= 10);
    }
  }
});

/* ── ACCEPT QUEST ── */
async function acceptQuest(questId) {
  const quest = quests.find(q => q.id === questId);
  if (!quest || userState.acceptedQuests.includes(questId)) return;

  playAcceptSFX();

  // Save to Supabase
  const sb = getSupabase();
  if (sb && userState.userId) {
    try {
      await sb.from('accepted_quests').insert({
        user_id: userState.userId,
        quest_id: questId,
      });
      // Update profile
      await sb.from('profiles').update({
        quests_accepted: userState.questsAccepted + 1,
      }).eq('id', userState.userId);
    } catch (e) {
      console.error('Failed to save accepted quest:', e);
    }
  }

  // Update local state
  userState.acceptedQuests.push(questId);
  userState.questsAccepted++;

  const newTitle = [...titleLevels].reverse().find(t => userState.questsAccepted >= t.min);
  if (newTitle) userState.title = newTitle.name;
  updateHeaderUser();

  trackEvent('accept_quest', { quest_id: questId, quest_name: quest.title });

  // Animate
  const area = document.getElementById(`accept-area-${questId}`);
  const btn = area.querySelector('.btn-accept');
  if (btn) {
    btn.textContent = '受諾処理中...';
    btn.style.pointerEvents = 'none';
  }

  setTimeout(() => {
    area.classList.add('accepted');
    if (btn) btn.remove();
  }, 800);
}

function playAcceptSFX() {
  try {
    const ctx = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = 0.12;
    gain.connect(ctx.destination);

    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0.5, now + i * 0.1);
      env.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
      osc.connect(env);
      env.connect(gain);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.5);
    });

    [523.25, 659.25, 783.99].forEach(freq => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0.3, now + 0.5);
      env.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
      osc.connect(env);
      env.connect(gain);
      osc.start(now + 0.5);
      osc.stop(now + 1.6);
    });
  } catch (e) {}
}

/* ── CART FUNCTIONS (SHOPIFY) ── */
async function addToCart(questId) {
  const quest = quests.find(q => q.id === questId);
  if (!quest || !quest.shopifyVariantId || !shopifyClient || !shopifyCheckout) return;

  const btn = document.querySelector(`#accept-area-${questId} .btn-cart`);
  if (btn) { btn.disabled = true; btn.textContent = 'カートに追加中...'; }

  try {
    const lineItems = [{ variantId: quest.shopifyVariantId, quantity: 1 }];
    shopifyCheckout = await shopifyClient.checkout.addLineItems(shopifyCheckout.id, lineItems);
    localStorage.setItem('rq_checkout_id', shopifyCheckout.id);
    updateCartBadge();
    openCart();
    trackEvent('add_to_cart', { item_id: questId, item_name: quest.title, price: quest.price });
  } catch (e) {
    console.error('Add to cart error:', e);
  }

  if (btn) { btn.disabled = false; btn.textContent = 'カートに追加する'; }
}

async function removeFromCart(lineItemId) {
  if (!shopifyClient || !shopifyCheckout) return;
  try {
    shopifyCheckout = await shopifyClient.checkout.removeLineItems(shopifyCheckout.id, [lineItemId]);
    localStorage.setItem('rq_checkout_id', shopifyCheckout.id);
    updateCartBadge();
    renderCartDrawer();
  } catch (e) {
    console.error('Remove from cart error:', e);
  }
}

async function updateCartQuantity(lineItemId, qty) {
  if (!shopifyClient || !shopifyCheckout) return;
  try {
    if (qty <= 0) {
      await removeFromCart(lineItemId);
      return;
    }
    shopifyCheckout = await shopifyClient.checkout.updateLineItems(shopifyCheckout.id, [{ id: lineItemId, quantity: qty }]);
    localStorage.setItem('rq_checkout_id', shopifyCheckout.id);
    updateCartBadge();
    renderCartDrawer();
  } catch (e) {
    console.error('Update cart error:', e);
  }
}

function proceedToCheckout() {
  if (!shopifyCheckout || !shopifyCheckout.webUrl) return;
  trackEvent('begin_checkout', { value: shopifyCheckout.totalPrice });
  window.open(shopifyCheckout.webUrl, '_blank');
}

function updateCartBadge() {
  const count = shopifyCheckout ? shopifyCheckout.lineItems.length : 0;
  document.querySelectorAll('.cart-count').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function renderCartDrawer() {
  const itemsContainer = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (!itemsContainer) return;

  if (!shopifyCheckout || shopifyCheckout.lineItems.length === 0) {
    itemsContainer.innerHTML = '<div class="cart-empty">カートは空です</div>';
    if (totalEl) totalEl.textContent = '¥0';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  itemsContainer.innerHTML = shopifyCheckout.lineItems.map(item => {
    const imgSrc = item.variant?.image?.src || '';
    return `
      <div class="cart-item">
        <div class="cart-item-image">
          ${imgSrc ? `<img src="${imgSrc}" alt="${escapeHtml(item.title)}">` : '<div class="cart-item-placeholder">◆</div>'}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">${escapeHtml(item.title)}</div>
          <div class="cart-item-price">¥${parseInt(item.variant.price.amount || item.variant.price).toLocaleString()}</div>
          <div class="cart-item-qty">
            <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})" aria-label="数量を減らす">−</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})" aria-label="数量を増やす">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="削除">✕</button>
      </div>
    `;
  }).join('');

  if (totalEl) totalEl.textContent = `¥${parseInt(shopifyCheckout.totalPrice.amount || shopifyCheckout.totalPrice).toLocaleString()}`;
  if (checkoutBtn) checkoutBtn.disabled = false;
}

function openCart() {
  renderCartDrawer();
  document.getElementById('cart-overlay')?.classList.add('open');
  document.getElementById('cart-drawer')?.classList.add('open');
}

function closeCart() {
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.getElementById('cart-drawer')?.classList.remove('open');
}

/* ── RANKINGS ── */
function switchRankingTab(tab, btn) {
  document.querySelectorAll('.ranking-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderRanking(tab);
}

function renderRanking(tab = 'popular') {
  const list = document.getElementById('ranking-list');

  if (tab === 'popular') {
    const sorted = [...quests].sort((a, b) => b.salesCount - a.salesCount);
    list.innerHTML = sorted.map((q, i) => `
      <div class="ranking-item ${i < 3 ? 'top-3' : ''}" onclick="openQuestDetail(${q.id})">
        <div class="ranking-pos">${i + 1}</div>
        <div class="ranking-thumb">
          ${q.image ? `<img src="${q.image}" alt="${q.title}" loading="lazy">` : ''}
        </div>
        <div class="ranking-info">
          <div class="ranking-info-title">${q.title}</div>
          <div class="ranking-info-meta">
            <span>${q.genre}</span>
            <span>★${q.reviewAvg}</span>
            <span>¥${q.price.toLocaleString()}</span>
          </div>
        </div>
        <div class="ranking-score">
          <div class="ranking-score-num">${q.salesCount}</div>
          <div class="ranking-score-label">受注数</div>
        </div>
      </div>
    `).join('');
  } else if (tab === 'rated') {
    const sorted = [...quests].sort((a, b) => b.reviewAvg - a.reviewAvg);
    list.innerHTML = sorted.map((q, i) => `
      <div class="ranking-item ${i < 3 ? 'top-3' : ''}" onclick="openQuestDetail(${q.id})">
        <div class="ranking-pos">${i + 1}</div>
        <div class="ranking-thumb">
          ${q.image ? `<img src="${q.image}" alt="${q.title}" loading="lazy">` : ''}
        </div>
        <div class="ranking-info">
          <div class="ranking-info-title">${q.title}</div>
          <div class="ranking-info-meta">
            <span>${q.genre}</span>
            <span>${q.reviewCount}件のレビュー</span>
          </div>
        </div>
        <div class="ranking-score">
          <div class="ranking-score-num">★${q.reviewAvg}</div>
          <div class="ranking-score-label">評価</div>
        </div>
      </div>
    `).join('');
  } else if (tab === 'adventurers') {
    const adventurers = [
      { name: '深淵の探索者', avatar: '深', title: '賢者', quests: 12, score: 3200 },
      { name: '黒鉄の剣士', avatar: '黒', title: '勇者', quests: 8, score: 2100 },
      { name: '炎の魔術師', avatar: '炎', title: '勇者', quests: 7, score: 1800 },
      { name: '月影の魔女', avatar: '月', title: '冒険者', quests: 5, score: 1200 },
      { name: '白銀の聖女', avatar: '白', title: '冒険者', quests: 4, score: 950 },
    ];
    list.innerHTML = adventurers.map((a, i) => `
      <div class="ranking-item ${i < 3 ? 'top-3' : ''}">
        <div class="ranking-pos">${i + 1}</div>
        <div class="ranking-thumb" style="border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem">${a.avatar}</div>
        <div class="ranking-info">
          <div class="ranking-info-title">${a.name}</div>
          <div class="ranking-info-meta">
            <span style="color:var(--neon-green)">${a.title}</span>
            <span>${a.quests}クエスト完了</span>
          </div>
        </div>
        <div class="ranking-score">
          <div class="ranking-score-num">${a.score.toLocaleString()}</div>
          <div class="ranking-score-label">ポイント</div>
        </div>
      </div>
    `).join('');
  } else if (tab === 'creators') {
    const creators = [
      { name: '古代の語り部', avatar: '古', quests: 3, sales: 420, rating: 4.8 },
      { name: '幻影の錬金術師', avatar: '幻', quests: 2, sales: 268, rating: 4.7 },
      { name: '深海の設計士', avatar: '海', quests: 1, sales: 203, rating: 4.8 },
    ];
    list.innerHTML = creators.map((c, i) => `
      <div class="ranking-item ${i < 3 ? 'top-3' : ''}">
        <div class="ranking-pos">${i + 1}</div>
        <div class="ranking-thumb" style="border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem">${c.avatar}</div>
        <div class="ranking-info">
          <div class="ranking-info-title">${c.name}</div>
          <div class="ranking-info-meta">
            <span>${c.quests}作品</span>
            <span>★${c.rating}</span>
          </div>
        </div>
        <div class="ranking-score">
          <div class="ranking-score-num">${c.sales}</div>
          <div class="ranking-score-label">総受注数</div>
        </div>
      </div>
    `).join('');
  }
}

/* ── MY PAGE ── */
async function renderMyPage() {
  const container = document.getElementById('mypage-content');
  const currentTitleIdx = titleLevels.findIndex(t => t.name === userState.title);
  const nextTitle = titleLevels[currentTitleIdx + 1];
  const progress = nextTitle
    ? ((userState.questsAccepted - titleLevels[currentTitleIdx].min) / (nextTitle.min - titleLevels[currentTitleIdx].min)) * 100
    : 100;

  // Load order history
  let ordersHtml = '';
  const sb = getSupabase();
  if (sb && userState.userId) {
    try {
      const { data: orders } = await sb
        .from('orders')
        .select('*')
        .eq('user_id', userState.userId)
        .order('created_at', { ascending: false });

      if (orders && orders.length > 0) {
        ordersHtml = `
          <div class="mypage-section-title">注文履歴</div>
          <div class="order-history-list">
            ${orders.map(o => {
              const statusLabel = { pending: '処理中', paid: '支払済', shipped: '発送済', delivered: '配達完了', cancelled: 'キャンセル' }[o.status] || o.status;
              const statusClass = { pending: 'processing', paid: 'paid', shipped: 'shipping', delivered: 'delivered', cancelled: 'cancelled' }[o.status] || '';
              return `
                <div class="order-item">
                  <div class="order-item-header">
                    <span class="order-number">注文 #${escapeHtml(o.shopify_order_number || o.shopify_order_id)}</span>
                    <span class="order-status ${statusClass}">${statusLabel}</span>
                  </div>
                  <div class="order-item-body">
                    <div class="order-total">¥${o.total_price.toLocaleString()}</div>
                    <div class="order-date">${new Date(o.created_at).toLocaleDateString('ja-JP')}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    }
  }

  container.innerHTML = `
    <div class="mypage-profile">
      <div class="mypage-avatar">${userState.avatar}</div>
      <div class="mypage-info">
        <div class="mypage-name">${escapeHtml(userState.name)}</div>
        <div class="mypage-title">${userState.title}</div>
        <div class="mypage-stats-row">
          <div class="mypage-stat-item">
            <div class="mypage-stat-num">${userState.questsAccepted}</div>
            <div class="mypage-stat-label">受注済み</div>
          </div>
          <div class="mypage-stat-item">
            <div class="mypage-stat-num">${userState.questsCompleted}</div>
            <div class="mypage-stat-label">クリア</div>
          </div>
          <div class="mypage-stat-item">
            <div class="mypage-stat-num">${userState.coins}</div>
            <div class="mypage-stat-label">コイン</div>
          </div>
        </div>
      </div>
    </div>

    <div class="title-progress">
      <div class="title-progress-header">
        <div class="title-progress-label">称号レベル</div>
        <div class="title-progress-next">${nextTitle ? `次の称号: ${nextTitle.name}（あと${nextTitle.min - userState.questsAccepted}クエスト）` : '最高ランク達成！'}</div>
      </div>
      <div class="title-bar">
        <div class="title-bar-fill" style="width:${Math.min(progress, 100)}%"></div>
      </div>
      <div class="title-steps">
        ${titleLevels.map((t, i) => `
          <div class="title-step ${i < currentTitleIdx ? 'achieved' : i === currentTitleIdx ? 'current' : ''}">${t.name}</div>
        `).join('')}
      </div>
    </div>

    <div class="mypage-section-title">受注済みクエスト</div>
    ${userState.acceptedQuests.length ? `
      <div class="my-quest-list">
        ${userState.acceptedQuests.map(qid => {
          const q = quests.find(quest => quest.id === qid);
          if (!q) return '';
          const hasReview = userState.reviewedQuests.includes(qid);
          return `
            <div class="my-quest-item" onclick="openQuestDetail(${q.id})">
              <div class="my-quest-thumb">
                ${q.image ? `<img src="${q.image}" alt="${q.title}" loading="lazy">` : ''}
              </div>
              <div class="my-quest-info">
                <div class="my-quest-title">${q.title}</div>
                <div class="my-quest-badges">
                  <span class="my-quest-status shipping">発送準備中</span>
                  ${hasReview
                    ? '<span class="my-quest-review-badge reviewed">報告書 提出済</span>'
                    : '<span class="my-quest-review-badge unreview">報告書 未提出</span>'}
                </div>
              </div>
              <div class="my-quest-date">受注済み</div>
            </div>
          `;
        }).join('')}
      </div>
    ` : `
      <div class="empty-state">
        <div class="empty-state-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg></div>
        <div class="empty-state-text">まだクエストを受注していません</div>
        <button class="btn-outline" onclick="navigateTo('quest-board')">クエスト一覧を見る →</button>
      </div>
    `}

    ${ordersHtml}

    <div class="mypage-actions">
      <button class="btn-logout" onclick="handleLogout()" aria-label="ログアウト">ログアウト</button>
    </div>
  `;
}

/* ── LEGAL PAGES ── */
function renderLegalPage(type) {
  const container = document.getElementById(`${type}-content`);
  if (!container) return;

  const content = {
    terms: `
      <h2>利用規約</h2>
      <p class="legal-updated">最終更新日: 2026年3月1日</p>

      <h3>第1条（適用）</h3>
      <p>本利用規約（以下「本規約」）は、リアクエ REAL QUEST（以下「当サービス」）の利用条件を定めるものです。登録ユーザーの皆さまには、本規約に従って本サービスをご利用いただきます。</p>

      <h3>第2条（利用登録）</h3>
      <p>登録希望者が当サービスの定める方法によって利用登録を申請し、当サービスがこれを承認することによって、利用登録が完了するものとします。</p>

      <h3>第3条（ユーザーIDおよびパスワードの管理）</h3>
      <p>ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。</p>

      <h3>第4条（禁止事項）</h3>
      <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
      <ul>
        <li>法令または公序良俗に違反する行為</li>
        <li>犯罪行為に関連する行為</li>
        <li>当サービスの他のユーザーまたは第三者の知的財産権、肖像権、プライバシー等を侵害する行為</li>
        <li>当サービスのサーバーまたはネットワークの機能を破壊したり妨害したりする行為</li>
        <li>当サービスの運営を妨害するおそれのある行為</li>
        <li>クエスト内容のネタバレを不特定多数に公開する行為</li>
      </ul>

      <h3>第5条（商品の購入）</h3>
      <p>ユーザーは、当サービスを通じてクエスト商品を購入することができます。商品の購入に際しては、Shopifyを通じた決済が行われます。</p>

      <h3>第6条（返品・交換）</h3>
      <p>商品の性質上（謎解きコンテンツの特性）、開封後の返品はお受けできません。未開封の場合は、商品到着後7日以内にお問い合わせください。不良品の場合は速やかに交換対応いたします。</p>

      <h3>第7条（免責事項）</h3>
      <p>当サービスは、本サービスに事実上または法律上の瑕疵がないことを明示的にも黙示的にも保証しておりません。</p>

      <h3>第8条（サービス内容の変更等）</h3>
      <p>当サービスは、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。</p>
    `,
    privacy: `
      <h2>プライバシーポリシー</h2>
      <p class="legal-updated">最終更新日: 2026年3月1日</p>

      <h3>1. 収集する情報</h3>
      <p>当サービスは、以下の情報を収集します。</p>
      <ul>
        <li>メールアドレス（アカウント登録時）</li>
        <li>表示名（任意設定）</li>
        <li>配送先住所（商品購入時、Shopify経由）</li>
        <li>決済情報（商品購入時、Shopify経由で処理。当サービスでは保存しません）</li>
        <li>サービス利用履歴（クエスト受諾、レビュー投稿等）</li>
        <li>アクセスログ（Google Analytics 4を使用）</li>
      </ul>

      <h3>2. 情報の利用目的</h3>
      <ul>
        <li>サービスの提供・運営</li>
        <li>商品の配送</li>
        <li>お問い合わせへの対応</li>
        <li>サービスの改善・新機能開発</li>
        <li>利用状況の分析</li>
      </ul>

      <h3>3. 第三者への提供</h3>
      <p>当サービスは、以下の場合を除き、収集した個人情報を第三者に提供しません。</p>
      <ul>
        <li>ユーザーの同意がある場合</li>
        <li>法令に基づく場合</li>
        <li>商品配送のために配送業者に必要最低限の情報を提供する場合</li>
      </ul>

      <h3>4. 外部サービス</h3>
      <p>当サービスでは以下の外部サービスを利用しています。</p>
      <ul>
        <li>Supabase（認証・データベース）</li>
        <li>Shopify（決済・配送管理）</li>
        <li>Google Analytics 4（アクセス解析）</li>
      </ul>

      <h3>5. データの保護</h3>
      <p>当サービスは、収集した情報の漏えい、滅失またはき損の防止のために、適切なセキュリティ対策を実施します。</p>

      <h3>6. お問い合わせ</h3>
      <p>プライバシーに関するお問い合わせは、お問い合わせフォームよりご連絡ください。</p>
    `,
    tokushoho: `
      <h2>特定商取引法に基づく表記</h2>
      <p class="legal-updated">最終更新日: 2026年3月1日</p>

      <table class="legal-table">
        <tr><th>販売事業者</th><td>リアクエ REAL QUEST 運営事務局</td></tr>
        <tr><th>代表者</th><td>※ 要設定</td></tr>
        <tr><th>所在地</th><td>※ 要設定</td></tr>
        <tr><th>電話番号</th><td>※ 要設定（お問い合わせフォームをご利用ください）</td></tr>
        <tr><th>メールアドレス</th><td>※ 要設定</td></tr>
        <tr><th>販売URL</th><td>https://moedesu1.github.io/realquest-demo/a-rpg/</td></tr>
        <tr><th>販売価格</th><td>各商品ページに記載（税込表示）</td></tr>
        <tr><th>送料</th><td>全商品送料込み</td></tr>
        <tr><th>商品代金以外の必要料金</th><td>なし</td></tr>
        <tr><th>支払方法</th><td>クレジットカード（Shopify経由）</td></tr>
        <tr><th>支払時期</th><td>注文時に即時決済</td></tr>
        <tr><th>商品の引渡し時期</th><td>受注後3〜5営業日以内に発送</td></tr>
        <tr><th>返品・交換について</th><td>商品の性質上、開封後の返品不可。未開封の場合は商品到着後7日以内。不良品は速やかに交換対応。</td></tr>
      </table>
    `,
  };

  container.innerHTML = content[type] || '';
}

/* ── CONTACT FORM ── */
async function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const category = document.getElementById('contact-category').value;
  const message = document.getElementById('contact-message').value.trim();
  const errorEl = document.getElementById('contact-error');
  const successEl = document.getElementById('contact-success');
  const submitBtn = document.getElementById('contact-submit-btn');

  errorEl.style.display = 'none';
  successEl.style.display = 'none';

  if (!name || !email || !category || !message) {
    errorEl.textContent = '全ての項目を入力してください。';
    errorEl.style.display = 'block';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '送信中...';

  const sb = getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from('contact_submissions').insert({ name, email, category, message });
      if (error) throw error;

      // Trigger email notification via Edge Function (fire-and-forget)
      sb.functions.invoke('send-contact-email', {
        body: { name, email, category, message },
      }).catch(e => console.log('Email notification skipped:', e.message));
    } catch (err) {
      errorEl.textContent = '送信に失敗しました。もう一度お試しください。';
      errorEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = '送信する';
      return;
    }
  } else {
    errorEl.textContent = 'サービスに接続できません。しばらく経ってからお試しください。';
    errorEl.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = '送信する';
    return;
  }

  trackEvent('contact_submit', { category });
  successEl.textContent = 'お問い合わせを受け付けました。確認後、ご連絡いたします。';
  successEl.style.display = 'block';
  e.target.reset();
  submitBtn.disabled = false;
  submitBtn.textContent = '送信する';
}

/* ── REVIEW LIKE ── */
async function toggleLike(btn, questId, reviewIdx) {
  const quest = quests.find(q => q.id === questId);
  if (!quest || !quest.reviews[reviewIdx]) return;

  const review = quest.reviews[reviewIdx];
  const reviewId = review.reviewId;
  const sb = getSupabase();
  const isCurrentlyLiked = btn.classList.contains('liked');

  // Optimistic UI update
  btn.classList.toggle('liked');
  if (isCurrentlyLiked) review.likes = Math.max(0, review.likes - 1);
  else review.likes++;
  btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="${isCurrentlyLiked ? 'none' : 'currentColor'}" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg> ${review.likes}`;

  // Persist to Supabase
  if (sb && userState.userId && reviewId) {
    try {
      if (isCurrentlyLiked) {
        // Remove like
        await sb.from('review_likes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', userState.userId);
      } else {
        // Add like
        await sb.from('review_likes')
          .insert({ review_id: reviewId, user_id: userState.userId });
      }
    } catch (e) {
      // Revert on error
      console.error('Like toggle error:', e);
      btn.classList.toggle('liked');
      if (isCurrentlyLiked) review.likes++;
      else review.likes = Math.max(0, review.likes - 1);
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg> ${review.likes}`;
    }
  }
}

/* ── MOBILE MENU ── */
function openMobileMenu() { document.getElementById('mobile-menu').classList.add('open'); }
function closeMobileMenu() { document.getElementById('mobile-menu').classList.remove('open'); }

/* ── AUDIO / BGM SYSTEM ── */
let audioContext = null;
let isPlaying = false;
let bgmInterval = null;

function startBGM() {
  if (isPlaying) return;
  try {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    isPlaying = true;
    updateAudioButtons();
    scheduleBGMLoop();
  } catch (e) {}
}

function scheduleBGMLoop() {
  if (!isPlaying || !audioContext) return;

  const ctx = audioContext;
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.06;
  master.connect(ctx.destination);

  const chords = [
    [261.63, 329.63, 392.00],
    [293.66, 369.99, 440.00],
    [246.94, 311.13, 369.99],
    [261.63, 329.63, 392.00],
  ];

  const chordDur = 4;
  chords.forEach((chord, ci) => {
    chord.forEach(freq => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = now + ci * chordDur;
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.3, t + 0.5);
      env.gain.setValueAtTime(0.3, t + chordDur - 0.5);
      env.gain.linearRampToValueAtTime(0, t + chordDur);
      osc.connect(env);
      env.connect(master);
      osc.start(t);
      osc.stop(t + chordDur);
    });

    const melodyFreqs = [523.25, 587.33, 493.88, 523.25];
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = melodyFreqs[ci];
    const t = now + ci * chordDur + 1;
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.15, t + 0.2);
    env.gain.exponentialRampToValueAtTime(0.01, t + 2);
    osc.connect(env);
    env.connect(master);
    osc.start(t);
    osc.stop(t + 2.5);
  });

  const totalDur = chords.length * chordDur;
  bgmInterval = setTimeout(() => scheduleBGMLoop(), totalDur * 1000);
}

function stopBGM() {
  isPlaying = false;
  if (bgmInterval) clearTimeout(bgmInterval);
  bgmInterval = null;
  updateAudioButtons();
}

function toggleAudio() {
  if (isPlaying) stopBGM();
  else startBGM();
}

function updateAudioButtons() {
  document.querySelectorAll('.audio-toggle').forEach(btn => {
    btn.classList.toggle('playing', isPlaying);
  });
}

/* ── SFX ── */
function playStartSFX() {
  try {
    const ctx = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    audioContext = ctx;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = 0.12;
    gain.connect(ctx.destination);

    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0.4, now + i * 0.08);
      env.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.25);
      osc.connect(env);
      env.connect(gain);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  } catch (e) {}
}

/* ── PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const count = 40;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.3 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,215,0,${p.a})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── INIT ── */
const __navigateTo = navigateTo;
navigateTo = function(pageId, options = {}) {
  const origOnShow = options.onShow;
  options.onShow = function() {
    if (origOnShow) origOnShow();
    if (pageId === 'rankings') renderRanking('popular');
    if (pageId === 'mypage') renderMyPage();
    if (['terms', 'privacy', 'tokushoho'].includes(pageId)) renderLegalPage(pageId);
  };
  __navigateTo(pageId, options);
};

/* ── AUTH STATE LISTENER ── */
(async function initApp() {
  // Init GA4
  if (GA4_ID && GA4_ID !== 'G-XXXXXXXXXX') {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(gaScript);
    gtag('config', GA4_ID);
  }

  // Init Shopify
  initShopify();

  const sb = getSupabase();
  if (!sb) return;

  let initialNavDone = false;

  // Listen for auth state changes (handles INITIAL_SESSION, SIGNED_IN, SIGNED_OUT)
  sb.auth.onAuthStateChange(async (event, session) => {
    if (session && session.user) {
      // Prevent double-navigation (INITIAL_SESSION + getSession race)
      if (initialNavDone) {
        updateHeaderUser();
        return;
      }
      initialNavDone = true;

      userState.loggedIn = true;
      userState.userId = session.user.id;
      userState.role = 'adventurer';

      await loadUserProfile(session.user.id);
      await loadQuestsFromDB();

      if (currentPage === 'opening') {
        playStartSFX();
        setTimeout(() => startBGM(), 300);
        navigateTo('quest-board', {
          transitionText: event === 'INITIAL_SESSION' ? 'セッションを復元しています...' : 'ギルド掲示板を開いています...',
          delay: event === 'INITIAL_SESSION' ? 800 : 1200,
          onShow: () => {
            renderQuestCards(quests);
            updateHeaderUser();
          }
        });
      } else {
        updateHeaderUser();
      }
    } else if (event === 'SIGNED_OUT') {
      initialNavDone = false;
      userState.loggedIn = false;
      userState.userId = null;
    }
  });
})();
