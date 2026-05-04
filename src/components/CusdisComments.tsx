import React, { useEffect, useRef } from 'react';
import { MessageSquareText, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface CusdisCommentsProps {
  lang: 'zh' | 'en' | 'ja';
  t: any;
}

const CusdisComments: React.FC<CusdisCommentsProps> = ({ lang, t }) => {
  const cusdisRef = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Cusdis sends message when comment is submitted
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        // Broaden detection for any message from Cusdis
        if (data.from === 'cusdis' || (e.origin === 'https://cusdis.com' && data.event)) {
          setIsSubmitted(false);
          setTimeout(() => {
            setIsSubmitted(true);
            // Auto hide after 10 seconds
            setTimeout(() => setIsSubmitted(false), 10000);
          }, 50);
        }
      } catch (err) {
        // Not a JSON message or not from Cusdis
      }
    };

    window.addEventListener('message', handleMessage);

    const renderCusdis = () => {
      if ((window as any).renderCusdis && cusdisRef.current) {
        (window as any).renderCusdis(cusdisRef.current);
      }
    };

    const existingScript = document.getElementById('cusdis-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'cusdis-script';
      script.src = 'https://cusdis.com/js/cusdis.es.js';
      script.async = true;
      script.defer = true;
      script.onload = renderCusdis;
      document.body.appendChild(script);
    } else {
      renderCusdis();
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [lang]);

  const getCusdisLang = (l: string) => {
    switch (l) {
      case 'zh': return 'zh-cn';
      case 'ja': return 'ja';
      default: return 'en';
    }
  };

  return (
    <div className="w-full" key={lang}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <MessageSquareText className="w-6 h-6 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">FAN LOUNGE</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-500">{t.tag_no_login}</span>
        </div>
      </div>
      
      {/* Welcome Box */}
      <div className="mb-10 p-6 rounded-xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="w-12 h-12 text-amber-500" />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-white mb-2">{t.welcome_title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {t.welcome_p1}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t.welcome_p2}
          </p>
          <p className="text-amber-500/60 text-xs mt-4 italic">
            {t.welcome_note}
          </p>
        </div>
      </div>

      {/* Success Message Overlay */}
      {isSubmitted && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-gold/20 border border-gold/30 flex items-center gap-3 text-gold"
        >
          <Sparkles className="w-5 h-5" />
          <p className="text-sm font-medium">
            {lang === 'zh' ? '留言已送出！管理員審核通過後就會顯示。' : 
             lang === 'ja' ? 'コメントを送信しました！管理人の承認後に表示されます。' : 
             'Comment submitted! It will appear after moderation.'}
          </p>
        </motion.div>
      )}

      <div className="cusdis-container">
        <div
          ref={cusdisRef}
          id="cusdis_thread"
          data-host="https://cusdis.com"
          data-app-id="14de6220-7400-4e81-a30e-5cea977722ab"
          data-page-id="ponpon-chen-links"
          data-page-url={window.location.href}
          data-page-title="Ponpon Chen Links"
          data-theme="dark"
          data-lang={getCusdisLang(lang)}
        ></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        #cusdis_thread iframe {
          width: 100% !important;
          min-height: 500px;
          border: none !important;
          background: transparent !important;
        }
        .cusdis-container {
          width: 100%;
          min-height: 500px;
        }
      `}} />
    </div>
  );
};

export default CusdisComments;
