import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Instagram, TrendingUp, ExternalLink, Flag } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { followerHistory, followerProfile, FollowerDataPoint } from '../data/followerHistory';

const VIEW_W = 820;
const VIEW_H = 360;
const PAD = { top: 28, right: 26, bottom: 46, left: 62 };

const toMs = (d: string) => new Date(d + 'T00:00:00Z').getTime();

const FollowerGrowth: React.FC = () => {
  const { t, lang } = useTranslation();
  const tr = (t as any).followerGrowth || {};

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const data = followerHistory;
  const first = data[0];
  const last = data[data.length - 1];
  const gained = last.followers - first.followers;
  const gainedPct = Math.round((gained / first.followers) * 1000) / 10;

  const locale = lang === 'zh' ? 'zh-TW' : lang === 'ja' ? 'ja-JP' : 'en-US';
  const nf = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const noteText = (n: FollowerDataPoint['note']): string => {
    if (!n) return '';
    if (typeof n === 'string') return n;
    return n[lang as 'zh' | 'en' | 'ja'] || n.zh || n.en || n.ja || '';
  };

  const { points, xTicks, yTicks, areaPath, linePath, xMin, xSpan, yMin, ySpan } = useMemo(() => {
    const xs = data.map((d) => toMs(d.date));
    const ys = data.map((d) => d.followers);
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const xSpan = Math.max(1, xMax - xMin);

    const rawMin = Math.min(...ys);
    const rawMax = Math.max(...ys);
    const yMin = Math.max(0, Math.floor((rawMin - (rawMax - rawMin) * 0.15) / 1000) * 1000);
    const yMax = Math.ceil((rawMax + (rawMax - rawMin) * 0.12) / 1000) * 1000;
    const ySpan = Math.max(1, yMax - yMin);

    const plotW = VIEW_W - PAD.left - PAD.right;
    const plotH = VIEW_H - PAD.top - PAD.bottom;
    const sx = (ms: number) => PAD.left + ((ms - xMin) / xSpan) * plotW;
    const sy = (v: number) => PAD.top + plotH - ((v - yMin) / ySpan) * plotH;

    const points = data.map((d) => ({ ...d, cx: sx(toMs(d.date)), cy: sy(d.followers) }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.cx.toFixed(1)},${p.cy.toFixed(1)}`).join(' ');
    const areaPath =
      `M${points[0].cx.toFixed(1)},${(PAD.top + plotH).toFixed(1)} ` +
      points.map((p) => `L${p.cx.toFixed(1)},${p.cy.toFixed(1)}`).join(' ') +
      ` L${points[points.length - 1].cx.toFixed(1)},${(PAD.top + plotH).toFixed(1)} Z`;

    // Y gridlines
    const yTicks = Array.from({ length: 5 }, (_, i) => {
      const v = yMin + (ySpan / 4) * i;
      return { v, y: sy(v) };
    });

    // X ticks — 6 evenly spaced by time; format depends on span
    const spanDays = xSpan / 86400000;
    const fmtX = (ms: number) => {
      const dt = new Date(ms);
      if (spanDays <= 80) {
        return lang === 'en'
          ? dt.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', timeZone: 'UTC' })
          : `${dt.getUTCMonth() + 1}/${dt.getUTCDate()}`;
      }
      return lang === 'en'
        ? dt.toLocaleDateString('en-US', { year: '2-digit', month: 'short', timeZone: 'UTC' })
        : `${dt.getUTCFullYear()}/${dt.getUTCMonth() + 1}`;
    };
    const tickCount = Math.min(6, data.length);
    const xTicks = Array.from({ length: tickCount }, (_, i) => {
      const ms = xMin + (xSpan / (tickCount - 1 || 1)) * i;
      return { label: fmtX(ms), x: sx(ms) };
    });

    return { points, xTicks, yTicks, areaPath, linePath, xMin, xSpan, yMin, ySpan };
  }, [data, lang]);

  const active = hoverIdx != null ? points[hoverIdx] : null;

  const annotations = points
    .map((p, i) => ({ ...p, i, text: noteText(p.note) }))
    .filter((p) => p.text);

  const handleMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const ms = xMin + ratio * xSpan;
    let nearest = 0;
    let best = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(toMs(p.date) - ms);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setHoverIdx(nearest);
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
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 self-start sm:self-auto">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">
              +{nf.format(gained)} ({gainedPct > 0 ? '+' : ''}{gainedPct}%)
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="relative w-full overflow-hidden">
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-auto" role="img" aria-label={tr.title || 'Follower growth chart'}>
            <defs>
              <linearGradient id="fgArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c5a059" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#c5a059" stopOpacity="0" />
              </linearGradient>
            </defs>

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

            {/* X labels */}
            {xTicks.map((tk, i) => (
              <text key={i} x={tk.x} y={VIEW_H - PAD.bottom + 22} textAnchor="middle" fontSize={12} fill="#8a8a8a" fontFamily="ui-monospace, monospace">
                {tk.label}
              </text>
            ))}

            {/* Area + line */}
            <path d={areaPath} fill="url(#fgArea)" />
            <motion.path
              d={linePath}
              fill="none"
              stroke="#c5a059"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />

            {/* Endpoint dot */}
            <circle cx={last ? points[points.length - 1].cx : 0} cy={last ? points[points.length - 1].cy : 0} r={4} fill="#e8cfa6" />

            {/* Annotation flags */}
            {annotations.map((a, k) => (
              <g key={`ann-${a.i}`}>
                <line
                  x1={a.cx}
                  x2={a.cx}
                  y1={PAD.top + 4}
                  y2={a.cy}
                  stroke="#e8cfa6"
                  strokeOpacity={0.5}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <circle cx={a.cx} cy={PAD.top + 4} r={9} fill="#0a0a0a" stroke="#e8cfa6" strokeWidth={1.5} />
                <text x={a.cx} y={PAD.top + 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#e8cfa6" fontFamily="ui-monospace, monospace">
                  {k + 1}
                </text>
              </g>
            ))}

            {/* Hover marker */}
            {active && (
              <g>
                <line x1={active.cx} x2={active.cx} y1={PAD.top} y2={VIEW_H - PAD.bottom} stroke="#c5a059" strokeOpacity={0.4} strokeWidth={1} />
                <circle cx={active.cx} cy={active.cy} r={5} fill="#c5a059" stroke="#0a0a0a" strokeWidth={2} />
                <g transform={`translate(${Math.min(Math.max(active.cx, PAD.left + 60), VIEW_W - PAD.right - 60)}, ${PAD.top + 6})`}>
                  <rect x={-58} y={-2} width={116} height={44} rx={8} fill="#0a0a0a" stroke="#ffffff" strokeOpacity={0.12} />
                  <text x={0} y={15} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff" fontFamily="ui-monospace, monospace">
                    {nf.format(active.followers)}
                  </text>
                  <text x={0} y={32} textAnchor="middle" fontSize={10} fill="#9a9a9a" fontFamily="ui-monospace, monospace">
                    {fmtFullDate(active.date)}
                  </text>
                </g>
              </g>
            )}

            {/* Hover capture */}
            <rect
              x={PAD.left}
              y={PAD.top}
              width={VIEW_W - PAD.left - PAD.right}
              height={VIEW_H - PAD.top - PAD.bottom}
              fill="transparent"
              onMouseMove={handleMove}
              onMouseLeave={() => setHoverIdx(null)}
            />
          </svg>
        </div>

        {/* Key moments */}
        {annotations.length > 0 && (
          <div className="mt-6 border-t border-white/5 pt-5">
            <div className="flex items-center gap-2 text-gold-light/80 mb-3">
              <Flag className="w-3.5 h-3.5" />
              <span className="text-xs uppercase tracking-widest">{tr.keyMoments || 'Key moments'}</span>
            </div>
            <ul className="space-y-2.5">
              {annotations.map((a, k) => (
                <li key={`note-${a.i}`} className="flex gap-3 text-sm">
                  <span className="shrink-0 w-5 h-5 rounded-full border border-gold/40 text-gold-light text-[11px] font-mono flex items-center justify-center mt-0.5">
                    {k + 1}
                  </span>
                  <span className="text-gray-400 leading-relaxed">
                    <span className="text-gray-500 font-mono text-xs mr-2">{fmtFullDate(a.date)}</span>
                    {a.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-[11px] text-gray-600 mt-5 leading-relaxed">
          {tr.note ||
            'Follower counts are recorded once a month. August 2026 is shown daily to capture the breakout.'}{' '}
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
    </motion.div>
  );
};

export default FollowerGrowth;
