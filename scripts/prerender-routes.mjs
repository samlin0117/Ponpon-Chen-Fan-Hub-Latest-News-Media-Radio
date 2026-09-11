/**
 * Build 後產生每個「路由 × 語言」的實體 HTML 檔，以及對應的 sitemap.xml。
 *
 * 為什麼需要這個：
 * 1. GitHub Pages 是純靜態伺服器，沒有 SPA fallback。dist 裡若只有 index.html，
 *    /news 找不到對應檔案就會回 HTTP 404——即使 404.html 用 JS 把畫面導正、
 *    真人看起來正常，Google 收到的仍是 404，等於宣告此頁不存在而不會收錄。
 * 2. 靜態伺服器解析檔案時完全忽略查詢字串，所以 /about?lang=en 不可能回傳
 *    和 /about 不同的 HTML。語言必須放進路徑，英日文才有自己可被收錄的網址。
 *
 * 產生結果：
 *   dist/index.html      dist/about.html      ← 中文（預設語言，無前綴）
 *   dist/en.html         dist/en/about.html   ← 英文
 *   dist/ja.html         dist/ja/about.html   ← 日文
 *   dist/sitemap.xml     ← 依同一份資料產生，不需手動維護
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');

const seo = JSON.parse(readFileSync(join(root, 'src/seo/pages.json'), 'utf8'));
const { siteUrl, ogImage, siteName, htmlLang, pages } = seo;

const DEFAULT_LANG = 'zh';
const LANGS = ['zh', 'en', 'ja'];
const TODAY = new Date().toISOString().slice(0, 10);

const escapeAttr = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** 某語言下某路由的網址路徑：buildPath('en', '/about') → '/en/about' */
function buildPath(lang, route) {
  const clean = route === '/' ? '' : route;
  if (lang === DEFAULT_LANG) return clean === '' ? '/' : clean;
  return `/${lang}${clean}`;
}

/** 換掉 <title>，找不到就報錯——寧可 build 失敗也不要靜默產出錯誤的 meta */
function replaceTitle(html, value) {
  if (!/<title>[\s\S]*?<\/title>/.test(html)) {
    throw new Error('找不到 <title>，index.html 結構可能已變動');
  }
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(value)}</title>`);
}

function replaceHtmlLang(html, value) {
  return html.replace(/<html\s+lang=["'][^"']*["']/i, `<html lang="${escapeAttr(value)}"`);
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

/** 三語互指。每個版本都是自我 canonical，hreflang 才會被 Google 採用。 */
function replaceHreflang(html, route) {
  const alternates = [
    ['zh-Hant', `${siteUrl}${buildPath('zh', route)}`],
    ['en', `${siteUrl}${buildPath('en', route)}`],
    ['ja', `${siteUrl}${buildPath('ja', route)}`],
    ['x-default', `${siteUrl}${buildPath('zh', route)}`],
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

function writeFile(relPath, content) {
  const full = join(distDir, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
}

const template = readFileSync(join(distDir, 'index.html'), 'utf8');
let count = 0;

for (const lang of LANGS) {
  for (const [route, byLang] of Object.entries(pages)) {
    const meta = byLang[lang];
    const isHome = route === '/';
    const url = `${siteUrl}${buildPath(lang, route)}`;
    const title = isHome ? meta.title : `${meta.title}｜${siteName[lang]}`;

    let html = template;
    html = replaceHtmlLang(html, htmlLang[lang]);
    html = replaceTitle(html, title);
    html = replaceMeta(html, 'name', 'title', title);
    html = replaceMeta(html, 'name', 'description', meta.description);
    html = replaceMeta(html, 'property', 'og:locale', htmlLang[lang].replace('-', '_'));
    html = replaceMeta(html, 'property', 'og:site_name', siteName[lang]);
    html = replaceMeta(html, 'property', 'og:url', url);
    html = replaceMeta(html, 'property', 'og:title', title);
    html = replaceMeta(html, 'property', 'og:description', meta.description);
    html = replaceMeta(html, 'property', 'og:image', ogImage);
    html = replaceMeta(html, 'property', 'twitter:url', url);
    html = replaceMeta(html, 'property', 'twitter:title', title);
    html = replaceMeta(html, 'property', 'twitter:description', meta.description);
    html = replaceCanonical(html, url);
    html = replaceHreflang(html, route);

    if (lang === DEFAULT_LANG) {
      writeFile(isHome ? 'index.html' : `${route.slice(1)}.html`, html);
      count++;
    } else if (isHome) {
      // /en 與 /en/ 都要能命中，兩種形式各寫一份（canonical 都指向 /en）
      writeFile(`${lang}.html`, html);
      writeFile(`${lang}/index.html`, html);
      count += 2;
    } else {
      writeFile(`${lang}${route}.html`, html);
      count++;
    }
  }
}

// ── sitemap.xml ──────────────────────────────────────────────────────────────
const entries = [];
for (const lang of LANGS) {
  for (const route of Object.keys(pages)) {
    const loc = `${siteUrl}${buildPath(lang, route)}`;
    const alts = [
      ['zh-Hant', `${siteUrl}${buildPath('zh', route)}`],
      ['en', `${siteUrl}${buildPath('en', route)}`],
      ['ja', `${siteUrl}${buildPath('ja', route)}`],
      ['x-default', `${siteUrl}${buildPath('zh', route)}`],
    ]
      .map(([h, href]) => `    <xhtml:link rel="alternate" hreflang="${h}" href="${escapeAttr(href)}"/>`)
      .join('\n');

    const priority = route === '/' ? '1.0' : ['/news', '/videos', '/timeline'].includes(route) ? '0.9' : '0.7';
    const changefreq = ['/', '/news', '/videos', '/timeline', '/changelog'].includes(route) ? 'weekly' : 'monthly';

    entries.push(
      `  <url>\n` +
        `    <loc>${escapeAttr(loc)}</loc>\n` +
        `    <lastmod>${TODAY}</lastmod>\n` +
        `    <changefreq>${changefreq}</changefreq>\n` +
        `    <priority>${priority}</priority>\n` +
        `${alts}\n` +
        `  </url>`
    );
  }
}

writeFile(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    `${entries.join('\n')}\n` +
    `</urlset>\n`
);

console.log(`[prerender] 產生 ${count} 個靜態頁 + sitemap.xml (${entries.length} 筆網址)`);
