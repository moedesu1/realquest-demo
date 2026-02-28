/* ============================================================
   REAL QUEST — App v2
   Platform MVP: Data + Navigation + Rendering + BGM + Effects
   ============================================================ */

/* ── QUEST DATA ── */
const quests = [
  {
    id: 1,
    title: '消えた錬金術師の遺産',
    tagline: '失われた知識が、あなたの手元に届く——',
    rank: 'A',
    difficulty: 3,
    price: 4980,
    category: 'advanced',
    format: 'home',
    genre: '謎解き',
    subGenre: 'ファンタジー',
    isNew: true,
    image: 'images/quest-1-alchemy.webp',
    estimatedTime: '3〜5時間',
    players: '1〜4人',
    region: '自宅完結',
    items: [
      { icon: '◆', name: '錬金術師の手記（暗号入り羊皮紙風）' },
      { icon: '◆', name: '謎の試薬セット（3本）' },
      { icon: '◆', name: '封印の鍵（金属製レプリカ）' },
      { icon: '◆', name: 'ギルドからの依頼書' },
    ],
    prologue: 'かつて王国に仕えた天才錬金術師・エルドが姿を消してから百年。彼の工房跡から届いた一通の手紙には、「遺産を継ぐ者へ」とだけ記されていた。封を開けた瞬間、あなたの日常は冒険へと変わる。手記に隠された暗号を解き、失われた錬金術の秘密に辿り着けるか——。',
    cautions: ['ネタバレ禁止', 'はさみ・筆記用具をご用意ください', '対象年齢: 12歳以上'],
    reviews: [
      { user: '黒鉄の剣士', title: '冒険者', avatar: '黒', level: 28, rank: 'C', stars: 5, date: '2026.02.15', text: '羊皮紙の質感が本物みたいで、没入感がすごかった。暗号も手応えあり！家族4人で挑んで3時間半で完了。試薬セットのギミックが特に秀逸で、子どもたちが大興奮でした。', sub: { craft: 5, story: 4, volume: 4 }, likes: 12 },
      { user: '月影の魔女', title: '勇者', avatar: '月', level: 45, rank: 'B', stars: 4, date: '2026.02.10', text: '試薬セットが凝っていて感動。もう少しヒントがあると初心者にも優しいかも。暗号の難易度がちょうどいい塩梅で、最後の謎を解いた時の達成感が最高でした。', sub: { craft: 5, story: 4, volume: 3 }, likes: 8 },
      { user: '旅の商人', title: '見習い', avatar: '旅', level: 12, rank: 'D', stars: 5, date: '2026.01.28', text: '友達4人でやって最高に盛り上がった。物語の結末が衝撃的！リアルなアイテムが届く体験は他にはない。次のクエストも必ずやります。', sub: { craft: 4, story: 5, volume: 4 }, likes: 5 },
    ],
    reviewAvg: 4.7,
    reviewCount: 24,
    salesCount: 156,
  },
  {
    id: 2,
    title: '月夜の図書館と禁断の書',
    tagline: 'ページを開くと、現実が書き換わる——',
    rank: 'B',
    difficulty: 2,
    price: 3480,
    category: 'beginner',
    format: 'home',
    genre: '謎解き',
    subGenre: 'ホラー',
    isNew: false,
    image: 'images/quest-2-library.webp',
    estimatedTime: '2〜3時間',
    players: '1〜2人',
    region: '自宅完結',
    items: [
      { icon: '◆', name: '禁断の書（特殊インク仕掛け本）' },
      { icon: '◆', name: '蝋封の手紙' },
      { icon: '◆', name: '月光石（蓄光アクセサリー）' },
    ],
    prologue: '深夜の図書館で見つけた一冊の古書。表紙には「この本を読んだ者は、物語の中に取り込まれる」と警告が刻まれている。好奇心に負けてページをめくったその瞬間——図書館の照明が消え、物語が動き出す。',
    cautions: ['ネタバレ禁止', '暗い場所での使用推奨', '対象年齢: 15歳以上'],
    reviews: [
      { user: '星読みの賢者', title: '冒険者', avatar: '星', level: 33, rank: 'C', stars: 5, date: '2026.02.12', text: '特殊インクのギミックに鳥肌が立った。ホラー好きにはたまらない。暗い部屋でやると雰囲気が倍増する。蓄光アクセサリーが普段使いできるクオリティで嬉しい。', sub: { craft: 5, story: 5, volume: 3 }, likes: 15 },
      { user: '森の狩人', title: '見習い', avatar: '森', level: 8, rank: 'E', stars: 4, date: '2026.02.01', text: 'カップルでやったら最高。蝋封を開ける瞬間のドキドキ感がいい。ストーリーも切なくて余韻が残る。初めてのリアクエだったけど、すっかりハマりました。', sub: { craft: 4, story: 5, volume: 3 }, likes: 7 },
    ],
    reviewAvg: 4.5,
    reviewCount: 18,
    salesCount: 112,
  },
  {
    id: 3,
    title: '失われた王国の暗号',
    tagline: '千年の謎が、今あなたの元に——',
    rank: 'A',
    difficulty: 4,
    price: 5980,
    category: 'advanced',
    format: 'hybrid',
    genre: '暗号解読',
    subGenre: '歴史冒険',
    isNew: true,
    image: 'images/quest-3-ruins.webp',
    estimatedTime: '5〜8時間',
    players: '1〜4人',
    region: '大阪',
    items: [
      { icon: '◆', name: '古代王国の地図（布製）' },
      { icon: '◆', name: '王家の紋章（メタルコイン）' },
      { icon: '◆', name: '暗号文書セット（5枚）' },
      { icon: '◆', name: '冒険者のコンパス（機能付き）' },
      { icon: '◆', name: 'ギルド特別依頼書' },
    ],
    prologue: '学術調査隊が砂漠の遺跡で発見した石板の拓本が、冒険者ギルド経由であなたに届いた。石板には滅びた王国の財宝の在処が記されているという。だが暗号は幾重にも重ねられ、解読には王国の歴史そのものを紐解く必要がある。',
    cautions: ['ネタバレ禁止', '現地ステージあり（大阪市内）', '歩きやすい服装推奨', '対象年齢: 15歳以上'],
    reviews: [
      { user: '古代の探究者', title: '勇者', avatar: '古', level: 52, rank: 'B', stars: 5, date: '2026.02.20', text: '大阪の街を歩きながら暗号を解く体験は唯一無二。コンパスが本当に使えるのも驚き。歴史の知識も自然と身について、観光としても最高。布製の地図はフレームに入れて飾ってます。', sub: { craft: 5, story: 5, volume: 5 }, likes: 23 },
    ],
    reviewAvg: 4.9,
    reviewCount: 31,
    salesCount: 89,
  },
  {
    id: 4,
    title: '時計塔の幽霊事件簿',
    tagline: '時を止めた真犯人を、暴け——',
    rank: 'B',
    difficulty: 2,
    price: 3980,
    category: 'beginner',
    format: 'home',
    genre: '推理',
    subGenre: 'ゴシック',
    isNew: false,
    image: 'images/quest-4-clocktower.webp',
    estimatedTime: '2〜4時間',
    players: '1〜3人',
    region: '自宅完結',
    items: [
      { icon: '◆', name: '止まった懐中時計（レプリカ）' },
      { icon: '◆', name: '事件調書ファイル' },
      { icon: '◆', name: '探偵の証拠品セット' },
    ],
    prologue: '街の象徴である時計塔が、ある夜を境に止まった。同時に塔守が姿を消し、「幽霊の仕業だ」と噂が広まる。ギルドから届いた事件調書には、不可解な証言と矛盾する証拠が並ぶ。真相は、止まった時計の針の先にある。',
    cautions: ['ネタバレ禁止', '筆記用具をご用意ください'],
    reviews: [
      { user: '鉄壁の騎士', title: '冒険者', avatar: '鉄', level: 22, rank: 'D', stars: 4, date: '2026.01.25', text: '推理パートが本格的で、最後の伏線回収に震えた。懐中時計がかっこいい。証拠品を並べて推理する過程が刑事ドラマみたいでワクワクした。', sub: { craft: 4, story: 5, volume: 3 }, likes: 9 },
      { user: '風の吟遊詩人', title: '見習い', avatar: '風', level: 5, rank: 'E', stars: 5, date: '2026.01.18', text: 'ゴシックな雰囲気がたまらない。調書の作り込みが素晴らしい！紙質や印刷にもこだわりを感じる。推理好きには絶対おすすめ。', sub: { craft: 5, story: 5, volume: 3 }, likes: 6 },
    ],
    reviewAvg: 4.3,
    reviewCount: 15,
    salesCount: 78,
  },
  {
    id: 5,
    title: '深海遺跡からの招待状',
    tagline: '海底に眠る文明が、あなたを呼んでいる——',
    rank: 'S',
    difficulty: 5,
    price: 7980,
    category: 'advanced',
    format: 'home',
    genre: '謎解き',
    subGenre: 'SF',
    isNew: true,
    image: 'images/quest-5-deepsea.webp',
    estimatedTime: '6〜10時間',
    players: '2〜5人',
    region: '自宅完結',
    items: [
      { icon: '◆', name: '深海の通信器（音声ギミック付き）' },
      { icon: '◆', name: '海底遺跡の海図（防水仕様）' },
      { icon: '◆', name: '古代文明のクリスタル（LED内蔵）' },
      { icon: '◆', name: '暗号化された研究日誌' },
      { icon: '◆', name: 'パズルロックボックス' },
      { icon: '◆', name: 'ギルド最高機密依頼書' },
    ],
    prologue: '深海探査船が海底3,000mで発見した遺跡——それは、既知のどの文明にも属さない未知の建造物だった。探査チームが回収した遺物の一つ「通信器」が突如起動し、あなたの名前を呼んだ。海底からの招待に応じる覚悟はあるか。',
    cautions: ['ネタバレ禁止', '単4電池2本が必要', '2人以上での挑戦推奨', '対象年齢: 15歳以上'],
    reviews: [
      { user: '深淵の探索者', title: '賢者', avatar: '深', level: 78, rank: 'A', stars: 5, date: '2026.02.22', text: '通信器から声が聞こえた瞬間、全員鳥肌。パズルロックボックスも精巧で最高の体験。5人でやったけど全員が役割を持てるバランスが素晴らしい。間違いなくリアクエの最高傑作。', sub: { craft: 5, story: 5, volume: 5 }, likes: 31 },
      { user: '炎の魔術師', title: '勇者', avatar: '炎', level: 56, rank: 'B', stars: 5, date: '2026.02.18', text: '過去最高のクエスト。10時間があっという間だった。LED内蔵クリスタルが美しい。防水の海図も芸が細かい。このクオリティなら1万円でも買う。', sub: { craft: 5, story: 5, volume: 5 }, likes: 19 },
      { user: '銀の盗賊', title: '冒険者', avatar: '銀', level: 31, rank: 'C', stars: 4, date: '2026.02.05', text: '難易度は高いが、その分クリアした時の達成感が凄い。値段以上の価値あり。ただ2人だと途中で行き詰まる場面があったので、3人以上推奨。', sub: { craft: 5, story: 4, volume: 5 }, likes: 11 },
    ],
    reviewAvg: 4.8,
    reviewCount: 42,
    salesCount: 203,
  },
  {
    id: 6,
    title: '魔法薬店の最後の一日',
    tagline: '閉店までに、最後のレシピを完成させよ——',
    rank: 'C',
    difficulty: 1,
    price: 2980,
    category: 'beginner',
    format: 'home',
    genre: '体験型',
    subGenre: 'ファンタジー',
    isNew: false,
    image: 'images/quest-6-potionshop.webp',
    estimatedTime: '1〜2時間',
    players: '1人',
    region: '自宅完結',
    items: [
      { icon: '◆', name: '魔法薬レシピカード（5枚）' },
      { icon: '◆', name: 'ハーブ素材セット（本物のドライハーブ）' },
      { icon: '◆', name: '薬店主の日記' },
    ],
    prologue: 'ひっそりと営業を続けてきた「月影の魔法薬店」が、今日で閉店する。店主のおばあさんから届いた小包には、完成させられなかった最後のレシピと、本物のハーブが入っていた。「あなたなら、きっと作れるはず」——その言葉を信じて、最後の魔法薬を調合せよ。',
    cautions: ['ネタバレ禁止', '食用ではありません', '対象年齢: 10歳以上'],
    reviews: [
      { user: '白銀の聖女', title: '見習い', avatar: '白', level: 15, rank: 'D', stars: 5, date: '2026.02.08', text: '本物のハーブの香りが最高。子どもと一緒にやっても楽しめる優しい難易度。おばあさんの日記を読みながらレシピを完成させていく過程が心温まる。親子の思い出になりました。', sub: { craft: 5, story: 5, volume: 2 }, likes: 18 },
      { user: '大地の守人', title: '見習い', avatar: '大', level: 3, rank: 'F', stars: 4, date: '2026.01.30', text: '物語が温かくて泣きそうになった。気軽に始められるのがいい。ドライハーブの質感が本物で、部屋中がいい香りになった。初めてのリアクエにぴったり。', sub: { craft: 4, story: 5, volume: 2 }, likes: 10 },
    ],
    reviewAvg: 4.6,
    reviewCount: 35,
    salesCount: 267,
  },
];

/* ── USER STATE ── */
const userState = {
  loggedIn: false,
  role: null, // 'adventurer' | 'creator'
  name: '名もなき冒険者',
  avatar: '冒',
  title: '見習い',
  questsCompleted: 0,
  questsAccepted: 0,
  coins: 0,
  acceptedQuests: [],
};

/* Title progression */
const titleLevels = [
  { name: '見習い', min: 0 },
  { name: '冒険者', min: 2 },
  { name: '勇者', min: 5 },
  { name: '賢者', min: 10 },
];

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
  };

  const targetEl = pageMap[pageId];
  if (!targetEl) return;

  // Save current scroll
  const currentEl = document.querySelector('.page.active');
  if (currentEl) savedScrollPositions[currentEl.id] = currentEl.scrollTop;

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

/* ── LOGIN ── */
function loginAsAdventurer() {
  userState.loggedIn = true;
  userState.role = 'adventurer';

  playStartSFX();
  setTimeout(() => startBGM(), 300);

  navigateTo('quest-board', {
    transitionText: 'ギルド掲示板を開いています...',
    delay: 1200,
    onShow: () => {
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
let currentFilter = 'all';

function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('#filter-row .filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

function setPurposeFilter(purpose) {
  // Map purpose to filter and scroll to results
  const filterMap = {
    'puzzle': 'puzzle',
    'outdoor': 'outdoor',
    'boardgame': 'boardgame',
    'home': 'home',
    'region': 'all', // TODO: region selector
  };
  currentFilter = filterMap[purpose] || 'all';

  // Update chip UI
  document.querySelectorAll('#filter-row .filter-chip').forEach(c => {
    c.classList.remove('active');
    const chipFilter = c.getAttribute('onclick')?.match(/setFilter\('(.+?)'/)?.[1];
    if (chipFilter === currentFilter) c.classList.add('active');
  });
  if (currentFilter === 'all') {
    document.querySelector('#filter-row .filter-chip')?.classList.add('active');
  }

  applyFilters();

  // Scroll to the quest grid
  setTimeout(() => {
    const grid = document.getElementById('quest-grid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function handleSearch() {
  applyFilters();
}

function handleSort() {
  applyFilters();
}

function applyFilters() {
  const keyword = document.getElementById('search-input').value.toLowerCase();
  const sort = document.getElementById('sort-select').value;

  let filtered = quests.filter(q => {
    // Keyword
    if (keyword && !q.title.toLowerCase().includes(keyword) &&
        !q.genre.toLowerCase().includes(keyword) &&
        !q.subGenre?.toLowerCase().includes(keyword) &&
        !q.region.toLowerCase().includes(keyword)) {
      return false;
    }
    // Category filter
    if (currentFilter === 'home' && q.format !== 'home') return false;
    if (currentFilter === 'outdoor' && q.format !== 'outdoor' && q.format !== 'hybrid') return false;
    if (currentFilter === 'beginner' && q.difficulty > 2) return false;
    if (currentFilter === 'advanced' && q.difficulty < 3) return false;
    if (currentFilter === 'puzzle' && q.genre !== '謎解き' && q.genre !== '暗号解読') return false;
    if (currentFilter === 'boardgame' && q.genre !== 'ボードゲーム') return false;
    return true;
  });

  // Sort
  switch (sort) {
    case 'newest': filtered.sort((a, b) => b.id - a.id); break;
    case 'popular': filtered.sort((a, b) => b.salesCount - a.salesCount); break;
    case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
    case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
    case 'difficulty-low': filtered.sort((a, b) => a.difficulty - b.difficulty); break;
    case 'difficulty-high': filtered.sort((a, b) => b.difficulty - a.difficulty); break;
  }

  renderQuestCards(filtered);
}

/* ── QUEST DETAIL ── */
function openQuestDetail(questId) {
  const quest = quests.find(q => q.id === questId);
  if (!quest) return;

  navigateTo('detail', {
    transitionText: '依頼書を準備中...',
    delay: 700,
    onShow: () => renderDetail(quest),
  });
}

function renderDetail(quest) {
  const stars = n => Array.from({ length: 5 }, (_, i) => `<span class="star ${i < n ? 'filled' : ''}">★</span>`).join('');
  const reviewStars = n => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
  const isAccepted = userState.acceptedQuests.includes(quest.id);
  const formatLabel = { home: '自宅完結', outdoor: '現地型', hybrid: 'ハイブリッド' }[quest.format] || quest.format;

  // Review distribution (mock)
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

    <!-- ACCEPTANCE RITUAL UI -->
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

        ${isAccepted ? '' : `
          <button class="btn-accept" onclick="acceptQuest(${quest.id})">
            このクエストを受諾する
          </button>
        `}
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

    <!-- REVIEWS (HV-style) -->
    <div class="reviews-section">
      <div class="detail-section-title">冒険者レビュー</div>

      <div class="reviews-header">
        <div class="reviews-total">総数：<strong>${quest.reviewCount}</strong>件</div>
        <div class="reviews-write-link">レビューを書く</div>
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

              <div class="review-text">${r.text}</div>

              ${r.sub ? `
                <div class="review-sub-ratings">
                  <div class="review-sub-item"><span class="review-sub-label">できたえ：</span><span class="review-sub-value">${r.sub.craft}</span></div>
                  <div class="review-sub-item"><span class="review-sub-label">ストーリー：</span><span class="review-sub-value">${r.sub.story}</span></div>
                  <div class="review-sub-item"><span class="review-sub-label">ボリューム：</span><span class="review-sub-value">${r.sub.volume}</span></div>
                </div>
              ` : ''}

              <div class="review-card-footer">
                <button class="review-like-btn" onclick="event.stopPropagation(); toggleLike(this, ${quest.id}, ${ri})">
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

/* ── ACCEPT QUEST ── */
function acceptQuest(questId) {
  const quest = quests.find(q => q.id === questId);
  if (!quest || userState.acceptedQuests.includes(questId)) return;

  // Play acceptance SFX
  playAcceptSFX();

  // Update state
  userState.acceptedQuests.push(questId);
  userState.questsAccepted++;

  // Update title
  const newTitle = [...titleLevels].reverse().find(t => userState.questsAccepted >= t.min);
  if (newTitle) userState.title = newTitle.name;
  updateHeaderUser();

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

    // Triumphant chord: C major arpeggio up
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

    // Final sustained chord
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
function renderMyPage() {
  const container = document.getElementById('mypage-content');
  const currentTitleIdx = titleLevels.findIndex(t => t.name === userState.title);
  const nextTitle = titleLevels[currentTitleIdx + 1];
  const progress = nextTitle
    ? ((userState.questsAccepted - titleLevels[currentTitleIdx].min) / (nextTitle.min - titleLevels[currentTitleIdx].min)) * 100
    : 100;

  container.innerHTML = `
    <div class="mypage-profile">
      <div class="mypage-avatar">${userState.avatar}</div>
      <div class="mypage-info">
        <div class="mypage-name">${userState.name}</div>
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
          return `
            <div class="my-quest-item" onclick="openQuestDetail(${q.id})">
              <div class="my-quest-thumb">
                ${q.image ? `<img src="${q.image}" alt="${q.title}" loading="lazy">` : ''}
              </div>
              <div class="my-quest-info">
                <div class="my-quest-title">${q.title}</div>
                <span class="my-quest-status shipping">発送準備中</span>
              </div>
              <div class="my-quest-date">受注日: 今日</div>
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
  `;
}

/* ── REVIEW LIKE ── */
function toggleLike(btn, questId, reviewIdx) {
  btn.classList.toggle('liked');
  const quest = quests.find(q => q.id === questId);
  if (!quest || !quest.reviews[reviewIdx]) return;
  const isLiked = btn.classList.contains('liked');
  if (isLiked) quest.reviews[reviewIdx].likes++;
  else quest.reviews[reviewIdx].likes--;
  btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg> ${quest.reviews[reviewIdx].likes}`;
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

  // Ambient pad chord
  const chords = [
    [261.63, 329.63, 392.00], // C major
    [293.66, 369.99, 440.00], // D major
    [246.94, 311.13, 369.99], // B minor
    [261.63, 329.63, 392.00], // C major
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

    // Melody note on top
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

  // Schedule next loop
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
// Rankings page: render on navigate
const origNavigate = navigateTo;
const _navigateTo = navigateTo;
// Monkey-patch navigateTo to trigger page-specific renders
const _origOnShow = {};
(function patchNavigation() {
  const original = window.navigateTo;
  // We'll handle onShow callbacks per page type instead
})();

// Override navigateTo to add page-specific init
const __navigateTo = navigateTo;
navigateTo = function(pageId, options = {}) {
  const origOnShow = options.onShow;
  options.onShow = function() {
    if (origOnShow) origOnShow();
    if (pageId === 'rankings') renderRanking('popular');
    if (pageId === 'mypage') renderMyPage();
  };
  __navigateTo(pageId, options);
};
