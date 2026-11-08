import { AudioEngine } from './audio.js';
import { COLORS, drawBubble } from './icons.js';
import { BUBBLE, STRINGS, detectLang } from './i18n.js';

const COLS = 9; // 單數列少一顆，往右錯開半顆
const TYPES = ['guitar', 'whistle', 'washboard', 'scat', 'note', 'mic']; // 每關用前幾種由 types 決定：第 5 關起有音符，第 8 關起有麥克風

// 泡泡的圖片（img/bubbles/*.webp）。圖還沒載好之前先用程式畫的泡泡，載好後重畫一次
const BUBBLE_IMGS = {};
let imgsLeft = TYPES.length;
for (const type of TYPES) {
  const img = new Image();
  img.onload = img.onerror = () => {
    if (--imgsLeft > 0) return;
    renderLegend();
    resize();
  };
  img.src = `img/bubbles/${type}.webp`;
  BUBBLE_IMGS[type] = img;
}

function paintBubble(c, type, r) {
  const img = BUBBLE_IMGS[type];
  if (img && img.complete && img.naturalWidth) {
    c.imageSmoothingQuality = 'high';
    c.drawImage(img, -r, -r, r * 2, r * 2);
  } else {
    drawBubble(c, type, r);
  }
}
const SHOT_SPEED = 1050; // 泡泡飛行速度（每秒幾個像素）
const HIT_DIST = 1.72; // 飛行中碰到別顆的距離（半徑的幾倍），比 2 小一點才鑽得進空隙
const MAX_AIM = 1.36; // 最多往左右瞄幾弧度，太平的角度打不到東西
const DEAD_ROWS = 12; // 不管手機大小，都是 12 排高；泡泡超過底線就輸了
const WARN_SECS = 3; // 下壓前幾秒，泡泡開始抖動、發出滴答聲
const FIRST_GRACE = 1; // 每關開頭多給幾秒，看清楚再開始
const SFX_GAIN = 0.55;
const SCALE_PCS = [0, 2, 4, 7, 9]; // 破掉時走的音階（C 大調五聲音階）
const NEXT_LEVEL_DELAY = 1500; // 過關後等幾毫秒，直接進下一關

// 關卡：# 是泡泡的位置，雙數列 9 格、單數列 8 格。每關的形狀都跟音樂有關。
// types 是這關用幾種樂器，seed 決定顏色怎麼分布，mix 越小顏色越分散、越難一次打很多，
// secs 是每隔幾秒天花板往下壓一排。形狀不要有只靠一兩顆撐住的細脖子，不然一發就掉光。
const LEVELS = [
  { // 第一關：四排
    types: 4, seed: 12, mix: 0.3, secs: 14,
    map: ['#########', '########', '#########', '########'],
  },
  { // 第二關：♫
    types: 4, seed: 7, mix: 0.25, secs: 13,
    map: ['#########', '########', '.##...##.', '.##..##.', '.##...##.', '###.###.', '###.###..'],
  },
  { // 第三關：愛心
    types: 4, seed: 41, mix: 0.2, secs: 12,
    map: ['.###.###.', '########', '#########', '.######.', '..#####..', '..####..', '...###...', '...##...'],
  },
  { // 第四關：吉他
    types: 4, seed: 23, mix: 0.2, secs: 11,
    map: ['..#####..', '..####..', '...###...', '...##...', '...###...', '..####..', '.#######.', '.######.', '.#######.'],
  },
  { // 第五關：舞台拱門
    types: 5, seed: 58, mix: 0.25, secs: 10,
    map: ['#########', '########', '#########', '###..###', '###...###', '##....##', '##.....##'],
  },
  { // 第六關：麥克風
    types: 5, seed: 78, mix: 0.2, secs: 9,
    map: ['..#####..', '.######.', '.#######.', '.######.', '..#####..', '..####..', '...###...', '..####..', '...###...'],
  },
  { // 第七關：鋼琴鍵盤，一根一根垂下來
    types: 5, seed: 91, mix: 0.2, secs: 8,
    map: ['#########', '########', '#.#.#.#.#', '#.#.#.##', '#.#.#.#.#', '#.#.#.##', '#.#.#.#.#'],
  },
  { // 第八關：洗衣板，一排一排的波紋，靠兩邊的框撐著
    types: 6, seed: 104, mix: 0.2, secs: 8,
    map: ['#########', '##....##', '#########', '##....##', '#########', '##....##', '#########'],
  },
  { // 第九關：星星
    types: 6, seed: 66, mix: 0.15, secs: 7,
    map: ['..#####..', '..####..', '...###...', '########', '.#######.', '.######.', '..#####..', '.######.', '.###.###.'],
  },
  { // 第十關：安可！滿滿一面牆
    types: 6, seed: 131, mix: 0.1, secs: 6,
    map: ['#########', '########', '#########', '########', '#########', '########', '#########', '########'],
  },
];

const $ = (id) => document.getElementById(id);
const stage = $('stage');
const canvas = $('canvas');
const g2d = canvas.getContext('2d');
const shooter = $('shooter');

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
let T = { ...STRINGS[lang], ...BUBBLE[lang] };
let best = Number(load('ponpon-bubble-best')) || 0;

let engine = null;
let G = null; // 這一局的狀態
let W = 0;
let H = 0;
let R = 20; // 泡泡半徑
let dpr = 1;
let top = 60; // 天花板原本的位置
let left = 0; // 場地左邊界；寬螢幕或矮螢幕時，場地會置中，左右留空
let launcher = { x: 0, y: 0 };
let nextPos = { x: 0, y: 0 };
let deadY = 0; // 泡泡堆到這條線就輸了
const sprites = {};

// 破掉時的聲音：一串往上走的音，破越多顆就走得越高
function scaleNotes() {
  const out = [];
  for (let m = 58; m <= 90; m++) if (SCALE_PCS.includes(m % 12)) out.push(m);
  return out;
}

function popSound(type, step, t) {
  const notes = scaleNotes();
  const m = notes[Math.min(step + 2, notes.length - 1)];
  if (type === 'guitar') engine.guitar(t, m - 12, 0.5);
  else if (type === 'whistle') engine.whistle(t, m, 0.9);
  else if (type === 'washboard') engine.washboard(t, 0.7);
  else if (type === 'scat') engine.bell(t, m, 0.18);
  else if (type === 'mic') engine.bell(t, m - 12, 0.22);
  else engine.bell(t, m + 12, 0.2);
}

// ---------- 介面 ----------

function applyLang() {
  T = { ...STRINGS[lang], ...BUBBLE[lang] };
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = T[el.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-label]').forEach((el) => {
    el.setAttribute('aria-label', T[el.dataset.i18nLabel]);
  });
  document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
  renderLegend();
  renderBest();
  $('back-to-site').href = lang === 'zh' ? '/games' : `/${lang}/games`;
  if (G) updateHud();
}

// 首頁的圖示說明：每種泡泡代表什麼
function renderLegend() {
  const box = $('legend');
  box.textContent = '';
  for (const type of TYPES) {
    const item = document.createElement('div');
    const c = document.createElement('canvas');
    c.width = 120;
    c.height = 120;
    const x = c.getContext('2d');
    x.translate(60, 60);
    paintBubble(x, type, 58);
    const label = document.createElement('span');
    label.textContent = T[type];
    item.append(c, label);
    box.appendChild(item);
  }
}

function renderBest() {
  $('title-best').textContent = best ? `${T.best} ${best.toLocaleString()}` : '';
}

function show(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
}

function toTitle() {
  G = null;
  $('overlay-end').classList.remove('show');
  $('overlay-pause').classList.remove('show');
  renderBest();
  show('screen-title');
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
// 全破就從第一關重來；輸了就重打這一關，分數回到這關開始時
$('btn-retry').addEventListener('click', () => (G.allClear ? startLevel(0, 0) : startLevel(G.index, G.startScore)));

// 暫停：天花板的計時和飛行中的泡泡都停住，也不接受瞄準和發射
function pauseGame() {
  if (!G || G.ended || G.paused) return;
  G.paused = true;
  G.keyDir = 0;
  G.aim = null;
  G.trace = null;
  touchOn = null;
  $('overlay-pause').classList.add('show');
}

function resumeGame() {
  if (!G || !G.paused) return;
  G.paused = false;
  $('overlay-pause').classList.remove('show');
}

// 結束遊戲：這局的分數也算進最高分，然後回到遊戲首頁
function quitGame() {
  saveBest();
  toTitle();
}

function saveBest() {
  const isNew = G.score > best;
  if (isNew) {
    best = G.score;
    save('ponpon-bubble-best', String(best));
  }
  return isNew;
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseGame(); // 切到別的分頁或接電話時自動暫停
});

function updateHud() {
  $('level-label').textContent = T.level.replace('{n}', G.index + 1);
  $('score-label').textContent = G.score.toLocaleString();
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

// ---------- 版面 ----------

function resize() {
  const r = stage.getBoundingClientRect();
  if (!r.width) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = r.width;
  H = r.height;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const safe = parseFloat(getComputedStyle($('screen-game').querySelector('.bar')).paddingTop) || 8;
  top = safe + 52;
  R = Math.min(W / (COLS * 2), (H - top - 128) / (1.732 * DEAD_ROWS + 2));
  left = (W - R * COLS * 2) / 2;
  launcher = { x: W / 2, y: H - Math.max(66, R * 3.3) };
  nextPos = { x: W / 2 - R * 3.6, y: launcher.y + R * 0.7 };
  // 公仔站在發射台右邊的地板上，比例照場地大小
  const shooterH = R * 6.2;
  shooter.style.height = `${shooterH}px`;
  shooter.style.left = `${W / 2 + R * 2.1}px`;
  shooter.style.bottom = `calc(10px + env(safe-area-inset-bottom))`;
  deadY = top + 2 * R + (DEAD_ROWS - 1) * rowH() + 1;
  for (const type of TYPES) {
    const s = document.createElement('canvas');
    const size = Math.ceil(R * 2 * dpr) + 2;
    s.width = size;
    s.height = size;
    const c = s.getContext('2d');
    c.translate(size / 2, size / 2);
    c.scale(dpr, dpr);
    paintBubble(c, type, R - 0.5);
    sprites[type] = { canvas: s, size: size / dpr };
  }
}
window.addEventListener('resize', resize);

const rowLen = (row) => (row % 2 === 0 ? COLS : COLS - 1);
const cellX = (row, col) => left + R + col * 2 * R + (row % 2 === 0 ? 0 : R);
const rowH = () => R * 1.732;
const ceilingY = () => top + G.drop * rowH(); // 天花板現在的位置
const cellY = (row) => ceilingY() + R + row * rowH();

function neighbors(row, col) {
  const odd = row % 2 === 1;
  const list = [
    [row, col - 1],
    [row, col + 1],
    [row - 1, odd ? col : col - 1],
    [row - 1, odd ? col + 1 : col],
    [row + 1, odd ? col : col - 1],
    [row + 1, odd ? col + 1 : col],
  ];
  return list.filter(([r, c]) => r >= 0 && c >= 0 && c < rowLen(r));
}

const getCell = (row, col) => (G.cells[row] ? G.cells[row][col] : null) || null;
function setCell(row, col, v) {
  while (G.cells.length <= row) G.cells.push(new Array(rowLen(G.cells.length)).fill(null));
  G.cells[row][col] = v;
}
function forEachBubble(fn) {
  G.cells.forEach((cells, row) => cells.forEach((type, col) => type && fn(row, col, type)));
}

// ---------- 關卡 ----------

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 依形狀填顏色：常常跟旁邊同色，才會有一團一團可以打
function buildCells(level) {
  const rnd = mulberry32(level.seed);
  const types = TYPES.slice(0, level.types);
  const cells = level.map.map((line, row) => new Array(rowLen(row)).fill(null).map((_, c) => (line[c] === '#' ? 'x' : null)));
  const saved = G.cells;
  G.cells = cells;
  forEachBubble((row, col) => {
    const near = neighbors(row, col).map(([r, c]) => getCell(r, c)).filter((t) => t && t !== 'x');
    cells[row][col] = near.length && rnd() < (level.mix ?? 0.45) ? near[Math.floor(rnd() * near.length)] : types[Math.floor(rnd() * types.length)];
  });
  G.cells = saved;
  return cells;
}

function pickType() {
  // 只發場上還有的樂器，才不會拿到打不掉的；每種機率一樣，不會剛好都給你需要的
  const has = new Set();
  forEachBubble((_, __, type) => has.add(type));
  const list = [...has];
  return list.length ? list[Math.floor(Math.random() * list.length)] : TYPES[0];
}

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

  $('overlay-end').classList.remove('show');
  $('overlay-pause').classList.remove('show');
  shooter.classList.remove('sad', 'cheer', 'happy', 'strum');
  show('screen-game');
  resize();
  const level = LEVELS[index];
  G = {
    index,
    level,
    cells: [],
    cur: null,
    next: null,
    used: 0, // 這關發射了幾次
    dropTimer: level.secs + FIRST_GRACE, // 再過幾秒下壓
    tick: 0, // 上一次滴答聲是倒數第幾秒
    drop: 0, // 天花板已經往下壓了幾排
    dropAnim: 0, // 下壓動畫剩下的位移（像素）
    lastAim: 0, // 箭頭的角度
    keyDir: 0,
    keyboard: false,
    paused: false,
    startScore: score,
    score,
    allClear: false,
    shot: null,
    aim: null,
    aimDirty: false,
    trace: null,
    falling: [],
    fx: [],
    ended: false,
  };
  G.cells = buildCells(level);
  G.cur = pickType();
  G.next = pickType();
  updateHud();
  showBanner(T.level.replace('{n}', index + 1));
}

// ---------- 瞄準與飛行路線 ----------

// 從發射台往某個角度飛，沿路彈牆，算出整條路線和最後停在哪一格
function trace(angle) {
  const pts = [{ x: launcher.x, y: launcher.y }];
  let x = launcher.x;
  let y = launcher.y;
  let dx = Math.sin(angle);
  const dy = -Math.cos(angle);
  const step = R * 0.22;
  const minX = left + R;
  const maxX = left + R * (COLS * 2 - 1);
  const occupied = [];
  forEachBubble((row, col) => occupied.push({ x: cellX(row, col), y: cellY(row) }));
  const hit2 = (R * HIT_DIST) ** 2;
  for (let i = 0; i < 4000; i++) {
    x += dx * step;
    y += dy * step;
    if (x < minX || x > maxX) {
      x = x < minX ? 2 * minX - x : 2 * maxX - x;
      dx = -dx;
      pts.push({ x, y });
    }
    if (y <= ceilingY() + R) break;
    if (occupied.some((o) => (o.x - x) ** 2 + (o.y - y) ** 2 < hit2)) break;
  }
  const slot = findSlot(x, y);
  pts.push({ x: cellX(slot.row, slot.col), y: cellY(slot.row) });
  return { pts, slot };
}

// 找停下來的格子：離得最近、沒有泡泡、而且黏得住（第一列，或旁邊有泡泡）的那格
function findSlot(x, y) {
  const guess = Math.round((y - ceilingY() - R) / rowH());
  let best = null;
  let bestD = Infinity;
  for (let row = Math.max(0, guess - 2); row <= guess + 2; row++) {
    for (let col = 0; col < rowLen(row); col++) {
      if (getCell(row, col)) continue;
      if (row > 0 && !neighbors(row, col).some(([r, c]) => getCell(r, c))) continue;
      const d = (cellX(row, col) - x) ** 2 + (cellY(row) - y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = { row, col };
      }
    }
  }
  return best || { row: 0, col: Math.max(0, Math.min(COLS - 1, Math.round((x - left - R) / (2 * R)))) };
}

function aimFrom(px, py) {
  const dx = px - launcher.x;
  const dy = launcher.y - py;
  if (dy < R * 0.6) return null; // 手指在發射台下面就是取消
  return Math.max(-MAX_AIM, Math.min(MAX_AIM, Math.atan2(dx, dy)));
}

function fire(angle) {
  if (!G || G.ended || G.paused || G.shot) return;
  G.lastAim = angle;
  const path = trace(angle);
  let len = 0;
  for (let i = 1; i < path.pts.length; i++) len += Math.hypot(path.pts[i].x - path.pts[i - 1].x, path.pts[i].y - path.pts[i - 1].y);
  G.shot = { type: G.cur, pts: path.pts, slot: path.slot, len, s: 0 };
  G.used++;
  G.cur = G.next;
  G.next = pickType();
  G.aim = null;
  G.trace = null;
  engine.stick(engine.now(), 0.1);
  restart(shooter, 'strum');
}

function swapBubbles() {
  if (!G || G.ended || G.paused) return;
  [G.cur, G.next] = [G.next, G.cur];
  engine.stick(engine.now(), 0.08);
}

function pointerPos(e) {
  const r = canvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function setAim(a) {
  G.aim = a;
  G.aimDirty = true;
  if (a !== null) G.lastAim = a;
}

let touchOn = null; // 'swap' 或 'aim'

canvas.addEventListener('pointerdown', (e) => {
  if (!G || G.ended || G.paused) return;
  e.preventDefault();
  const p = pointerPos(e);
  try {
    canvas.setPointerCapture(e.pointerId);
  } catch {}
  const onCur = Math.hypot(p.x - launcher.x, p.y - launcher.y) < R * 1.6;
  const onNext = Math.hypot(p.x - nextPos.x, p.y - nextPos.y) < R * 1.5;
  if (onCur || onNext) {
    touchOn = 'swap';
    return;
  }
  touchOn = 'aim';
  setAim(aimFrom(p.x, p.y));
});
canvas.addEventListener('pointermove', (e) => {
  if (!G || touchOn !== 'aim') return;
  const p = pointerPos(e);
  setAim(aimFrom(p.x, p.y));
});
canvas.addEventListener('pointerup', (e) => {
  if (!G) return;
  const what = touchOn;
  touchOn = null;
  if (what === 'swap') {
    swapBubbles();
    return;
  }
  if (what !== 'aim') return;
  const p = pointerPos(e);
  const a = aimFrom(p.x, p.y);
  G.aim = null;
  G.trace = null;
  if (a !== null) fire(a);
});
canvas.addEventListener('pointercancel', () => {
  touchOn = null;
  if (G) {
    G.aim = null;
    G.trace = null;
  }
});

// 電腦：左右鍵轉箭頭，空白鍵發射，上鍵交換
document.addEventListener('keydown', (e) => {
  if (!G || G.ended || !$('screen-game').classList.contains('active')) return;
  if (e.code === 'Escape') {
    if (G.paused) resumeGame();
    else pauseGame();
    return;
  }
  if (G.paused) return;
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    e.preventDefault();
    G.keyboard = true;
    G.keyDir = e.code === 'ArrowLeft' ? -1 : 1;
    setAim(G.lastAim);
  } else if (e.code === 'Space') {
    e.preventDefault();
    if (e.repeat) return;
    G.keyboard = true;
    fire(G.lastAim);
  } else if (e.code === 'ArrowUp') {
    e.preventDefault();
    if (!e.repeat) swapBubbles();
  }
});
document.addEventListener('keyup', (e) => {
  if (G && (e.code === 'ArrowLeft' || e.code === 'ArrowRight')) G.keyDir = 0;
});

// ---------- 打中之後 ----------

function sameCluster(row, col, type) {
  const seen = new Set([`${row},${col}`]);
  const out = [[row, col]];
  for (let i = 0; i < out.length; i++) {
    for (const [r, c] of neighbors(out[i][0], out[i][1])) {
      const key = `${r},${c}`;
      if (!seen.has(key) && getCell(r, c) === type) {
        seen.add(key);
        out.push([r, c]);
      }
    }
  }
  return out;
}

// 沒有連到最上面的泡泡會掉下來
function looseBubbles() {
  const seen = new Set();
  const queue = [];
  (G.cells[0] || []).forEach((type, col) => {
    if (type) {
      seen.add(`0,${col}`);
      queue.push([0, col]);
    }
  });
  for (let i = 0; i < queue.length; i++) {
    for (const [r, c] of neighbors(queue[i][0], queue[i][1])) {
      const key = `${r},${c}`;
      if (!seen.has(key) && getCell(r, c)) {
        seen.add(key);
        queue.push([r, c]);
      }
    }
  }
  const loose = [];
  forEachBubble((row, col, type) => {
    if (!seen.has(`${row},${col}`)) loose.push([row, col, type]);
  });
  return loose;
}

function burst(x, y, color, t, delay) {
  G.fx.push({ kind: 'ring', x, y, born: t + delay, life: 0.28, color });
  for (let i = 0; i < 7; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = (0.5 + Math.random()) * R * 7;
    G.fx.push({ kind: 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - R * 3, born: t + delay, life: 0.35 + Math.random() * 0.25, color, size: R * (0.08 + Math.random() * 0.1) });
  }
}

function place(shot) {
  const { row, col } = shot.slot;
  setCell(row, col, shot.type);
  const now = performance.now() / 1000;
  const audioNow = engine.now();
  const cluster = sameCluster(row, col, shot.type);
  if (cluster.length >= 3) {
    let gained = 0;
    cluster.forEach(([r, c], i) => {
      const x = cellX(r, c);
      const y = cellY(r);
      setCell(r, c, null);
      gained += 10;
      const delay = i * 0.045;
      burst(x, y, COLORS[shot.type], now, delay);
      if (i < 10) popSound(shot.type, i, audioNow + delay);
    });
    const loose = looseBubbles();
    loose.forEach(([r, c, type]) => {
      setCell(r, c, null);
      gained += 20;
      G.falling.push({ type, x: cellX(r, c), y: cellY(r), vx: (Math.random() - 0.5) * R * 6, vy: -R * (3 + Math.random() * 5), born: now });
    });
    if (loose.length) popSound('note', Math.min(cluster.length + 1, 12), audioNow + cluster.length * 0.045);
    G.score += gained;
    G.fx.push({ kind: 'text', x: cellX(row, col), y: cellY(row), born: now, life: 0.8, text: `+${gained}` });
    if (cluster.length + loose.length >= 6) showBanner(T.cheers[Math.floor(Math.random() * T.cheers.length)]);
    shooter.classList.remove('strum');
    restart(shooter, 'happy');
    trimRows();
  } else {
    engine.stick(audioNow, 0.14);
  }
  updateHud();
  checkEnd();
  // 場上沒有這種樂器了，換成還有的，才不會拿到打不掉的
  if (!G.ended) {
    const has = new Set();
    forEachBubble((_, __, t) => has.add(t));
    if (!has.has(G.cur)) G.cur = pickType();
    if (!has.has(G.next)) G.next = pickType();
  }
}

function lowerCeiling() {
  G.drop++;
  G.dropTimer = G.level.secs;
  G.tick = 0;
  G.dropAnim = rowH();
  G.aimDirty = true; // 泡泡的位置變了，瞄準線要重算
  engine.kick(engine.now(), 0.6);
  showBanner(T.dropped);
  checkEnd();
}

function trimRows() {
  while (G.cells.length && G.cells[G.cells.length - 1].every((t) => !t)) G.cells.pop();
}

function checkEnd() {
  let count = 0;
  let lowest = 0;
  forEachBubble((row) => {
    count++;
    lowest = Math.max(lowest, row);
  });
  if (count === 0) endLevel(true);
  else if (lowest + G.drop >= DEAD_ROWS) endLevel(false);
}

function endLevel(won) {
  G.ended = true;
  G.aim = null;
  G.trace = null;
  G.keyDir = 0;
  const run = G;
  const now = engine.now();
  if (!won) {
    engine.sour(now, 0.2);
    shooter.classList.add('sad');
    updateHud();
    setTimeout(() => G === run && showPanel(false), 650);
    return;
  }
  G.score += (G.index + 1) * 100; // 越後面的關卡，過關加分越多
  updateHud();
  engine.applause(now + 0.2, 90);
  shooter.classList.remove('strum', 'happy');
  restart(shooter, 'cheer');
  // 彩帶
  const t = performance.now() / 1000;
  for (let i = 0; i < 60; i++) {
    const type = TYPES[i % TYPES.length];
    G.fx.push({ kind: 'dot', x: Math.random() * W, y: -10 - Math.random() * 40, vx: (Math.random() - 0.5) * R * 3, vy: Math.random() * R * 6, born: t + Math.random() * 0.6, life: 1.3, color: COLORS[type], size: R * (0.12 + Math.random() * 0.12) });
  }
  showBanner(T.clear.replace('{n}', G.index + 1));
  if (G.index === LEVELS.length - 1) {
    G.allClear = true;
    setTimeout(() => G === run && showPanel(true), 1200);
  } else {
    setTimeout(() => G === run && startLevel(G.index + 1, G.score), NEXT_LEVEL_DELAY);
  }
}

// 只有輸了或全破才跳出面板；過關直接進下一關
function showPanel(cleared) {
  const isNew = saveBest();
  $('end-title').textContent = cleared ? T.winAll : T.lose;
  $('end-score').textContent = G.score.toLocaleString();
  $('end-newbest').classList.toggle('show', isNew);
  $('btn-retry').textContent = cleared ? T.again : T.retry;
  $('overlay-end').classList.add('show');
}

// ---------- 每一格畫面 ----------

let lastFrame = performance.now();

function frame() {
  requestAnimationFrame(frame);
  const nowMs = performance.now();
  const dt = Math.min(0.05, (nowMs - lastFrame) / 1000);
  lastFrame = nowMs;
  if (!G) return;
  update(dt);
  draw(nowMs / 1000);
}

function update(dt) {
  if (G.paused) return;
  if (G.keyDir) {
    setAim(Math.max(-MAX_AIM, Math.min(MAX_AIM, G.lastAim + G.keyDir * 1.3 * dt)));
  } else if (G.keyboard && G.aim === null && !G.shot && !G.ended) {
    setAim(G.lastAim); // 用鍵盤玩時，瞄準線一直開著
  }
  if (G.dropAnim > 0) G.dropAnim = Math.max(0, G.dropAnim - rowH() * dt * 6);
  if (!G.ended) {
    G.dropTimer -= dt; // dt 有上限，切到別的分頁再回來時不會一次扣很多
    const secLeft = Math.ceil(G.dropTimer);
    if (secLeft >= 1 && secLeft <= WARN_SECS && secLeft !== G.tick) {
      G.tick = secLeft;
      engine.stick(engine.now(), 0.2);
    }
    // 泡泡飛行中先不壓，等它停好，路線才不會對不上
    if (G.dropTimer <= 0 && !G.shot) lowerCeiling();
  }
  if (G.aimDirty) {
    G.aimDirty = false;
    G.trace = G.aim === null || G.shot ? null : trace(G.aim);
  }
  if (G.shot) {
    G.shot.s += SHOT_SPEED * dt;
    if (G.shot.s >= G.shot.len) {
      const shot = G.shot;
      G.shot = null;
      place(shot);
    }
  }
  for (const f of G.falling) {
    f.vy += R * 60 * dt;
    f.x += f.vx * dt;
    f.y += f.vy * dt;
  }
  G.falling = G.falling.filter((f) => f.y < H + R * 2);
}

function pointOnPath(pts, s) {
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (s <= seg) {
      const u = seg ? s / seg : 1;
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * u, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * u };
    }
    s -= seg;
  }
  return pts[pts.length - 1];
}

function drawBubbleAt(type, x, y, scale = 1) {
  const s = sprites[type];
  const size = s.size * scale;
  g2d.drawImage(s.canvas, x - size / 2, y - size / 2, size, size);
}

function draw(t) {
  g2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  g2d.clearRect(0, 0, W, H);

  // 場地兩邊的牆（場地比螢幕窄的時候才看得到）
  const right = left + R * COLS * 2;
  if (left > 1) {
    g2d.fillStyle = 'rgba(6, 5, 4, 0.72)';
    g2d.fillRect(0, 0, left, H);
    g2d.fillRect(right, 0, W - right, H);
    g2d.strokeStyle = 'rgba(232, 207, 166, 0.35)';
    g2d.lineWidth = 1;
    g2d.beginPath();
    g2d.moveTo(left, top);
    g2d.lineTo(left, H);
    g2d.moveTo(right, top);
    g2d.lineTo(right, H);
    g2d.stroke();
  }

  // 天花板：往下壓的部分畫成一片金色舞台布幕
  const ceil = ceilingY() - G.dropAnim;
  g2d.fillStyle = '#2a1c0c';
  g2d.fillRect(left, 0, right - left, ceil);
  if (ceil > top + 1) {
    g2d.strokeStyle = 'rgba(232, 207, 166, 0.16)';
    g2d.lineWidth = 2;
    for (let x = left + R; x < right; x += R * 2) {
      g2d.beginPath();
      g2d.moveTo(x, top);
      g2d.lineTo(x, ceil);
      g2d.stroke();
    }
  }
  g2d.fillStyle = '#c5a059';
  g2d.fillRect(left, ceil - 2, right - left, 3);

  // 底線：泡泡超過這裡就輸了，快到的時候變紅
  let lowestRow = 0;
  forEachBubble((row) => {
    lowestRow = Math.max(lowestRow, row);
  });
  const danger = lowestRow + G.drop >= DEAD_ROWS - 2;
  g2d.strokeStyle = danger ? 'rgba(248, 113, 113, 0.85)' : 'rgba(232, 207, 166, 0.3)';
  g2d.setLineDash([6, 8]);
  g2d.lineWidth = danger ? 2 : 1;
  g2d.beginPath();
  g2d.moveTo(left, deadY);
  g2d.lineTo(right, deadY);
  g2d.stroke();
  g2d.setLineDash([]);

  // 快要下壓時，泡泡會抖動
  const wobble = !G.ended && G.dropTimer <= WARN_SECS ? (R * 0.11 * (WARN_SECS - Math.max(0, G.dropTimer))) / WARN_SECS + R * 0.02 : 0;
  forEachBubble((row, col, type) => {
    const shake = wobble ? Math.sin(t * 38 + row * 1.7 + col) * wobble : 0;
    drawBubbleAt(type, cellX(row, col) + shake, cellY(row) - G.dropAnim);
  });

  // 瞄準線：一串小點，飛到會停下來的地方再畫一個空心圓
  if (G.trace && !G.shot && !G.ended) {
    const color = COLORS[G.cur];
    const pts = G.trace.pts;
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    const gap = R * 1.05;
    const shift = (t * R * 3) % gap; // 小點慢慢往前流動，看得出方向
    g2d.fillStyle = color;
    for (let s = R * 1.4 + shift; s < len - R * 0.8; s += gap) {
      const p = pointOnPath(pts, s);
      g2d.beginPath();
      g2d.arc(p.x, p.y, R * 0.16, 0, Math.PI * 2);
      g2d.fill();
    }
    const end = pts[pts.length - 1];
    g2d.strokeStyle = color;
    g2d.lineWidth = 2;
    g2d.globalAlpha = 0.85;
    g2d.beginPath();
    g2d.arc(end.x, end.y, R - 1.5, 0, Math.PI * 2);
    g2d.stroke();
    g2d.globalAlpha = 1;
  }

  // 箭頭：一直指著現在瞄準的方向
  g2d.save();
  g2d.translate(launcher.x, launcher.y);
  g2d.rotate(G.lastAim);
  g2d.fillStyle = '#e8cfa6';
  g2d.beginPath();
  g2d.moveTo(0, -R * 2.5);
  g2d.lineTo(R * 0.42, -R * 1.45);
  g2d.lineTo(-R * 0.42, -R * 1.45);
  g2d.closePath();
  g2d.fill();
  g2d.restore();

  // 發射台
  g2d.strokeStyle = 'rgba(232, 207, 166, 0.6)';
  g2d.lineWidth = 2;
  g2d.beginPath();
  g2d.arc(launcher.x, launcher.y, R * 1.32, 0, Math.PI * 2);
  g2d.stroke();
  if (!G.ended) {
    if (G.cur) drawBubbleAt(G.cur, launcher.x, launcher.y);
    if (G.next) drawBubbleAt(G.next, nextPos.x, nextPos.y, 0.78);
  }
  g2d.textAlign = 'center';
  g2d.textBaseline = 'middle';

  if (G.shot) {
    const p = pointOnPath(G.shot.pts, G.shot.s);
    drawBubbleAt(G.shot.type, p.x, p.y);
  }
  for (const f of G.falling) drawBubbleAt(f.type, f.x, f.y);

  G.fx = G.fx.filter((f) => t - f.born < f.life);
  for (const f of G.fx) {
    const age = t - f.born;
    if (age < 0) continue;
    const k = age / f.life;
    g2d.globalAlpha = 1 - k;
    if (f.kind === 'dot') {
      g2d.fillStyle = f.color;
      g2d.beginPath();
      g2d.arc(f.x + f.vx * age, f.y + f.vy * age + 0.5 * R * 30 * age * age, f.size, 0, Math.PI * 2);
      g2d.fill();
    } else if (f.kind === 'ring') {
      g2d.strokeStyle = f.color;
      g2d.lineWidth = 2.5 * (1 - k) + 0.5;
      g2d.beginPath();
      g2d.arc(f.x, f.y, R * (0.7 + k), 0, Math.PI * 2);
      g2d.stroke();
    } else {
      g2d.fillStyle = '#fff3d6';
      g2d.font = `700 ${R * 1.05}px Georgia, serif`;
      g2d.fillText(f.text, f.x, f.y - k * R * 1.6);
    }
  }
  g2d.globalAlpha = 1;
}
requestAnimationFrame(frame);

applyLang();

if (new URLSearchParams(location.search).has('debug')) {
  // 測試用：不用手指，直接試算某個角度的結果
  window.__bubble = () => ({
    G,
    W,
    H,
    R,
    launcher,
    fire,
    trace,
    levels: LEVELS.length,
    preview(angle, type) {
      const { slot } = trace(angle);
      setCell(slot.row, slot.col, type);
      const cluster = sameCluster(slot.row, slot.col, type);
      let total = 0;
      if (cluster.length >= 3) {
        const back = cluster.map(([r, c]) => [r, c, getCell(r, c)]);
        back.forEach(([r, c]) => setCell(r, c, null));
        total = cluster.length + looseBubbles().length;
        back.forEach(([r, c, v]) => setCell(r, c, v));
      }
      setCell(slot.row, slot.col, null);
      return { total, row: slot.row, cluster: cluster.length };
    },
    start: startLevel,
    best: () => best,
  });
}
