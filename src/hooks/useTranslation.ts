import { useState, useEffect } from 'react';
import { translations, Language } from '../locales';

export const useTranslation = () => {
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

    // 將決定的語言存回 localStorage，讓之後訪問維持一致
    localStorage.setItem('app-lang', initialLang);
    return initialLang as Language;
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app-lang', newLang);
    
    // 同步更新網址 (可選，讓使用者切換語言時網址也保持最新，方便複製分享)
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has('lang')) {
        currentUrl.searchParams.set('lang', newLang);
        window.history.replaceState({}, '', currentUrl.toString());
    } else if (window.location.hash.includes('?lang=')) {
        // 簡單相容處理修改 HashRouter 裡的 lang
        // (這裡不覆寫所有結構，僅在已存在 lang 參數時做替換維持乾淨的路由)
        const newHash = window.location.hash.replace(/[?&]lang=[^&]*/, (match) => {
           return match.replace(/=[^&]*/, `=${newLang}`);
        });
        window.location.hash = newHash;
    }
  };

  const t = translations[lang];

  useEffect(() => {
    // 確保 t 有值
    if (!t) return;

    // 動態更新 Document Title (支援 TypeScript 任意寫法或我們已經確定的屬性)
    if ((t as any).site_title) {
      document.title = (t as any).site_title;
    }

    // 動態更新 Meta Description
    if ((t as any).site_description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        // 如果原本沒有這個 meta 標籤就建立一個
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', (t as any).site_description);
    }
  }, [lang, t]); // 當語系變更或 t 接到新值時觸發這段邏輯

  return { t, lang, setLang };
};
