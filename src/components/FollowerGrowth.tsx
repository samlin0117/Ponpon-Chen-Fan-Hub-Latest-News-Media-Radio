import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Instagram, ExternalLink, Flag } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { followerHistory, followerProfile, FollowerDataPoint } from '../data/followerHistory';

const VIEW_W = 820;
const VIEW_H = 360;
const PAD = { top: 34, right: 26, bottom: 46, left: 62 };

const FollowerGrowth: React.FC = () => {
  const { t, lang } = useTranslation();
  const tr = (t as any).followerGrowth || {};

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

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
        notes: rows.filter((r) => noteText(r.note)).map((r) => ({ date: r.date, text: noteText(r.note) })),
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
        pct: m.base > 0 ? Math.round((m.gain / m.base) * 1000) / 10 : 0,
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
        </div>

        {/* Chart */}
        <div className="relative w-full overflow-hidden">
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
                {/* 綠色區段裡標出當月增加的比例 */}
                {b.gain > 0 && (
                  <text
                    x={b.cx}
                    y={b.yTotal + (b.gainH >= 26 ? b.gainH / 2 + 4 : b.gainH + 16)}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill={b.gainH >= 26 ? '#04301f' : '#34d399'}
                    fontFamily="ui-monospace, monospace"
                  >
                    +{b.pct}%
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

            {/* Annotation flags */}
            {annotations.map((a, k) => (
              <g key={`ann-${k}`}>
                <line
                  x1={a.cx}
                  x2={a.cx}
                  y1={PAD.top - 20}
                  y2={a.yTotal - 24}
                  stroke="#e8cfa6"
                  strokeOpacity={0.5}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <circle cx={a.cx} cy={PAD.top - 20} r={9} fill="#0a0a0a" stroke="#e8cfa6" strokeWidth={1.5} />
                <text x={a.cx} y={PAD.top - 16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#e8cfa6" fontFamily="ui-monospace, monospace">
                  {k + 1}
                </text>
              </g>
            ))}

            {/* Hover tooltip */}
            {active && (
              <g transform={`translate(${Math.min(Math.max(active.cx, PAD.left + 64), VIEW_W - PAD.right - 64)}, ${Math.max(active.yTotal - 78, PAD.top)})`}>
                <rect x={-62} y={0} width={124} height={56} rx={8} fill="#0a0a0a" stroke="#ffffff" strokeOpacity={0.12} />
                <text x={0} y={19} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff" fontFamily="ui-monospace, monospace">
                  {nf.format(active.total)}
                </text>
                <text x={0} y={36} textAnchor="middle" fontSize={11} fill="#34d399" fontFamily="ui-monospace, monospace">
                  +{nf.format(active.gain)} ({active.pct > 0 ? '+' : ''}{active.pct}%)
                </text>
                <text x={0} y={50} textAnchor="middle" fontSize={10} fill="#9a9a9a" fontFamily="ui-monospace, monospace">
                  {fmtMonth(active.key)}
                </text>
              </g>
            )}
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
                <li key={`note-${k}`} className="flex gap-3 text-sm">
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
    </motion.div>
  );
};

export default FollowerGrowth;
