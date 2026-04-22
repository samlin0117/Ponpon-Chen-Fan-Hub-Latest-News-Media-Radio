import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { translations, Language } from '../locales';

export const useTranslation = () => {
  const location = useLocation();

  const [lang, setLangState] = useState<Language>(() => {
    const supportedLangs = ['zh', 'en', 'ja'];

    // 1. URL 參數 (?lang=)
    const queryParams = new URLSearchParams(window.location.search);
    let urlLang = queryParams.get('lang');

    // 相容 HashRouter (尋找 hash 裡面的 query string，如 #/?lang=en)
    if (!urlLang && window.location.hash.includes('?')) {
      const hashQueryString = window.location.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQueryString);
      urlLang = hashParams.get('lang');
    }

    let initialLang = 'zh'; // 預設值

    if (urlLang && supportedLangs.includes(urlLang)) {
      initialLang = urlLang;
    } else {
      // 2. localStorage
      const saved = localStorage.getItem('app-lang');
      if (saved && supportedLangs.includes(saved)) {
        initialLang = saved;
      } else {
        // 3. 瀏覽器預設語言
        const browserLang = navigator.language ? navigator.language.split('-')[0] : null;
        if (browserLang && supportedLangs.includes(browserLang)) {
          initialLang = browserLang;
        }
      }
    }

    localStorage.setItem('app-lang', initialLang);
    return initialLang as Language;
  });

  // 自動同步：當 URL (location.search 或 location.hash) 變動時，更新語言
  useEffect(() => {
    const supportedLangs = ['zh', 'en', 'ja'];
    
    const queryParams = new URLSearchParams(window.location.search);
    let urlLang = queryParams.get('lang');

    if (!urlLang && window.location.hash.includes('?')) {
      const hashQueryString = window.location.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQueryString);
      urlLang = hashParams.get('lang');
    }

    if (urlLang && supportedLangs.includes(urlLang) && urlLang !== lang) {
      setLangState(urlLang as Language);
      localStorage.setItem('app-lang', urlLang);
    }
  }, [location.search, location.hash, lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app-lang', newLang);
    
    // 同步更新網址
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has('lang')) {
        currentUrl.searchParams.set('lang', newLang);
        window.history.replaceState({}, '', currentUrl.toString());
    } else if (window.location.hash.includes('?lang=')) {
        const newHash = window.location.hash.replace(/[?&]lang=[^&]*/, (match) => {
           return match.replace(/=[^&]*/, `=${newLang}`);
        });
        window.location.hash = newHash;
    } else {
        // 若網址原本沒有 lang，可以在切換時自動加上去 (如果使用者有此需求，可選加入)
        // currentUrl.searchParams.set('lang', newLang);
        // window.history.replaceState({}, '', currentUrl.toString());
    }
  };

  const t = translations[lang];

  useEffect(() => {
    // 確保 t 有值
    if (!t) return;

    // 動態更新 Document Title
    if ((t as any).site_title) {
      document.title = (t as any).site_title;
    }

    // 動態更新 Meta Description
    if ((t as any).site_description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', (t as any).site_description);
    }
  }, [lang, t]);

  return { t, lang, setLang };
};
