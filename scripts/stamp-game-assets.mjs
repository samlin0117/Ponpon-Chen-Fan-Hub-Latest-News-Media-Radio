/**
 * Build 後幫遊戲（dist/game）的 css、js、圖片網址加上 ?v=內容雜湊。
 *
 * 為什麼需要這個：
 * public/game 是原封不動複製到 dist 的，檔名沒有 hash。Cloudflare 讓瀏覽器把 js、圖片
 * 快取 4 小時，所以遊戲更新後，玩過的電腦還會繼續用舊檔。加上版本號後，只要遊戲有任何
 * 檔案改變，網址就跟著變，瀏覽器就會重新下載。
 *
 * 會改的地方：
 *   dist/game/*.html     ← href/src 指向 css/、js/、img/ 的網址
 *   dist/game/js/*.js    ← import ... from './xxx.js'
 * 程式裡組出來的圖片網址（例如泡泡圖）由 js 自己讀 import.meta.url 的 ?v= 接上去。
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const gameDir = join(root, 'dist/game');

if (!existsSync(gameDir)) {
  console.log('[stamp-game-assets] dist/game 不存在，略過');
  process.exit(0);
}

const walk = (dir) =>
  readdirSync(dir).sort().flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

// 整個遊戲資料夾算一個版本號：任何一個檔案改了，所有網址一起換
const files = walk(gameDir);
const hash = createHash('sha1');
for (const f of files) {
  hash.update(f.slice(gameDir.length));
  hash.update(readFileSync(f));
}
const v = hash.digest('hex').slice(0, 10);

let count = 0;
for (const f of files) {
  if (f.endsWith('.html')) {
    const src = readFileSync(f, 'utf8');
    const out = src.replace(/(href|src)="((?:css|js|img)\/[^"?#]+)"/g, (_, attr, url) => {
      count++;
      return `${attr}="${url}?v=${v}"`;
    });
    writeFileSync(f, out);
  } else if (f.endsWith('.js')) {
    const src = readFileSync(f, 'utf8');
    const out = src.replace(/(from\s+['"])(\.\/[^'"?#]+\.js)(['"])/g, (_, a, url, b) => {
      count++;
      return `${a}${url}?v=${v}${b}`;
    });
    writeFileSync(f, out);
  }
}

console.log(`[stamp-game-assets] v=${v}，更新 ${count} 個網址`);
