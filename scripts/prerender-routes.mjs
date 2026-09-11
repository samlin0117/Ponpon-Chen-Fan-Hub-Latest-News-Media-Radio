/**
 * Build 後產生每個路由的實體 HTML 檔 (dist/news.html, dist/about.html ...)。
 *
 * 為什麼需要這個：
 * GitHub Pages 是純靜態伺服器，沒有 SPA fallback。如果 dist 裡只有 index.html，
 * 那麼 /news 找不到對應檔案就會回 **HTTP 404**——即使 404.html 用 JS 把畫面導正、
 * 真人看起來一切正常，Google 收到的仍是 404，等於宣告「此頁不存在」而不會收錄。
 *
 * 產生實體檔之後 /news 回 200，而且 title/description/og 直接寫死在原始 HTML 裡，
 * 不執行 JS 的爬蟲 (Bing、LINE/FB 分享預覽) 也讀得到。
 *
 * 語言一律用預設的 zh；使用者切語言時由 components/Seo.tsx 在前端接手更新。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');

const seo = JSON.parse(readFileSync(join(root, 'src/seo/pages.json'), 'utf8'));
const { siteUrl, ogImage, siteName, pages } = seo;
const LANG = 'zh';

const escapeAttr = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** 換掉 <title>，找不到就報錯——寧可 build 失敗也不要靜默產出錯誤的 meta */
function replaceTitle(html, value) {
  if (!/<title>[\s\S]*?<\/title>/.test(html)) {
    throw new Error('找不到 <title>，index.html 結構可能已變動');
  }
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(value)}</title>`);
}

/** 換掉指定 meta 的 content，沒有就補上一個 */
function replaceMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}=["']${key}["'][^>]*content=["'])([\\s\\S]*?)(["'])`, 'i');
  if (re.test(html)) return html.replace(re, `$1${escapeAttr(value)}$3`);
  return html.replace('</head>', `    <meta ${attr}="${key}" content="${escapeAttr(value)}">\n  </head>`);
}

function replaceCanonical(html, href) {
  const re = /(<link\s+rel=["']canonical["'][^>]*href=["'])([\s\S]*?)(["'])/i;
  if (re.test(html)) return html.replace(re, `$1${escapeAttr(href)}$3`);
  return html.replace('</head>', `    <link rel="canonical" href="${escapeAttr(href)}" />\n  </head>`);
}

function replaceHreflang(html, base) {
  const alternates = [
    ['zh-Hant', `${base}?lang=zh`],
    ['en', `${base}?lang=en`],
    ['ja', `${base}?lang=ja`],
    ['x-default', base],
  ];
  let out = html;
  for (const [hreflang, href] of alternates) {
    const re = new RegExp(
      `(<link\\s+rel=["']alternate["']\\s+hreflang=["']${hreflang}["'][^>]*href=["'])([\\s\\S]*?)(["'])`,
      'i'
    );
    if (re.test(out)) out = out.replace(re, `$1${escapeAttr(href)}$3`);
  }
  return out;
}

const template = readFileSync(join(distDir, 'index.html'), 'utf8');
const written = [];

for (const [route, byLang] of Object.entries(pages)) {
  const meta = byLang[LANG];
  const isHome = route === '/';
  const url = `${siteUrl}${isHome ? '/' : route}`;
  const title = isHome ? meta.title : `${meta.title}｜${siteName[LANG]}`;

  let html = template;
  html = replaceTitle(html, title);
  html = replaceMeta(html, 'name', 'title', title);
  html = replaceMeta(html, 'name', 'description', meta.description);
  html = replaceMeta(html, 'property', 'og:url', url);
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', meta.description);
  html = replaceMeta(html, 'property', 'og:image', ogImage);
  html = replaceMeta(html, 'property', 'twitter:url', url);
  html = replaceMeta(html, 'property', 'twitter:title', title);
  html = replaceMeta(html, 'property', 'twitter:description', meta.description);
  html = replaceCanonical(html, url);
  html = replaceHreflang(html, url);

  // 首頁覆寫 index.html 本身，其餘寫成 <route>.html 讓 GitHub Pages 以 200 直接命中
  const outFile = isHome ? 'index.html' : `${route.slice(1)}.html`;
  writeFileSync(join(distDir, outFile), html, 'utf8');
  written.push(outFile);
}

console.log(`[prerender] 產生 ${written.length} 個靜態頁: ${written.join(', ')}`);
