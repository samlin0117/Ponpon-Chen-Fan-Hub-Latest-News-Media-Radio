// 2026 臺北爵士音樂節返台記者會（2026-10-06）後的其他媒體報導。
// 內容大多是同一份新聞稿改寫，所以新聞頁只為較完整的幾篇做卡片（壹蘋、噓！星聞、Party Star），
// 其餘收在卡片下方可展開的精簡清單裡：媒體名稱 + 原文標題 + 連結。
// 依刊出時間由新到舊排列；date 為台灣時間。新增時直接加一筆即可，數量會自動更新。
// 只收各家自己的稿子：內容九成以上相同的轉載（例如匯流稿被 OwlNews、獨家報導等轉貼，
// 或同一份新聞稿在兩個網站一字不差刊登）只留一家，盡量保留原始出處或內容較完整的那一篇。

export interface PressMention {
  date: string; // YYYY-MM-DD（台灣時間）
  outlet: string;
  title: string; // 原文標題（中文）
  url: string;
}

export const taipeiJazz2026Coverage: PressMention[] = [
  { date: '2026-10-08', outlet: '銀河網路', title: 'Ponpon陳芃瑄合體「臺灣鼓王」黃瑞豐演出 為《臺北爵士音樂節》20週年慶生!', url: 'https://www.iwant-radio.com/showinformation.php?sisn=61855' },
  { date: '2026-10-07', outlet: 'udn 女子漾', title: '《2026臺北爵士音樂節》20週年登場！台北週末免費聽3天 國際大咖、Ponpon、許郁瑛都來了', url: 'https://woman.udn.com/woman/story/123164/9800024' },
  { date: '2026-10-07', outlet: '墨新聞', title: '2026 臺北爵士音樂節 20 週年 Ponpon 陳芃瑄帶樂團返台獻唱', url: 'https://more-news.tw/736818/' },
  { date: '2026-10-07', outlet: 'LIFE 生活網', title: '《聲林之王2》踢館魔王Ponpon首度返台演出！17歲獲陶喆一句話點醒 赴美深造闖進國際爵士樂壇', url: 'https://life.tw/article/聲林之王2-踢館魔王ponpon首度返台演出-17歲獲陶喆一-3171771' },
  { date: '2026-10-07', outlet: '自由時報', title: '陶喆一句話 激發陳芃瑄赴美追音樂夢', url: 'https://ent.ltn.com.tw/news/paper/1773506' },
  { date: '2026-10-07', outlet: '立報傳媒', title: 'Ponpon陳芃瑄返台登北爵20週年 10/10率美國樂隊首唱未公開新歌', url: 'https://www.limedia.tw/fea/74425/' },
  { date: '2026-10-07', outlet: '樂手巢', title: '《聲林之王2》踢館魔王躍升國際爵士樂壇，「臺灣之光」Ponpon 陳芃瑄返臺首場演出獻給「2026臺北爵士音樂節」', url: 'https://ysolife.com/2026-taipei-jazz-festival-with-ponpon-short-interview/' },
  { date: '2026-10-07', outlet: '太報', title: '《聲林之王2》踢館魔王把ABC News當詐騙 Ponpon解鎖獨門特技', url: 'https://www.taisounds.com/news/content/107/292579' },
  { date: '2026-10-06', outlet: '迷迷音', title: '被 ABC News 讚賞的臺灣之光！Ponpon 陳芃瑄參演臺北爵士音樂節', url: 'https://memeon-music.com/2026/10/06/ponpon/' },
  { date: '2026-10-06', outlet: 'KISMETW 娛樂誌', title: 'Ponpon陳芃瑄首度帶團返台 2026臺北爵士音樂節20週年同台黃瑞豐', url: 'https://kismetw.com/ponpon-taipei-jazz-festival-2026/' },
  { date: '2026-10-06', outlet: '三立新聞網', title: '24歲天才歌手是她！《聲林》陶喆1句話神助攻 赴美追夢成「台灣之光」', url: 'https://www.setn.com/ampnews/1918377' },
  { date: '2026-10-06', outlet: '匯流新聞網', title: '24歲旅美歌手陳芃瑄返台 登台北爵士音樂節舞台首唱新歌', url: 'https://cnews.com.tw/204261006a06/' },
  { date: '2026-10-06', outlet: '緯來新聞網', title: '「台灣之光」貴人是林宥嘉、陶喆　陳芃瑄爵士唱得美國人也屈服', url: 'https://news.videoland.com.tw/article/853da524-26e0-4be5-9cbc-783eccb5dd01.html' },
  { date: '2026-10-06', outlet: '自由電子報', title: '選秀踢館魔王唱向美國誤把ABC News邀約當詐騙 陶喆1句話助她追夢', url: 'https://ent.ltn.com.tw/news/breakingnews/5597628' },
  { date: '2026-10-06', outlet: 'JUKSY 街星', title: '臺北爵士音樂節20週年登場！Ponpon 陳芃瑄領軍，率領國際爵士名家齊聚北流！', url: 'https://www.juksy.com/article/152472' },
  { date: '2026-10-06', outlet: 'ETtoday 星光雲', title: '《聲林2》踢館魔王變台灣之光！　收ABC邀約竟不敢點開：以為詐騙', url: 'https://star.ettoday.net/amp/3250192' },
  { date: '2026-10-06', outlet: '大時事', title: 'Ponpon陳芃瑄從《聲林之王》踢館魔王唱進國際 載譽返臺唱進爵士音樂節', url: 'https://bigtimes.net/archives/134583' },
  { date: '2026-10-06', outlet: '鏡週刊', title: '接到美國ABC News邀請 Ponpon陳芃瑄一度以為是被詐騙集團盯上', url: 'https://www.mirrormedia.mg/story/20261006-194ent-181113' },
  { date: '2026-10-06', outlet: '中時新聞網', title: '《聲林之王2》踢館魔王赴美爆紅！女星險遭男同學「騷擾」', url: 'https://www.chinatimes.com/realtimenews/20261006003978-260404' },
  { date: '2026-10-06', outlet: '鏡報', title: '《聲林之王》24歲女星紅到美國！突收ABC邀約「以為詐騙」 嚇到不敢點連結', url: 'https://www.mirrordaily.news/story/90021' },
  { date: '2026-10-06', outlet: 'TVBS 新聞網', title: '「台灣之光」曾把ABC邀約當詐騙！曝陶喆一句話成追夢關鍵', url: 'https://news.tvbs.com.tw/entertainment/music/4032458' },
  { date: '2026-10-06', outlet: '吹音樂', title: '2026臺北爵士音樂節20週年盛大舉辦！國際傳奇爵士好手齊聚北流、國慶連假三日登場', url: 'https://blow.streetvoice.com/90765/' },
];
