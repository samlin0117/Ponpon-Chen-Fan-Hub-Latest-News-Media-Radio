import { AudioEngine } from './audio.js';
import { LEVELS, buildPositions, dealLevel, findPair, findPath, levelSize, occupied, reshuffle, slideTiles } from './tiles-logic.js';
import { STRINGS, TILES, detectLang } from './i18n.js';

// 牌面圖案：放在 img/tiles/，之後有新的圖，放進資料夾再在這裡加一筆就好。
// 前面的最好分，每關都會用到；後面幾張長得比較像，到後面的關卡才出現。
const KINDS = ['fig-red', 'fig-gold-seated', 'fig-tray', 'guitar', 'gold-figure', 'whistle', 'fig-mic', 'note', 'fig-white-dress', 'mic', 'fig-suit', 'washboard', 'white-figure', 'scat', 'fig-khaki', 'fig-bag'];
const HINTS = 1; // 每關幾次提示
const SHUFFLES = 1; // 每關幾次洗牌
const COMBO_SECS = 4; // 幾秒內再消一對算連擊
const WARN_SECS = 10; // 剩幾秒開始滴答
const NO_PATH_SECS = 1; // 一樣的牌卻連不起來，扣幾秒
const STUCK_SECS = 5; // 沒牌可消又沒有洗牌次數時，自動洗牌扣幾秒
const ARROWS = { down: '↓', up: '↑', left: '←', right: '→' };
const NEXT_LEVEL_DELAY = 1500;
const SFX_GAIN = 0.55;
const SCALE = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84]; // 連擊越高，音越高（C 大調五聲音階）
const ASPECT = 1.15; // 牌的高是寬的幾倍
const RING = 0.4; // 牌陣外面留幾張牌寬，連線繞到外面時才畫得出來
const LINE_MS = 280; // 連線和消牌動畫的時間
const ASSET_V = new URL(import.meta.url).search;

const $ = (id) => document.getElementById(id);
const board = $('board');
const SVG_NS = 'http://www.w3.org/2000/svg';
const svg = document.createElementNS(SVG_NS, 'svg'); // 消牌時的連線畫在這裡
svg.classList.add('lines');

// 瀏覽器儲存可能被封鎖（無痕模式等），讀寫都包 try/catch
const load = (k) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const save = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

let lang = detectLang();
let T = { ...STRINGS[lang], ...TILES[lang] };
let best = Number(load('ponpon-tiles-best')) || 0;
let engine = null;
let G = null; // 這一局的狀態

// ---------- 介面 ----------

function applyLang() {
  T = { ...STRINGS[lang], ...TILES[lang] };
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = T[el.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-label]').forEach((el) => {
    el.setAttribute('aria-label', T[el.dataset.i18nLabel]);
  });
  document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
  renderBest();
  $('back-to-site').href = lang === 'zh' ? '/games' : `/${lang}/games`;
  if (G) updateHud();
}

function renderBest() {
  $('title-best').textContent = best ? `${T.best} ${best.toLocaleString()}` : '';
}

function show(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
}

function restart(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

function showBanner(text) {
  const b = $('banner');
  b.textContent = text;
  restart(b, 'go');
}

function updateHud() {
  // 這關牌往哪邊滑，一直顯示在關卡旁邊
  $('level-label').textContent = `${T.level.replace('{n}', G.index + 1)}${G.level.slide ? ` ${ARROWS[G.level.slide]}` : ''}`;
  $('score-label').textContent = G.score.toLocaleString();
  $('hint-n').textContent = G.hints;
  $('shuffle-n').textContent = G.shuffles;
  $('btn-hint').disabled = G.hints <= 0;
  $('btn-shuffle').disabled = G.shuffles <= 0;
  updateClock();
}

function updateClock() {
  const left = Math.max(0, G.timeLeft);
  $('time-label').textContent = `${Math.ceil(left)}`;
  $('time-fill').style.transform = `scaleX(${left / G.level.secs})`;
  $('time-box').classList.toggle('warn', left <= WARN_SECS);
}

document.querySelectorAll('[data-lang]').forEach((b) =>
  b.addEventListener('click', () => {
    lang = b.dataset.lang;
    save('ponpon-swing-lang', lang);
    applyLang();
  }),
);
$('btn-start').addEventListener('click', () => startLevel(0, 0));
$('btn-pause').addEventListener('click', pauseGame);
$('btn-resume').addEventListener('click', resumeGame);
$('btn-restart').addEventListener('click', () => startLevel(G.index, G.startScore));
$('btn-quit').addEventListener('click', quitGame);
$('btn-home').addEventListener('click', quitGame);
$('btn-hint').addEventListener('click', useHint);
$('btn-shuffle').addEventListener('click', useShuffle);
// 全破就從第一關重來；輸了就重打這一關，分數回到這關開始時
$('btn-retry').addEventListener('click', () => (G.allClear ? startLevel(0, 0) : startLevel(G.index, G.startScore)));

function pauseGame() {
  if (!G || G.ended || G.paused) return;
  G.paused = true;
  $('overlay-pause').classList.add('show');
}

function resumeGame() {
  if (!G || !G.paused) return;
  G.paused = false;
  $('overlay-pause').classList.remove('show');
}

function saveBest() {
  const isNew = G.score > best;
  if (isNew) {
    best = G.score;
    save('ponpon-tiles-best', String(best));
  }
  return isNew;
}

function quitGame() {
  saveBest();
  G = null;
  $('overlay-end').classList.remove('show');
  $('overlay-pause').classList.remove('show');
  renderBest();
  show('screen-title');
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseGame(); // 切到別的分頁或接電話時自動暫停
});
document.addEventListener('keydown', (e) => {
  if (e.code !== 'Escape' || !G || G.ended || e.repeat) return;
  if (G.paused) resumeGame();
  else pauseGame();
});

// ---------- 開局與版面 ----------

function startLevel(index, score) {
  if (!engine) {
    engine = new AudioEngine();
    engine.master.gain.value = SFX_GAIN;
  }
  try {
    // iPhone 靜音模式下也要有聲音
    if (navigator.audioSession) navigator.audioSession.type = 'playback';
  } catch {}
  if (engine.ctx.state !== 'running') engine.ctx.resume();

  const level = LEVELS[index];
  const tiles = buildPositions(level);
  const size = levelSize(level);
  dealLevel(tiles, KINDS.slice(0, level.kinds), size);
  G = {
    index,
    level,
    size,
    tiles,
    slots: occupied(tiles), // 關卡圖形的格子，牌只會滑進這些格子
    selected: null,
    timeLeft: level.secs,
    tick: 0,
    hints: HINTS,
    shuffles: SHUFFLES,
    startScore: score,
    score,
    combo: 0,
    lastMatch: -99,
    paused: false,
    ended: false,
    allClear: false,
  };
  $('overlay-end').classList.remove('show');
  $('overlay-pause').classList.remove('show');
  show('screen-game');
  board.textContent = '';
  tiles.forEach(addTileElement);
  board.appendChild(svg);
  layout();
  updateHud();
  showBanner(level.slide ? `${T.level.replace('{n}', index + 1)} ${T.slides[level.slide]}` : T.level.replace('{n}', index + 1));
}

function addTileElement(t) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'tile';
  const img = document.createElement('img');
  img.alt = '';
  img.draggable = false;
  img.src = `img/tiles/${t.kind}.webp${ASSET_V}`;
  el.appendChild(img);
  el.addEventListener('click', () => pick(t));
  t.el = el;
  board.appendChild(el);
}

// 算出牌要多大才放得下，再把每張牌擺上去
let tileW = 50;
let tileH = 60;
let originX = 0;
let originY = 0;
// 格子中心的位置。線繞到牌陣外時，只超出外圈留白的範圍，不會跑出畫面
const lineX = (c) => Math.max(originX - tileW * RING * 0.6, Math.min(originX + (G.size.cols + RING * 0.6) * tileW, originX + (c + 0.5) * tileW));
const lineY = (r) => Math.max(originY - tileH * RING * 0.6, Math.min(originY + (G.size.rows + RING * 0.6) * tileH, originY + (r + 0.5) * tileH));

function layout() {
  if (!G) return;
  const box = board.getBoundingClientRect();
  if (!box.width) return;
  const { cols, rows } = G.size;
  tileW = Math.min(72, box.width / (cols + RING * 2), box.height / ((rows + RING * 2) * ASPECT));
  tileH = tileW * ASPECT;
  originX = (box.width - cols * tileW) / 2;
  originY = (box.height - rows * tileH) / 2;
  board.style.setProperty('--tile-w', `${tileW}px`);
  board.style.setProperty('--tile-h', `${tileH}px`);
  for (const t of G.tiles) {
    t.el.style.left = `${originX + t.c * tileW}px`;
    t.el.style.top = `${originY + t.r * tileH}px`;
  }
}
window.addEventListener('resize', layout);

// ---------- 點牌 ----------

function pick(t) {
  if (!G || G.ended || G.paused || !G.tiles.includes(t)) return;
  clearHint();
  const first = G.selected;
  if (first === t) {
    t.el.classList.remove('selected');
    G.selected = null;
    return;
  }
  if (!first) {
    G.selected = t;
    t.el.classList.add('selected');
    engine.stick(engine.now(), 0.1);
    return;
  }
  first.el.classList.remove('selected');
  if (first.kind !== t.kind) {
    // 不一樣就改選新的這張，不扣分
    G.selected = t;
    t.el.classList.add('selected');
    engine.stick(engine.now(), 0.1);
    return;
  }
  const path = findPath(first, t, occupied(G.tiles), G.size);
  if (!path) {
    // 一樣但連不起來：兩張都抖一下，改選新的這張
    restart(first.el, 'nope');
    restart(t.el, 'nope');
    G.timeLeft -= NO_PATH_SECS;
    showFloat(t, `${T.noPath} -${NO_PATH_SECS}s`);
    engine.stick(engine.now(), 0.06);
    G.selected = t;
    t.el.classList.add('selected');
    return;
  }
  G.selected = null;
  match(first, t, path);
}

function match(a, b, path) {
  const now = performance.now() / 1000;
  G.combo = now - G.lastMatch <= COMBO_SECS ? G.combo + 1 : 0;
  G.lastMatch = now;
  const gained = 100 + Math.min(G.combo, 10) * 20;
  G.score += gained;
  const t = engine.now();
  const m = SCALE[Math.min(G.combo, SCALE.length - 1)];
  engine.keys(t, [m, m + 4, m + 7], 0.12, 0.24); // 電鋼琴和弦
  if (G.combo >= 2) showFloat(b, `${T.comboWord} ×${G.combo + 1}`);
  drawLine(path);
  [a, b].forEach((x) => {
    x.el.classList.add('gone');
    setTimeout(() => x.el.remove(), LINE_MS);
  });
  G.tiles = G.tiles.filter((x) => x !== a && x !== b);
  if (G.level.slide && slideTiles(G.tiles, G.level.slide, G.slots)) layout();
  updateHud();
  if (!G.tiles.length) {
    endLevel(true);
    return;
  }
  checkStuck();
}

function drawLine(path) {
  const line = document.createElementNS(SVG_NS, 'polyline');
  line.setAttribute('points', path.map((p) => `${lineX(p.c)},${lineY(p.r)}`).join(' '));
  svg.appendChild(line);
  setTimeout(() => line.remove(), LINE_MS);
}

function showFloat(t, text) {
  const el = document.createElement('div');
  el.className = 'float';
  el.textContent = text;
  el.style.left = t.el.style.left;
  el.style.top = t.el.style.top;
  board.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

// 場上沒有能消的牌：還有洗牌就提醒；沒有就自動洗牌並扣時間，不會因為運氣不好直接輸
function checkStuck() {
  if (findPair(G.tiles, G.size)) return;
  if (G.shuffles > 0) {
    showBanner(T.noMoves);
    restart($('btn-shuffle'), 'pulse');
    return;
  }
  G.timeLeft -= STUCK_SECS;
  showBanner(`${T.autoShuffle} -${STUCK_SECS}s`);
  redeal();
}

// ---------- 提示與洗牌 ----------

function clearHint() {
  if (!G.hinted) return;
  G.hinted.forEach((t) => t.el.classList.remove('hint'));
  G.hinted = null;
}

function useHint() {
  if (!G || G.ended || G.paused || G.hints <= 0) return;
  const pair = findPair(G.tiles, G.size);
  if (!pair) {
    checkStuck();
    return;
  }
  clearHint();
  G.hints--;
  G.hinted = pair;
  pair.forEach((t) => t.el.classList.add('hint'));
  engine.bell(engine.now(), 76, 0.12);
  updateHud();
}

function useShuffle() {
  if (!G || G.ended || G.paused || G.shuffles <= 0) return;
  clearHint();
  if (G.selected) {
    G.selected.el.classList.remove('selected');
    G.selected = null;
  }
  G.shuffles--;
  redeal();
}

function redeal() {
  reshuffle(G.tiles, G.size);
  G.tiles.forEach((t) => G.slots.add(`${t.c},${t.r}`)); // 少數情況洗牌會把牌排到圖形外
  for (const t of G.tiles) {
    t.el.querySelector('img').src = `img/tiles/${t.kind}.webp${ASSET_V}`;
    restart(t.el, 'dealt');
  }
  layout();
  updateHud();
  engine.washboard(engine.now(), 0.5);
}

// ---------- 結束 ----------

function endLevel(won, reason) {
  G.ended = true;
  const run = G;
  const now = engine.now();
  if (!won) {
    engine.sour(now, 0.2);
    setTimeout(() => G === run && showPanel(reason || T.timeUp), 500);
    return;
  }
  G.score += Math.ceil(G.timeLeft) * 10 + (G.index + 1) * 100; // 剩越多時間，加分越多
  updateHud();
  engine.applause(now + 0.1, 90);
  showBanner(T.clear.replace('{n}', G.index + 1));
  if (G.index === LEVELS.length - 1) {
    G.allClear = true;
    setTimeout(() => G === run && showPanel(T.winAll), 1200);
  } else {
    setTimeout(() => G === run && startLevel(G.index + 1, G.score), NEXT_LEVEL_DELAY);
  }
}

// 只有輸了或全破才跳出面板；過關直接進下一關
function showPanel(title) {
  const isNew = saveBest();
  $('end-title').textContent = title;
  $('end-score').textContent = G.score.toLocaleString();
  $('end-newbest').classList.toggle('show', isNew);
  $('btn-retry').textContent = G.allClear ? T.again : T.retry;
  $('overlay-end').classList.add('show');
}

// ---------- 計時 ----------

let lastFrame = performance.now();

function frame() {
  requestAnimationFrame(frame);
  const nowMs = performance.now();
  const dt = Math.min(0.1, (nowMs - lastFrame) / 1000); // 有上限，切走再回來不會一次扣很多
  lastFrame = nowMs;
  if (!G || G.ended || G.paused) return;
  G.timeLeft -= dt;
  const sec = Math.ceil(G.timeLeft);
  if (sec >= 1 && sec <= WARN_SECS && sec !== G.tick) {
    G.tick = sec;
    engine.stick(engine.now(), 0.16);
  }
  updateClock();
  if (G.timeLeft <= 0) endLevel(false);
}
requestAnimationFrame(frame);

applyLang();

if (new URLSearchParams(location.search).has('debug')) {
  window.__tiles = () => ({ G, pick, findPair: () => findPair(G.tiles, G.size), noPathPair: () => {
    const blocked = occupied(G.tiles);
    for (const a of G.tiles) for (const b of G.tiles) if (a !== b && a.kind === b.kind && !findPath(a, b, blocked, G.size)) return [a, b];
    return null;
  }, start: startLevel, best: () => best, checkStuck });
}
