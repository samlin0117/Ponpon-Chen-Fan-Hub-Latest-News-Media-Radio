import { translations, Language } from '../locales';
import { getLangFromPath, stripLangPrefix, buildPath } from '../i18n/route';

/**
 * 語言完全由網址路徑決定（/about = 中文、/en/about = 英文、/ja/about = 日文）。
 *
 * 因此同一次瀏覽期間語言是固定的，不需要 state、也不需要在各元件之間同步——
 * 每個呼叫 useTranslation 的元件讀到的都是同一個路徑，自然得到同一個語言。
 * 切換語言是整頁導向，這樣才能拿到該語言預先產生的靜態 HTML（含正確的 meta）。
 */
export const useTranslation = () => {
  const lang = getLangFromPath(window.location.pathname);
  const t = translations[lang];

  const setLang = (newLang: Language) => {
    if (newLang === lang) return;
    const appPath = stripLangPrefix(window.location.pathname);
    localStorage.setItem('app-lang', newLang);
    window.location.assign(buildPath(newLang, appPath) + window.location.search + window.location.hash);
  };

  // Title / description / canonical / hreflang 由 components/Seo.tsx 依「路由 + 語言」統一管理，
  // 這裡不再覆寫，否則所有頁面會共用同一組 meta 而被搜尋引擎判為重複內容。

  return { t, lang, setLang };
};
