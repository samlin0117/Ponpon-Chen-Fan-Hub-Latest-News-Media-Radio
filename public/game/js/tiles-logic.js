// 公仔對對碰的規則（不碰畫面，可以單獨測試）。
// 兩張一樣的牌，只要能用不超過 2 個轉角的線連起來就能消。線只能走空格，也可以繞到牌陣外面一圈。

// 關卡：# 是牌，. 是空格。kinds 是用幾種圖案，secs 是限時幾秒。每關的牌數一定要是雙數。
export const LEVELS = [
  { // 第一關：小舞台
    kinds: 6, secs: 40,
    rows: ['######', '######', '######', '######'],
  },
  { // 第二關：愛心
    kinds: 8, secs: 45,
    rows: ['.##.##.', '#######', '#######', '.#####.', '..###..'],
  },
  { // 第三關：音符
    kinds: 10, secs: 45,
    rows: ['..#####', '..#####', '..#...#', '..#...#', '###.###', '###.###'],
  },
  { // 第四關：吉他
    kinds: 10, secs: 55,
    rows: ['...##..', '...##..', '...##..', '..####.', '.######', '.######', '.######', '..####.'],
  },
  { // 第五關：滿滿一面牆，一開始只有外圈的牌連得到
    kinds: 12, secs: 100,
    rows: ['#######', '#######', '#######', '#######', '#######', '#######', '#######', '#######'],
  },
];

export function buildPositions(level) {
  const out = [];
  level.rows.forEach((row, r) => {
    [...row].forEach((c, col) => {
      if (c === '#') out.push({ c: col, r });
    });
  });
  return out;
}

export const levelSize = (level) => ({ cols: Math.max(...level.rows.map((row) => row.length)), rows: level.rows.length });

export function shuffled(list, rnd = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const key = (c, r) => `${c},${r}`;

// 找 a 到 b 轉角最少的路線，超過 2 個轉角就回傳 null。回傳值是路線上的點（起點、轉角、終點）。
// blocked 是有牌的格子。路線可以走到牌陣外一格，size 是牌陣大小。
export function findPath(a, b, blocked, size) {
  const start = { c: a.c, r: a.r, dir: -1, turns: -1, prev: null };
  const seen = new Map();
  let level = [start];
  for (let turns = 0; turns <= 2; turns++) {
    const next = [];
    for (const node of level) {
      for (let d = 0; d < 4; d++) {
        if (d === node.dir) continue;
        let c = node.c;
        let r = node.r;
        let prev = node;
        for (;;) {
          c += DIRS[d][0];
          r += DIRS[d][1];
          if (c < -1 || r < -1 || c > size.cols || r > size.rows) break;
          if (c === b.c && r === b.r) {
            const pts = [{ c, r }];
            for (let n = prev; n; n = n.prev) {
              const last = pts[pts.length - 1];
              const up = n.prev;
              // 只留起點和轉角
              if (!up || !(up.c === n.c && n.c === last.c) && !(up.r === n.r && n.r === last.r)) pts.push({ c: n.c, r: n.r });
            }
            return pts.reverse();
          }
          if (blocked.has(key(c, r))) break;
          const k = `${c},${r},${d}`;
          if (seen.has(k) && seen.get(k) <= turns) {
            prev = { c, r, dir: d, turns, prev };
            continue;
          }
          seen.set(k, turns);
          prev = { c, r, dir: d, turns, prev };
          next.push(prev);
        }
      }
    }
    level = next;
  }
  return null;
}

export const occupied = (tiles) => new Set(tiles.map((t) => key(t.c, t.r)));

// 發牌：從空盤開始，一次放一對，放的時候這兩格要連得起來。
// 反過來照放的順序消，每一對當下都連得到，所以每局都解得開。回傳消牌順序，發不出來就回傳 null。
export function dealPairs(tiles, pairs, size, rnd = Math.random) {
  for (let attempt = 0; attempt < 300; attempt++) {
    const empty = new Set(tiles);
    const placed = new Set();
    const order = [];
    const kinds = shuffled(pairs, rnd);
    let ok = true;
    for (const kind of kinds) {
      // 先處理旁邊空格最少、離邊緣最遠的牌，不然它會被包在裡面，之後連不到
      const room = (t) =>
        DIRS.filter(([x, y]) => {
          const c = t.c + x;
          const r = t.r + y;
          const k = key(c, r);
          return !placed.has(k);
        }).length;
      const depth = (t) => Math.min(t.c, t.r, size.cols - 1 - t.c, size.rows - 1 - t.r);
      const first = shuffled([...empty], rnd).sort((p, q) => room(p) - room(q) || depth(q) - depth(p));
      let a = null;
      let b = null;
      for (const cand of first) {
        // 盡量不要挑隔壁，太好找就不好玩了；真的只剩隔壁才用
        let near = null;
        for (const t of shuffled([...empty], rnd)) {
          if (t === cand || !findPath(cand, t, placed, size)) continue;
          if (Math.abs(t.c - cand.c) + Math.abs(t.r - cand.r) > 1) {
            b = t;
            break;
          }
          near = near || t;
        }
        b = b || near;
        if (b) {
          a = cand;
          break;
        }
      }
      if (!a) {
        ok = false;
        break;
      }
      placed.add(key(a.c, a.r));
      placed.add(key(b.c, b.r));
      empty.delete(a);
      empty.delete(b);
      order.push([a, b, kind]);
    }
    if (ok) {
      order.forEach(([x, y, kind]) => {
        x.kind = kind;
        y.kind = kind;
      });
      return order.reverse();
    }
  }
  return null;
}

// 開局：每種圖案的張數盡量平均
export function dealLevel(tiles, kinds, size, rnd = Math.random) {
  if (tiles.length % 2) throw new Error('牌數要是雙數');
  const pairs = Array.from({ length: tiles.length / 2 }, (_, i) => kinds[i % kinds.length]);
  return dealPairs(tiles, pairs, size, rnd);
}

// 洗牌：把還在場上的牌重新配對，洗完一定解得開。位置配不出來時，就把牌集中排到牌陣中間再配一次
export function reshuffle(tiles, size, rnd = Math.random) {
  const counts = {};
  tiles.forEach((t) => {
    counts[t.kind] = (counts[t.kind] || 0) + 1;
  });
  const pairs = [];
  Object.entries(counts).forEach(([kind, n]) => {
    for (let i = 0; i < n / 2; i++) pairs.push(kind);
  });
  const order = dealPairs(tiles, pairs, size, rnd);
  if (order) return order;
  const cols = Math.min(size.cols, Math.ceil(Math.sqrt(tiles.length * 2)));
  const rows = Math.ceil(tiles.length / cols);
  const left = Math.floor((size.cols - cols) / 2);
  const top = Math.floor((size.rows - rows) / 2);
  tiles.forEach((t, i) => {
    t.c = left + (i % cols);
    t.r = top + Math.floor(i / cols);
  });
  return dealPairs(tiles, pairs, size, rnd);
}

// 找一對現在連得起來的牌，沒有就回傳 null
export function findPair(tiles, size) {
  const blocked = occupied(tiles);
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i].kind === tiles[j].kind && findPath(tiles[i], tiles[j], blocked, size)) return [tiles[i], tiles[j]];
    }
  }
  return null;
}
