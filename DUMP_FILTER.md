=== All timelineFilter occurrences in App.tsx ===
{ |   const { t, lang, setLang } = useTranslation(); |   const [timelineFilter, setTimelineFilter] = useState<'all' | 'first' | 'album'>('all'); |   const timelineItems = t.timelineItems
teredTimelineItems = timelineItems.filter(item => { |     if (timelineFilter === 'all') return item.category !== 'first' && item.category !== 'album'; |     return item.category === ti
 && item.category !== 'album'; |     return item.category === timelineFilter; |   }); |   const [isMenuOpen, setIsMenuOpen] = useState(false); |   const [activeVideoTab, setActiveVideoTab]
wider transition-all duration-300 flex items-center gap-2 ${timelineFilter === 'album' |                           ? 'bg-gold text-dark shadow-[0_0_20px_rgba(212,175,55,0.4)]' |       
assName={`px-6 py-2 rounded-full border transition-colors ${timelineFilter === 'all' |                           ? 'bg-gold/20 border-gold text-gold-light' |                           
assName={`px-6 py-2 rounded-full border transition-colors ${timelineFilter === 'first' |                           ? 'bg-gold/20 border-gold text-gold-light' |                         

=== category: values in App.tsx ===

=== category values in zh.json ===
{'first', 'album', 'normal'}

=== milestone entries with year 2026 or 2025 (zh.json) with full context ===
{
      "year": "2025",
      "title": "躍上國際媒體與大師結緣",
      "desc": "5月受邀為美國 <strong>ABC News</strong>《World News Now》演出改編片尾曲，影片突破百萬點閱。<a href=\"https://www.youtube.com/watch?v=1Fnnr4TOjVQ&list=PLLwWHVIUlB8lzbav-7ETbHfJhDqZDOkJj&index=5\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-gold hover:text-gold-light hover:underline transition-colors whitespace-nowrap ml-1\">➜ 點此觀看演出精華</a><br/><br/>年底受邀洛杉磯年度盛事，與葛萊美得主 Randy Waldman 同台演出。<a href=\"https://www.youtube.com/watch?v=HCUE2cDCOqs&
---
{
      "year": "2026",
      "title": "首張爵士專輯與榮膺 Gibson 年度焦點藝術家",
      "desc": "匯聚十載音樂底蘊與旅美淬鍊，即將發行首張個人英文爵士錄音室專輯，開啟演藝生涯嶄新篇章。同年琴藝深獲國際頂尖琴廠肯定，受邀擔任 <a href='https://www.gibson.com/blogs/gibson-gazette/ponpon-joins-the-gibson-artist-spotlight-program' target='_blank' rel='noopener noreferrer' class='text-gold hover:text-gold-light hover:underline transition-colors'><strong>Gibson</strong> 2026 年度焦點藝術家</a>，展現新世代爵士女伶的國際影響力。",
      "category": "normal"
    }
---