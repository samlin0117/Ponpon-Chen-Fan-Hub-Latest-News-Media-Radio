import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, ExternalLink, Play, Star, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { followerHistory, followerProfile, FollowerDataPoint } from '../data/followerHistory';

const VIEW_W = 820;
const VIEW_H = 360;
const PAD = { top: 34, right: 26, bottom: 46, left: 62 };
// 圖表上方重要事件星號圖示的 y 座標
const MARKER_Y = PAD.top - 20;
// 事件說明卡的寬度：最寬 320px，窄螢幕時左右各留 8px
const POP_W = 'min(320px, calc(100% - 16px))';

// 從 YouTube 網址取出影片 ID；/shorts/ 網址用直式播放視窗。不是 YouTube 就回傳 null（改用另開分頁）
const parseYouTube = (url: string): { id: string; vertical: boolean } | null => {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return { id: u.pathname.slice(1), vertical: false };
    if (!u.hostname.endsWith('youtube.com')) return null;
    const shorts = u.pathname.match(/^\/shorts\/([^/]+)/);
    if (shorts) return { id: shorts[1], vertical: true };
    const v = u.searchParams.get('v');
    return v ? { id: v, vertical: false } : null;
  } catch {
    return null;
  }
};

const FollowerGrowth: React.FC = () => {
  const { t, lang } = useTranslation();
  const tr = (t as any).followerGrowth || {};

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [openNote, setOpenNote] = useState<number | null>(null);
  // 先假設有滑鼠，掛載後再依裝置修正；手機沒有 hover，改用點擊開關事件說明
  const [canHover, setCanHover] = useState(true);
  const [playing, setPlaying] = useState<{ id: string; vertical: boolean } | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // 點到事件圖示與說明卡以外的地方、或按 Esc，就關掉說明卡
  useEffect(() => {
    if (openNote == null) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.('[data-note-ui]')) setOpenNote(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenNote(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openNote]);

  // 影片播放視窗開著時，按 Esc 關閉
  useEffect(() => {
    if (!playing) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlaying(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [playing]);

  const playVideo = (yt: { id: string; vertical: boolean }) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenNote(null);
    setPlaying(yt);
  };

  const showNote = (k: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenNote(k);
  };
  // 稍微延遲再關，讓滑鼠能從圖示移到說明卡上點連結
  const hideNoteSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenNote(null), 200);
  };

  const data = followerHistory;
  const last = data[data.length - 1];

  const locale = lang === 'zh' ? 'zh-TW' : lang === 'ja' ? 'ja-JP' : 'en-US';
  const nf = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const noteText = (n: FollowerDataPoint['note']): string => {
    if (!n) return '';
    if (typeof n === 'string') return n;
    return n[lang as 'zh' | 'en' | 'ja'] || n.zh || n.en || n.ja || '';
  };

  // 以「月」為單位彙整：每個月取當月最後一筆當作月底總粉絲數，
  // 當月新增 = 本月底 − 上月底（第一個月則用當月第一筆當基準）。
  const months = useMemo(() => {
    const byMonth = new Map<string, FollowerDataPoint[]>();
    data.forEach((d) => {
      const key = d.date.slice(0, 7);
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key)!.push(d);
    });

    const keys = Array.from(byMonth.keys()).sort();
    let prevTotal: number | null = null;

    return keys.map((key) => {
      const rows = byMonth.get(key)!;
      const end = rows[rows.length - 1];
      const base = prevTotal ?? rows[0].followers;
      const gain = Math.max(0, end.followers - base);
      prevTotal = end.followers;
      return {
        key,
        date: end.date,
        total: end.followers,
        base: end.followers - gain,
        gain,
        notes: rows.filter((r) => noteText(r.note)).map((r) => ({ date: r.date, text: noteText(r.note), link: r.link })),
      };
    });
  }, [data, lang]);

  const { bars, yTicks } = useMemo(() => {
    const plotW = VIEW_W - PAD.left - PAD.right;
    const plotH = VIEW_H - PAD.top - PAD.bottom;
    const yMax = Math.ceil((Math.max(...months.map((m) => m.total)) * 1.12) / 5000) * 5000;
    const sy = (v: number) => PAD.top + plotH - (v / yMax) * plotH;

    const slot = plotW / months.length;
    const barW = Math.min(88, slot * 0.52);

    const bars = months.map((m, i) => {
      const cx = PAD.left + slot * (i + 0.5);
      return {
        ...m,
        i,
        cx,
        x: cx - barW / 2,
        w: barW,
        yTotal: sy(m.total),
        yBase: sy(m.base),
        baseH: Math.max(0, PAD.top + plotH - sy(m.base)),
        gainH: Math.max(0, sy(m.base) - sy(m.total)),
      };
    });

    const yTicks = Array.from({ length: 5 }, (_, i) => {
      const v = (yMax / 4) * i;
      return { v, y: sy(v) };
    });

    return { bars, yTicks };
  }, [months]);

  const active = hoverIdx != null ? bars[hoverIdx] : null;

  const annotations = bars.flatMap((b) => b.notes.map((n) => ({ ...n, cx: b.cx, yTotal: b.yTotal })));
  const openAnn = openNote != null ? annotations[openNote] : null;
  const openAnnYT = openAnn?.link ? parseYouTube(openAnn.link) : null;

  const fmtMonth = (key: string) => {
    const [y, m] = key.split('-');
    if (lang === 'en') {
      return new Date(`${key}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
    }
    return lang === 'ja' ? `${y}年${Number(m)}月` : `${y}/${Number(m)}`;
  };

  const fmtFullDate = (d: string) => {
    const dt = new Date(d + 'T00:00:00Z');
    return dt.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto"
    >
      {/* Header / current stats */}
      <div className="bg-dark-lighter/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-gold-light/80 mb-2">
              <Instagram className="w-4 h-4" />
              <a
                href={followerProfile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono tracking-widest hover:text-gold transition-colors inline-flex items-center gap-1"
              >
                @{followerProfile.handle}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-4xl md:text-5xl font-serif text-white leading-none">
              {nf.format(last.followers)}
            </div>
            <div className="text-xs text-gray-500 mt-2 uppercase tracking-widest">{tr.current || 'Followers'}</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-3 text-xs text-gray-400">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#c5a059]" />
            {tr.totalLabel || 'Total followers'}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-emerald-400" />
            {tr.monthlyGain || 'Gained this month'}
          </span>
          {annotations.length > 0 && (
            <span className="inline-flex items-center gap-2">
              <Star className="w-3 h-3 text-gold-light fill-current" />
              <span>
                {tr.eventLegend || 'A key moment that brought in new followers'}
                <span className="text-gray-500">
                  {canHover ? tr.eventHintHover || ' (hover over the icon for details)' : tr.eventHintTap || ' (tap the icon for details)'}
                </span>
              </span>
            </span>
          )}
        </div>

        {/* Chart（不裁切外框，事件說明卡在手機上可能超出圖表高度） */}
        <div className="relative w-full">
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-auto" role="img" aria-label={tr.title || 'Follower growth chart'}>
            {/* Y grid + labels */}
            {yTicks.map((tk, i) => (
              <g key={i}>
                <line
                  x1={PAD.left}
                  x2={VIEW_W - PAD.right}
                  y1={tk.y}
                  y2={tk.y}
                  stroke="#ffffff"
                  strokeOpacity={0.06}
                  strokeWidth={1}
                />
                <text x={PAD.left - 12} y={tk.y + 4} textAnchor="end" fontSize={12} fill="#8a8a8a" fontFamily="ui-monospace, monospace">
                  {nf.format(Math.round(tk.v))}
                </text>
              </g>
            ))}

            {/* Bars: base = carried over, top = gained this month */}
            {bars.map((b) => (
              <g
                key={b.key}
                onMouseEnter={() => setHoverIdx(b.i)}
                onMouseLeave={() => setHoverIdx(null)}
                style={{ cursor: 'pointer' }}
              >
                <motion.rect
                  x={b.x}
                  width={b.w}
                  fill="#c5a059"
                  fillOpacity={active && active.i !== b.i ? 0.45 : 0.85}
                  initial={{ y: PAD.top + (VIEW_H - PAD.top - PAD.bottom), height: 0 }}
                  animate={{ y: b.yBase, height: b.baseH }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
                <motion.rect
                  x={b.x}
                  width={b.w}
                  fill="#34d399"
                  fillOpacity={active && active.i !== b.i ? 0.5 : 0.95}
                  rx={3}
                  initial={{ y: b.yBase, height: 0 }}
                  animate={{ y: b.yTotal, height: b.gainH }}
                  transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
                />
                <text
                  x={b.cx}
                  y={b.yTotal - 10}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={700}
                  fill="#e8cfa6"
                  fontFamily="ui-monospace, monospace"
                >
                  {nf.format(b.total)}
                </text>
                {/* 綠色區段裡標出當月新增的人數 */}
                {b.gain > 0 && (
                  <text
                    x={b.cx}
                    y={b.yTotal + (b.gainH >= 16 ? b.gainH / 2 + 4 : b.gainH + 16)}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill={b.gainH >= 16 ? '#04301f' : '#34d399'}
                    fontFamily="ui-monospace, monospace"
                  >
                    +{nf.format(b.gain)}
                  </text>
                )}
                <text x={b.cx} y={VIEW_H - PAD.bottom + 22} textAnchor="middle" fontSize={12} fill="#8a8a8a" fontFamily="ui-monospace, monospace">
                  {fmtMonth(b.key)}
                </text>
                {/* 觸控 / 滑鼠感應範圍 */}
                <rect
                  x={b.cx - (VIEW_W - PAD.left - PAD.right) / bars.length / 2}
                  y={PAD.top}
                  width={(VIEW_W - PAD.left - PAD.right) / bars.length}
                  height={VIEW_H - PAD.top - PAD.bottom}
                  fill="transparent"
                  onClick={() => setHoverIdx(hoverIdx === b.i ? null : b.i)}
                />
              </g>
            ))}

            {/* 重要事件：從星號圖示拉一條虛線到該月柱子（圖示本身畫在下方的按鈕裡） */}
            {annotations.map((a, k) => (
              <line
                key={`ann-${k}`}
                x1={a.cx}
                x2={a.cx}
                y1={MARKER_Y}
                y2={a.yTotal - 24}
                stroke="#e8cfa6"
                strokeOpacity={0.5}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            ))}

            {/* Hover tooltip */}
            {active && (
              <g transform={`translate(${Math.min(Math.max(active.cx, PAD.left + 64), VIEW_W - PAD.right - 64)}, ${Math.max(active.yTotal - 78, PAD.top)})`}>
                <rect x={-62} y={0} width={124} height={56} rx={8} fill="#0a0a0a" stroke="#ffffff" strokeOpacity={0.12} />
                <text x={0} y={19} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff" fontFamily="ui-monospace, monospace">
                  {nf.format(active.total)}
                </text>
                <text x={0} y={36} textAnchor="middle" fontSize={11} fill="#34d399" fontFamily="ui-monospace, monospace">
                  +{nf.format(active.gain)}
                </text>
                <text x={0} y={50} textAnchor="middle" fontSize={10} fill="#9a9a9a" fontFamily="ui-monospace, monospace">
                  {fmtMonth(active.key)}
                </text>
              </g>
            )}
          </svg>

          {/* 重要事件星號圖示：用 HTML 畫，手機上不會跟著圖表縮小；感應範圍比圖示大，手機上也點得到 */}
          {annotations.map((a, k) => (
            <button
              key={`ann-btn-${k}`}
              type="button"
              data-note-ui
              aria-label={`${tr.keyMoments || 'Key moments'} ${fmtFullDate(a.date)}`}
              aria-expanded={openNote === k}
              className="group absolute w-9 h-9 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
              style={{ left: `${(a.cx / VIEW_W) * 100}%`, top: `${(MARKER_Y / VIEW_H) * 100}%` }}
              onMouseEnter={() => canHover && showNote(k)}
              onMouseLeave={() => canHover && hideNoteSoon()}
              onClick={() => (canHover || openNote !== k ? showNote(k) : setOpenNote(null))}
            >
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full border border-[#e8cfa6] transition-colors ${openNote === k ? 'bg-[#e8cfa6] text-[#0a0a0a]' : 'bg-[#0a0a0a] text-[#e8cfa6] group-hover:bg-[#e8cfa6]/15'}`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </span>
            </button>
          ))}

          {/* 事件說明卡：電腦版滑鼠移到圖示上出現，手機版點圖示開關 */}
          {openAnn && (
            <div
              data-note-ui
              role="dialog"
              aria-label={`${tr.keyMoments || 'Key moments'} ${fmtFullDate(openAnn.date)}`}
              className="absolute z-30 rounded-xl border border-gold/25 bg-[#0a0a0a]/95 backdrop-blur-sm p-4 shadow-2xl text-left"
              style={{
                width: POP_W,
                left: `clamp(8px, calc(${(openAnn.cx / VIEW_W) * 100}% - ${POP_W} / 2), calc(100% - ${POP_W} - 8px))`,
                top: `calc(${(MARKER_Y / VIEW_H) * 100}% + 22px)`,
              }}
              onMouseEnter={() => canHover && showNote(openNote!)}
              onMouseLeave={() => canHover && hideNoteSoon()}
            >
              <div className="flex items-center gap-2 text-gold-light/80 mb-2">
                <Star className="w-3.5 h-3.5 shrink-0 fill-current" />
                <span className="text-[11px] uppercase tracking-widest">{tr.keyMoments || 'Key moments'}</span>
                <span className="ml-auto text-[11px] font-mono text-gray-500">{fmtFullDate(openAnn.date)}</span>
                {!canHover && (
                  <button
                    type="button"
                    aria-label="Close"
                    className="-mr-1 p-1 text-gray-500 hover:text-white"
                    onClick={() => setOpenNote(null)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{openAnn.text}</p>
              {/* YouTube 影片在本頁跳出播放視窗；其他網站的連結另開分頁 */}
              {openAnnYT ? (
                <button
                  type="button"
                  onClick={() => playVideo(openAnnYT)}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold-light transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  {tr.watchVideo || 'Watch the video'}
                </button>
              ) : openAnn.link && (
                <a
                  href={openAnn.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold-light transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  {tr.watchVideo || 'Watch the video'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        <p className="text-[11px] text-gray-600 mt-5 leading-relaxed">
          {tr.note ||
            'Each bar is the follower count at the end of that month; the brighter top segment is what was gained during the month.'}{' '}
          {tr.source || 'Source'}:{' '}
          <a
            href="https://socialblade.com/instagram/user/ponponofficial_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/70 hover:text-gold transition-colors underline"
          >
            Social Blade
          </a>
          {' · '}
          {tr.updated || 'Updated'} {fmtFullDate(followerProfile.lastUpdated)}
        </p>
      </div>

      {/* 影片播放視窗：掛到 body 底下，不受外層動畫的 transform 影響 */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {playing && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setPlaying(null)}
                  className="absolute inset-0 bg-dark/90 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className={`relative bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden ${playing.vertical ? 'aspect-[9/16]' : 'w-full max-w-4xl aspect-video'}`}
                  // 直式影片：寬度最多 400px，且整個視窗高度不超出螢幕
                  style={playing.vertical ? { width: 'min(400px, 100%, calc((100dvh - 3rem) * 9 / 16))' } : undefined}
                >
                  <div className="absolute top-0 right-0 z-20 p-3">
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => setPlaying(null)}
                      className="p-2 rounded-full bg-black/60 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <iframe
                    src={`https://www.youtube.com/embed/${playing.id}?autoplay=1`}
                    title={tr.watchVideo || 'Watch the video'}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.div>
  );
};

export default FollowerGrowth;
