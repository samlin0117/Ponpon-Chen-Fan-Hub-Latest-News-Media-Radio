// 公仔對對碰的規則（不碰畫面，可以單獨測試）。
// 座標用「半張牌」為單位：一張牌佔 x～x+2、y～y+2，所以牌可以錯開半張疊上去。

// 關卡：layers 由下往上，# 是牌，dx、dy 是這層往右、往下錯開幾個半張。
// kinds 是用幾種圖案，secs 是限時幾秒。每關的牌數一定要是雙數。
export const LEVELS = [
  { // 第一關：小舞台
    kinds: 6, secs: 45,
    layers: [
      { rows: ['#####', '#####', '#####', '#####'] },
      { rows: ['##', '##'], dx: 3, dy: 2 },
    ],
  },
  { // 第二關：愛心
    kinds: 8, secs: 70,
    layers: [
      { rows: ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'] },
      { rows: ['.......', '.##.##.', '.#####.', '..###..'] },
      { rows: ['.......', '.......', '...#...'] },
    ],
  },
  { // 第三關：吉他
    kinds: 10, secs: 80,
    layers: [
      { rows: ['...##..', '...##..', '...##..', '...##..', '..####.', '.######', '.######', '..####.'] },
      { rows: ['...##..', '...##..', '...##..', '...##..', '.......', '..####.', '..####.'] },
    ],
  },
  { // 第四關：音符
    kinds: 12, secs: 100,
    layers: [
      { rows: ['..#####', '..#####', '..#...#', '..#...#', '###.###', '###.###'] },
      { rows: ['..#####', '..#####', '.......', '.......', '###.###', '###.###'] },
      { rows: ['...##..', '.......', '.......', '.......', '.#...#.', '.#...#.'] },
    ],
  },
  { // 第五關：金字塔，每層都錯開半張，最難看清楚
    kinds: 12, secs: 150,
    layers: [
      { rows: ['#######', '#######', '#######', '#######', '#######', '#######'] },
      { rows: ['######', '######', '######', '######', '######'], dx: 1, dy: 1 },
      { rows: ['#####', '#####', '#####', '#####'], dx: 2, dy: 2 },
    ],
  },
];

// 把關卡展開成每張牌的位置
export function buildPositions(level) {
  const out = [];
  level.layers.forEach((layer, z) => {
    layer.rows.forEach((row, r) => {
      [...row].forEach((c, col) => {
        if (c === '#') out.push({ x: col * 2 + (layer.dx || 0), y: r * 2 + (layer.dy || 0), z });
      });
    });
  });
  return out;
}

const overlaps = (a, b) => Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2;

// 可以點的牌：上面沒有被壓住，而且左右至少一邊是空的
export function isFree(t, tiles) {
  let left = false;
  let right = false;
  for (const o of tiles) {
    if (o === t) continue;
    if (o.z > t.z && overlaps(o, t)) return false;
    if (o.z === t.z && Math.abs(o.y - t.y) < 2) {
      if (o.x === t.x - 2) left = true;
      if (o.x === t.x + 2) right = true;
    }
  }
  return !(left && right);
}

export function shuffled(list, rnd = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 發牌：照「玩一次」的順序，每次挑兩張當下能點的牌，配成同一種圖案。
// 這樣照那個順序消一定消得完，所以每局都解得開。挑不出來就回傳 false。
export function dealPairs(tiles, pairs, rnd = Math.random) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const rest = [...tiles];
    const order = shuffled(pairs, rnd);
    const assign = [];
    let ok = true;
    for (const kind of order) {
      const free = rest.filter((t) => isFree(t, rest));
      if (free.length < 2) {
        ok = false;
        break;
      }
      const [a, b] = shuffled(free, rnd);
      assign.push([a, kind], [b, kind]);
      rest.splice(rest.indexOf(a), 1);
      rest.splice(rest.indexOf(b), 1);
    }
    if (ok) {
      assign.forEach(([t, kind]) => {
        t.kind = kind;
      });
      return true;
    }
  }
  return false;
}

// 開局：每種圖案的張數盡量平均
export function dealLevel(tiles, kinds, rnd = Math.random) {
  if (tiles.length % 2) throw new Error('牌數要是雙數');
  const pairs = Array.from({ length: tiles.length / 2 }, (_, i) => kinds[i % kinds.length]);
  return dealPairs(tiles, pairs, rnd);
}

// 洗牌：把還在場上的牌重新配對。剩下的牌疊得解不開時（例如兩張疊在一起），就攤平重排
export function reshuffle(tiles, rnd = Math.random) {
  const counts = {};
  tiles.forEach((t) => {
    counts[t.kind] = (counts[t.kind] || 0) + 1;
  });
  const pairs = [];
  Object.entries(counts).forEach(([kind, n]) => {
    for (let i = 0; i < n / 2; i++) pairs.push(kind);
  });
  if (dealPairs(tiles, pairs, rnd)) return;
  const cols = Math.min(6, tiles.length);
  tiles.forEach((t, i) => {
    t.x = (i % cols) * 2;
    t.y = Math.floor(i / cols) * 2;
    t.z = 0;
  });
  dealPairs(tiles, pairs, rnd);
}

// 找一對現在可以消的牌，沒有就回傳 null
export function findPair(tiles) {
  const seen = new Map();
  for (const t of tiles) {
    if (!isFree(t, tiles)) continue;
    if (seen.has(t.kind)) return [seen.get(t.kind), t];
    seen.set(t.kind, t);
  }
  return null;
}
