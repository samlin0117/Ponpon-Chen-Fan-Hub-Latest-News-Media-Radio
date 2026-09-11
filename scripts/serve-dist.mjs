/**
 * 用 GitHub Pages 的規則在本地提供 dist/，讓部署前就能測到正式環境的行為。
 *
 * 為什麼需要：Vite dev server 對任何路徑都回 200 並注入 index.html，
 * 會掩蓋兩類只在正式環境出現的錯誤——
 *   1. 沒有實體檔案的路徑其實會 404（爬蟲因此不收錄）
 *   2. 巢狀路徑 (/ja/videos) 底下相對資源路徑解析錯誤，整頁空白
 *
 * 解析順序與 GitHub Pages 相同：
 *   <path> → <path>.html → <path>/index.html → 404.html（並回 404 狀態碼）
 *
 * 用法：npm run build && npm run serve:dist
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

async function tryFile(path) {
  try {
    const s = await stat(path);
    if (s.isFile()) return path;
  } catch {}
  return null;
}

createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  // 擋掉往上跳脫 dist 的路徑
  const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const base = join(distDir, safe);

  const target =
    (await tryFile(base)) ||
    (await tryFile(`${base}.html`)) ||
    (await tryFile(join(base, 'index.html')));

  if (target) {
    const body = await readFile(target);
    res.writeHead(200, { 'Content-Type': TYPES[extname(target)] || 'application/octet-stream' });
    return res.end(body);
  }

  // GitHub Pages 對找不到的路徑回 404 狀態碼 + 404.html 內容
  const notFound = await tryFile(join(distDir, '404.html'));
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(notFound ? await readFile(notFound) : 'Not Found');
}).listen(port, () => {
  console.log(`[serve-dist] 以 GitHub Pages 規則提供 dist/ → http://localhost:${port}`);
});
