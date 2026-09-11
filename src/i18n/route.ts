/**
 * 語言與網址路徑的對應規則。
 *
 * 中文是預設語言，沒有前綴；英日文各自有自己的路徑前綴：
 *   /about      → 中文
 *   /en/about   → 英文
 *   /ja/about   → 日文
 *
 * 之所以不用 ?lang= 查詢參數，是因為 GitHub Pages 這類靜態主機在解析檔案時
 * 完全忽略查詢字串——/about?lang=en 和 /about 會回傳同一個檔案，
 * 導致英日文版本沒有自己可被搜尋引擎收錄的網址。
 */
import { Language } from '../locales';

export const DEFAULT_LANG: Language = 'zh';
export const SUPPORTED_LANGS: Language[] = ['zh', 'en', 'ja'];

/** 有路徑前綴的語言（預設語言不佔前綴） */
const PREFIXED_LANGS = SUPPORTED_LANGS.filter((l) => l !== DEFAULT_LANG);

export function isLanguage(value: string | null | undefined): value is Language {
  return !!value && (SUPPORTED_LANGS as string[]).includes(value);
}

/** 從完整路徑取出語言，例如 /en/about → 'en'、/about → 'zh' */
export function getLangFromPath(pathname: string): Language {
  const seg = pathname.split('/')[1];
  return (PREFIXED_LANGS as string[]).includes(seg) ? (seg as Language) : DEFAULT_LANG;
}

/** React Router 的 basename：'/en'、'/ja' 或 '/' */
export function getBasename(pathname: string): string {
  const lang = getLangFromPath(pathname);
  return lang === DEFAULT_LANG ? '/' : `/${lang}`;
}

/** 去掉語言前綴，取得應用內部路徑，例如 /en/about → /about */
export function stripLangPrefix(pathname: string): string {
  const seg = pathname.split('/')[1];
  if (!(PREFIXED_LANGS as string[]).includes(seg)) return pathname || '/';
  const rest = pathname.slice(seg.length + 1);
  return rest === '' ? '/' : rest;
}

/**
 * 組出某個語言下、某個應用內部路徑的完整網址路徑。
 * buildPath('en', '/about') → '/en/about'
 * buildPath('zh', '/about') → '/about'
 * buildPath('en', '/')      → '/en'
 */
export function buildPath(lang: Language, appPath: string): string {
  const clean = appPath === '/' ? '' : appPath.replace(/\/$/, '');
  if (lang === DEFAULT_LANG) return clean === '' ? '/' : clean;
  return `/${lang}${clean}`;
}
