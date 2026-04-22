import { useState, useEffect } from 'react';
import { translations, Language } from '../locales';

export const useTranslation = () => {
  // Try to load language from localStorage or default to 'zh'
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-lang');
    if (saved && (saved === 'zh' || saved === 'en' || saved === 'ja')) {
      return saved as Language;
    }
    return 'zh';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app-lang', newLang);
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
