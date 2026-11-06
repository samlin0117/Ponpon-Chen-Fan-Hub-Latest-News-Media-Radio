import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

// 遊戲清單。新增遊戲時：檔案放進 public/game，這裡加一筆，三個語系檔的 games.list 也各加一筆
const GAMES = [
  { id: 'bubble', href: '/game/bubble.html', image: '/game/img/ponpon-figure.webp' },
];

export default function Games() {
  const { t, lang } = useTranslation();
  const tr = (t as any).games || {};

  return (
    <div className="py-12 md:py-32 bg-dark relative min-h-[calc(100vh-80px)]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-xs font-mono text-gold tracking-[0.3em] uppercase mb-4 block">{tr.subtitle}</span>
          <h1 className="text-4xl md:text-6xl font-serif mb-6">{tr.title}</h1>
          <p className="text-gray-400 font-light max-w-2xl mx-auto text-lg leading-relaxed">{tr.intro}</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8">
          {GAMES.map((game) => {
            const info = tr.list?.[game.id] || {};
            return (
              <a
                key={game.id}
                href={`${game.href}?lang=${lang}`}
                className="group w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-gold/60 transition-colors"
              >
                <img src={game.image} alt={info.name} width={800} height={800} loading="lazy" className="w-full aspect-square object-cover" />
                <div className="p-6">
                  <h2 className="text-2xl font-serif text-white mb-2">{info.name}</h2>
                  <p className="text-gray-400 leading-relaxed mb-5">{info.desc}</p>
                  <span className="inline-flex items-center gap-2 text-sm tracking-[0.15em] text-gold">
                    {tr.play}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-500 mt-12">{tr.note}</p>
      </div>
    </div>
  );
}
