import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Language } from '../locales';

import seoData from '../seo/pages.json';
import { buildPath } from '../i18n/route';

const { siteUrl: SITE_URL, ogImage: DEFAULT_OG_IMAGE } = seoData;
const HTML_LANG = seoData.htmlLang as Record<Language, string>;
const SITE_NAME = seoData.siteName as Record<Language, string>;

type PageMeta = { title: string; description: string };

/**
 * 每個路由的獨立 title / description，與 build 時產生靜態頁的腳本
 * (scripts/prerender-routes.mjs) 共用同一份 src/seo/pages.json。
 */
const PAGES = seoData.pages as Record<string, Record<Language, PageMeta>>;


/** 建立或取得 head 中的標籤，避免每次渲染都新增重複節點 */
function upsert(selector: string, create: () => HTMLElement): HTMLElement {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  const el = upsert(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute(attr, key);
    return m;
  });
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
  const el = upsert(selector, () => {
    const l = document.createElement('link');
    l.setAttribute('rel', rel);
    if (hreflang) l.setAttribute('hreflang', hreflang);
    return l;
  });
  el.setAttribute('href', href);
}

/**
 * 依當前路由與語言同步 head 內的 SEO 標籤。
 * 不渲染任何畫面，只有副作用。
 */
export default function Seo({ lang }: { lang: Language }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const page = PAGES[path]?.[lang] ?? PAGES['/'][lang];

    // pages.json 存的就是完整標題。每頁自行決定要不要帶站名、帶多長，
    // 才能把 Google 有限的顯示寬度留給真正有搜尋價值的字。
    const title = page.title;
    // canonical 必須指向「自己這個語言」的網址，否則等於告訴 Google
    // 英日文版本只是中文版的複本，該語言就永遠不會被單獨收錄。
    const canonical = `${SITE_URL}${buildPath(lang, path)}`;

    document.documentElement.lang = HTML_LANG[lang];
    document.title = title;

    setMeta('name', 'title', title);
    setMeta('name', 'description', page.description);

    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE_NAME[lang]);
    setMeta('property', 'og:locale', HTML_LANG[lang].replace('-', '_'));
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', page.description);
    setMeta('property', 'og:image', DEFAULT_OG_IMAGE);

    setMeta('property', 'twitter:card', 'summary_large_image');
    setMeta('property', 'twitter:url', canonical);
    setMeta('property', 'twitter:title', title);
    setMeta('property', 'twitter:description', page.description);
    setMeta('property', 'twitter:image', DEFAULT_OG_IMAGE);

    setLink('canonical', canonical);

    // 同一頁的三個語言版本互指。每個版本都是自我 canonical，
    // hreflang 才會被 Google 採用（canonical 若指向別的語言，hreflang 會被忽略）。
    setLink('alternate', `${SITE_URL}${buildPath('zh', path)}`, 'zh-Hant');
    setLink('alternate', `${SITE_URL}${buildPath('en', path)}`, 'en');
    setLink('alternate', `${SITE_URL}${buildPath('ja', path)}`, 'ja');
    setLink('alternate', `${SITE_URL}${buildPath('zh', path)}`, 'x-default');
  }, [pathname, lang]);

  return null;
}
