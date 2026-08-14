import React, { useState } from 'react';
import { Play, Disc, Radio, Newspaper, ExternalLink, Globe, Sparkles, ChevronRight, Music, Heart, Award, ArrowUpRight, Youtube } from 'lucide-react';

interface TimelineItem {
  year: string;
  title: string;
  desc: string;
  category: 'all' | 'first' | 'album';
  links?: { text: string; url: string }[];
}

const timelineItems: TimelineItem[] = [
  {
    year: '2026年8月',
    title: '首次紐約公開演出',
    category: 'first',
    desc: '在紐約知名爵士俱樂部 Birdland Theater 登上《Frank Vignola\'s Guitar Night》舞台擔任特邀嘉賓，帶來吉他、歌聲與口哨即興演奏。',
    links: [
      { text: '點此觀看演出精華', url: 'https://www.youtube.com/watch?v=gUXx6-WK-V0' }
    ]
  },
  {
    year: '2026',
    title: '全新創作專輯籌備與發行預告',
    category: 'album',
    desc: '宣告即將推出籌備多時的全新概念專輯，融合當代爵士、民謠與流行跨界聲響，展現更加成熟純熟的音樂風貌。',
    links: [
      { text: '搶先收聽首波先行曲', url: 'https://ponponchen.com' }
    ]
  },
  {
    year: '2025年9月',
    title: '首次北加州（灣區）售票演出',
    category: 'first',
    desc: '在舊金山（灣區）知名爵士俱樂部 Biscuits & Blues 舉辦首次北加州售票演出，這場演出受到當地台灣僑胞的極大歡迎，門票迅速搶光，從原本的 1 場加開到 3 場且全數爆滿，在她的職涯中具有極大的指標意義。',
    links: [
      { text: '點此觀看演出精華', url: 'https://www.youtube.com/watch?v=0h7L_Z6C-8k' }
    ]
  },
  {
    year: '2025年4月',
    title: '第一次在公開演出場合表演 WASHBOARD',
    category: 'first',
    desc: '於洛杉磯 Cicada Restaurant and Lounge 的現場演出中，首次加入 Washboard (洗衣板) 進行演奏。',
    links: [
      { text: '點此觀看演出精華', url: 'https://www.youtube.com/watch?v=2eE7I9H6-0Q' }
    ]
  },
  {
    year: '2024',
    title: '國際爵士音樂節巡演熱烈展開',
    category: 'all',
    desc: '受邀至多個國際爵士舞台，以精湛的吉他指彈與清澈悠揚的嗓音驚豔海內外樂迷，獲得國際樂評一致盛讚。'
  },
  {
    year: '2023',
    title: '個人首張創作專輯《Beginning》',
    category: 'album',
    desc: '發行首張個人創作專輯，收錄多首代表性原創曲目，空降各大獨立音樂榜單，確立新生代吉他創作女聲地位。'
  },
  {
    year: '2022',
    title: '初聲啼試・從網路走到聚光燈下',
    category: 'all',
    desc: '憑藉吉他彈唱與自創口哨即興演奏在社群引發熱烈迴響，正式展開個人專業音樂人旅程。'
  }
];

export default function App() {
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'first' | 'album'>('all');

  const filteredTimelineItems = (() => {
    const result = timelineItems.filter(item => {
      if (timelineFilter === 'all') return item.category !== 'first' && item.category !== 'album';
      return item.category === timelineFilter;
    });
    if (timelineFilter === 'first') return [...result].reverse();
    return result;
  })();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* 導覽列 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/80 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-serif tracking-widest text-2xl font-bold text-amber-400">PONPON</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-300">
            <a href="#home" className="hover:text-amber-400 transition">首頁</a>
            <a href="#about" className="hover:text-amber-400 transition">關於</a>
            <a href="#milestones" className="hover:text-amber-400 transition text-amber-400 font-semibold">里程碑</a>
            <a href="#news" className="hover:text-amber-400 transition">新聞報導</a>
            <a href="#radio" className="hover:text-amber-400 transition">廣播訪問</a>
            <a href="#media" className="hover:text-amber-400 transition">影音專區</a>
            <a href="#links" className="hover:text-amber-400 transition">相關連結</a>
          </nav>
        </div>
      </header>

      {/* 里程碑主要區塊 */}
      <main id="milestones" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white mb-3">
            里程碑
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            Ponpon 從初心到躍上國際的音樂旅程
          </p>

          {/* 篩選標籤按鈕 */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setTimelineFilter('album')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition flex items-center gap-2 border ${
                timelineFilter === 'album'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              NEW ALBUM 2026
            </button>
            <button
              onClick={() => setTimelineFilter('all')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition border ${
                timelineFilter === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              全部里程碑
            </button>
            <button
              onClick={() => setTimelineFilter('first')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition border ${
                timelineFilter === 'first'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              解鎖第一次
            </button>
          </div>
        </div>

        {/* 時間軸卡片展示區 */}
        <div className="relative border-l border-neutral-800 ml-4 sm:ml-32 space-y-12">
          {filteredTimelineItems.map((item, idx) => (
            <div key={idx} className="relative pl-6 sm:pl-8 group">
              {/* 節點光點 */}
              <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-neutral-950 group-hover:scale-125 transition" />

              {/* 年份標籤 */}
              <div className="inline-block px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-semibold text-amber-400 mb-2">
                {item.year}
              </div>

              {/* 內容卡片 */}
              <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 hover:border-amber-500/30 transition shadow-xl">
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>
                {item.links && item.links.map((link, lIdx) => (
                  <a
                    key={lIdx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-amber-400 hover:text-amber-300 transition"
                  >
                    <span>➔ {link.text}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
