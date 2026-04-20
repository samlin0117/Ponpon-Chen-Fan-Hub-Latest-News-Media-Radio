import { useEffect, useRef } from 'react';
import { MessageSquareText, Sparkles } from 'lucide-react';

interface CusdisCommentsProps {
  lang: 'zh' | 'en' | 'ja';
}

const translations = {
  zh: {
    header: "FAN LOUNGE",
    noLogin: "免登入留言區",
    title: "想對 Ponpon 說什麼嗎？",
    desc: "您的留言是對 Ponpon 最大的支持與鼓勵。您可以直接在下方輸入暱稱與內容 (不需要註冊帳號)。",
    disclaimer: "※ 為了維護高品質的空間，留言送出後會先由版主過目，稍微等待一下就會顯示出來囉！"
  },
  en: {
    header: "FAN LOUNGE",
    noLogin: "Guest Comments",
    title: "Anything to say to Ponpon?",
    desc: "Your words are the greatest support and encouragement for Ponpon. You can simply enter your nickname and message below (no registration required).",
    disclaimer: "※ To maintain a high-quality space, comments are moderated and will appear shortly after approval!"
  },
  ja: {
    header: "FAN LOUNGE",
    noLogin: "ゲストコメント",
    title: "Ponponに伝えたいことはありますか？",
    desc: "あなたのメッセージはPonponにとって最大の支えであり励ましです。下にニックネームとメッセージを入力するだけです（登録不要）。",
    disclaimer: "※ 質の高い空間を保つため、コメントは管理者の承認後に表示されます。しばらくお待ちください！"
  }
};

const cusdisLangMap: Record<string, string> = {
  zh: 'zh-tw',
  ja: 'ja',
  en: '' // English is native, so we don't load a separate script
};

export default function CusdisComments({ lang = 'zh' }: CusdisCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appId = import.meta.env.VITE_CUSDIS_APP_ID || "14de6220-7400-4e81-a30e-5cea977722ab";
  const t = translations[lang] || translations.zh;

  useEffect(() => {
    if (!containerRef.current) return;
    
    // 1. Wipe out any previous iframe
    containerRef.current.innerHTML = '';
    
    // 2. Prepare the render function (passing the exact container ref)
    const render = () => {
      if (typeof (window as any).renderCusdis === 'function' && containerRef.current) {
        (window as any).renderCusdis(containerRef.current);
      }
    };

    // 3. Clear existing window.CUSDIS_LOCALE for English defaults
    if (lang === 'en') {
      (window as any).CUSDIS_LOCALE = undefined;
    }

    // 4. Function to ensure main script is loaded
    const loadMainScript = (callback: () => void) => {
      const scriptId = 'cusdis-global-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://cusdis.com/js/cusdis.es.js';
        script.async = true;
        document.head.appendChild(script);
        script.onload = callback;
      } else {
        // Allow a small tick for the DOM to settle
        setTimeout(callback, 50);
      }
    };

    // 5. Function to load language script
    const loadLangScript = (targetLang: string, callback: () => void) => {
      if (!targetLang) {
        callback();
        return;
      }
      
      const scriptId = `cusdis-lang-${targetLang}`;
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://cusdis.com/js/widget/lang/${targetLang}.js`;
        script.async = true;
        document.head.appendChild(script);
        script.onload = callback;
      } else {
        // If it was already loaded, it has already set window.CUSDIS_LOCALE globally.
        // We just need to trigger the callback, but simulate it to ensure we don't race!
        // To be absolutely safe since window.CUSDIS_LOCALE might be overridden by another language switch:
        // We just reload or re-evaluate it, but actually Cusdis caches it.
        // Let's just remove the old lang script and inject a fresh one to force window.CUSDIS_LOCALE refresh
        document.head.removeChild(script);
        
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://cusdis.com/js/widget/lang/${targetLang}.js`;
        script.async = true;
        document.head.appendChild(script);
        script.onload = callback;
      }
    };

    // 6. Execute the loading chain
    loadMainScript(() => {
      loadLangScript(cusdisLangMap[lang], () => {
        render();
      });
    });

  }, [appId, lang]);

  return (
    <div className="w-full relative">
      {/* Decorative Top header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold/10 rounded-lg border border-gold/20">
            <MessageSquareText className="w-5 h-5 text-gold" />
          </div>
          <h3 className="text-xl font-serif text-white tracking-widest">{t.header}</h3>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-wider bg-dark px-3 py-1.5 rounded-full border border-white/5">
          <span className="w-2 h-2 rounded-full bg-green-500/80 animate-pulse" />
          {t.noLogin}
        </div>
      </div>

      <div className="bg-dark/50 rounded-xl p-4 md:p-6 mb-8 border border-white/5 shadow-inner relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="bg-dark p-3 rounded-full border border-gold/10 shrink-0">
            <Sparkles className="w-6 h-6 text-gold/80" />
          </div>
          <div>
            <h4 className="text-gray-200 font-medium mb-1 tracking-wide">{t.title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t.desc}
              <br className="hidden md:block" />
              <span className="text-gold/70 text-xs mt-1 md:mt-0 inline-block">
                {t.disclaimer}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Embedded Cusdis Container */}
      <div 
        ref={containerRef}
        id="cusdis_thread"
        data-host="https://cusdis.com"
        data-app-id={appId}
        data-page-id="ponpon-fan-site-main"
        data-page-title="Ponpon Fan Site Messages"
        data-page-url={window.location.href}
        data-theme="dark"
        className="w-full min-h-[350px] text-left [&_iframe]:min-h-[350px] [&_iframe]:w-full transition-opacity duration-500" 
      />
    </div>
  );
}
