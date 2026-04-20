import { useState, useEffect } from 'react';
import { Youtube, Instagram, Facebook, Globe, Music, Mic2, AtSign, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import YouTubePlaylist from './components/YouTubePlaylist';
import GiscusComments from './components/GiscusComments';

type Language = 'zh' | 'en' | 'ja';

const translations = {
  zh: {
    nav: { home: "首頁", about: "關於", timeline: "里程碑", news: "新聞報導", interview: "廣播訪問", videos: "演出影片", links: "連結" },
    timeline: { title: "演藝里程碑", description: "Ponpon 從初心到躍上國際的音樂旅程" },
    hero: { title: "Ponpon Chen", subtitle: "爵士藝術家", slogan: "用靈魂的聲音，訴說每一個夜晚的故事。", disclaimer: "本站為粉絲用愛建立的非官方音樂典藏館。我們悉心收錄 Ponpon 音樂旅程中的廣播、專訪與現場演出，讓同好們能隨時駐足，自在回味那些觸動靈魂的聲音與點滴。" },
    about: { title: "關於 Ponpon", description: "在 Ponpon (陳芃瑄) 的音樂世界裡，樂器與人聲是沒有邊界的。她以富有渲染力的嗓音為基底，結合流暢的吉他伴奏，在旋律中自由穿梭。\n\n最令樂迷著迷的，莫過於她在現場演出中，能同時操縱清透的口哨、靈動的人聲即興 (Scatting) 與吉他撥奏，這種三位一體的同步演繹技術，已成為她最具辨識度的音樂標籤。2026 年即將發行首張爵士專輯，敬請期待這份細膩且強大的音樂能量。" },
    news: { title: "新聞報導", description: "來自各大媒體的報導與專訪。", article1: "2025-10-11 台音樂人陳芃瑄爵士吉他 登ABC平台 (原文：中文)", article1Desc: "年僅23歲的台灣音樂人陳芃瑄（Ponpon Chen），以獨特爵士吉他彈唱風格，登上美國ABC News...", source: "世界新聞網", article2: "2016-08-24 國民女孩金凱德奪雙冠 模特兒組帝后潛力無限 (原文：中文)", article2Desc: "演藝組的冠軍由14歲的陳芃瑄獲得，她是本屆年紀最小的得獎者，從小就嚮往當唱跳歌手...", source2: "中國時報", article3: "2025-07-18 台灣歌手陳芃瑄登美國新聞片尾 吉他彈唱魅力創百萬點閱 (原文：中文)", article3Desc: "23歲台灣歌手陳芃瑄一段90秒爵士樂演出，登上美國ABC News新聞片尾，網路上創造120萬點閱。主播介紹她「來自台灣，正在加州竄起的新生代爵士歌手」。", source3: "中央社 CNA", article4: "2025-07-27 Ponpon Chen performs news ‘Polka’ (原文：英文)", article4Desc: "「來自台灣，現在是加州正在崛起的新生代爵士樂手，這是 Ponpon Chen 和她的五重奏。」美國新聞節目 World News Now 的主播在片尾時如此介紹。", source4: "Taipei Times", article5: "2025-07-25 FEATURE/Ponpon does polka: Taiwanese jazz musician whistles, scats her way onto US news (原文：英文)", article5Desc: "台灣爵士音樂家陳芃瑄（Ponpon Chen）帶著電吉他與她的樂團，以獨特的風格重新演繹了美國音樂喜劇演員 Barry Mitchell 著名的短曲：「World News Polka」。", source5: "僑務電子報", article6: "2024-04-29 Meet Ponpon Chen | 歌手、爵士吉他手與創作人 (原文：英文)", article6Desc: "我們有幸與 Ponpon Chen 進行了交流。在過去的十年裡，她的音樂旅程充滿了各種不同的經歷——參加比賽、上電視、錄音、跨國合作...", source6: "SHOUTOUT LA", article7: "2025-07-18 台灣女生用爵士樂征服美國！陳芃瑄登ABC新聞片尾 吉他彈唱魅力創百萬點閱 (原文：中文)", article7Desc: "23歲台灣歌手陳芃瑄一段90秒爵士樂演出，登上美國ABC News新聞片尾，網路上創造120萬點閱。主播介紹她「來自台灣，正在加州竄起的新生代爵士歌手」。", source7: "壹蘋新聞網", article8: "2025-07-20 陳芃瑄吉他菜鳥變身爵士樂新秀 誤打誤撞結識大師 (原文：中文)", article8Desc: "23歲台灣女生陳芃瑄4年間從吉他菜鳥蛻變為美國爵士樂新秀，憑著不怕犯錯的精神，在異鄉獨自打拚，作品登上美國主流媒體，也意外與樂壇大師結識。", source8: "僑務電子報", article9: "2018-05-07 王源親自挑選台灣少女！「一對一合唱對視」害羞2度笑場 (原文：中文)", article9Desc: "大陸男團TFBOYS成員王源近日受邀出演節目《我想和你唱3》，錄影前一天親自打電話邀請粉絲到現場參與錄影，結果卻被無情的掛斷電話，讓他無奈嘆氣，還好最終仍順利邀請到3位粉絲。節目中另外找來6組人合作，並選出最後單獨合唱的對象，這個幸運兒就是來自台灣的女孩陳芃瑄。", source9: "ETtoday星光雲", article10: "2025-08-02 Heaven Raven 專訪：現居加州的台灣女孩陳芃瑄 (原文：中文)", article10Desc: "現居加州的台灣女孩陳芃瑄，今年五月受到美國廣播公司 (ABC) 邀請，以爵士樂改編傳統新聞片尾曲《World News Polka》之後，已在網上累積超過 120 萬次流量，也在 Threads 上備受討論，而今天 HR 很開心能連線位於美國的芃瑄，請她和我們分享這一切是如何開始的？", source10: "Heaven Raven", readMore: "閱讀全文" },
    interview: { title: "廣播訪問", description: "收聽 Ponpon 的最新專訪，深入了解她的音樂旅程。", rti1: "音樂本事 旅美爵士新星陳芃瑄 — 尋找靈魂深處的原創聲音（上）", rti2: "音樂本事 旅美爵士新星陳芃瑄 — 尋找靈魂深處的原創聲音（下）", rti1Date: "2026-03-16", rti2Date: "2026-03-23", pod1: "中廣流行網 Midnight You & Me - 專訪：陳芃瑄", pod1Date: "2026-03-08", podSource: "中廣流行網", listenNow: "點擊前往收聽" },
    videos: { title: "影音專區", description: "探索 Ponpon 的現場演出、訪談紀錄與生活分享。", p1: "現場演出與創作", p2: "短影音 Shorts", p3: "訪談紀錄", p4: "YouTuber 分享介紹", p5: "網友拍攝 (Fan Cam)" },
    links: { title: "關注 Ponpon", youtube: "YouTube", instagram: "Instagram", facebook: "Facebook", threads: "Threads", website: "官方網站" },
    comments: { title: "Fan Lounge / 粉絲留言板", description: "留下您的足跡與感受，讓這份音樂的交流在夜空下持續迴盪..." }
  },
  en: {
    nav: { home: "Home", about: "About", timeline: "Timeline", news: "News", interview: "Interview", videos: "Videos", links: "Links" },
    timeline: { title: "Milestones", description: "Ponpon's musical journey from her roots to the international stage" },
    hero: { title: "Ponpon Chen", subtitle: "Jazz Artist", slogan: "Telling the stories of every night with a soulful voice.", disclaimer: "An unofficial, fan-made archive dedicated to Ponpon's musical journey. We carefully curate her radio interviews, live performances, and precious moments, creating a cozy space for fans to linger, listen, and enjoy her soul-touching voice." },
    about: { title: "About Ponpon", description: "In the musical world of Ponpon (陳芃瑄), instruments and vocals know no boundaries. Using her evocative voice as a foundation and combining it with fluid guitar accompaniment, she moves freely through melodies.\n\nWhat fascinates fans most is her ability to simultaneously manipulate clear whistling, agile scatting, and guitar plucking during live performances. This \"three-in-one\" simultaneous performance technique has become her most recognizable musical signature. Her debut jazz album is set for release in 2026—stay tuned for this delicate yet powerful musical energy." },
    news: { title: "News & Press", description: "Media coverage and features.", article1: "2025-10-11 Taiwanese Musician Ponpon Chen Featured on ABC Platform (Original: Chinese)", article1Desc: "23-year-old Taiwanese musician Ponpon Chen brings her unique jazz guitar and vocal style to ABC News...", source: "World Journal", article2: "2016-08-24 Eelin Star Entertainment Group Champion Ponpon Chen (Original: Chinese)", article2Desc: "The Entertainment Group championship was won by 14-year-old Ponpon Chen, the youngest winner of this year, who has aspired to be a singer-dancer since childhood...", source2: "China Times", article3: "2025-07-18 Taiwanese Singer Ponpon Chen Featured on US News Outro, Guitar Performance Hits Million Views (Original: Chinese)", article3Desc: "A 90-second jazz performance by 23-year-old Taiwanese singer Ponpon Chen was featured at the end of an ABC News broadcast, generating 1.2 million views online...", source3: "CNA", article4: "2025-07-27 Ponpon Chen performs news ‘Polka’ (Original: English)", article4Desc: "\"Originally from Taiwan and now one of California’s rising young jazz artists, here is Ponpon Chen and her quintet,\" the announcer of US news program World News Now said...", source4: "Taipei Times", article5: "2025-07-25 FEATURE/Ponpon does polka: Taiwanese jazz musician whistles, scats her way onto US news (Original: English)", article5Desc: "Fronting her band with an electric guitar, Taiwanese jazz musician Ponpon Chen then broke into her unique rendition of American musical comedian Barry Mitchell's famous jingle...", source5: "OCAC News", article6: "2024-04-29 Meet Ponpon Chen | Singer, Jazz Guitarist & Songwriter (Original: English)", article6Desc: "We had the good fortune of connecting with Ponpon Chen and we've shared our conversation below. Over the past decade, my musical journey has been filled with diverse experiences...", source6: "SHOUTOUT LA", article7: "2025-07-18 Taiwanese Girl Conquers US with Jazz! Ponpon Chen Featured on ABC News Outro (Original: Chinese)", article7Desc: "A 90-second jazz performance by 23-year-old Taiwanese singer Ponpon Chen was featured at the end of an ABC News broadcast, generating 1.2 million views online...", source7: "Next Apple News", article8: "2025-07-20 Ponpon Chen Transforms from Guitar Novice to Jazz Rising Star, Unexpectedly Meets Masters (Original: Chinese)", article8Desc: "In just 4 years, 23-year-old Taiwanese girl Ponpon Chen transformed from a guitar novice to a rising jazz star in the US. With a fearless spirit, she worked hard abroad...", source8: "OCAC News", article9: "2018-05-07 Wang Yuan Personally Selects Taiwanese Girl! \"One-on-One Duet Eye Contact\" Makes Him Shyly Laugh Twice (Original: Chinese)", article9Desc: "TFBOYS member Wang Yuan was recently invited to appear on the show \"Come Sing with Me 3\". The day before recording, he personally called fans to invite them to the show, but was ruthlessly hung up on. Fortunately, he successfully invited 3 fans. The show also featured 6 groups for collaboration, and the final lucky girl chosen for a solo duet was Ponpon Chen from Taiwan.", source9: "ETtoday Star", article10: "2025-08-02 Heaven Raven Interview: Taiwanese Girl Ponpon Chen Living in California (Original: Chinese)", article10Desc: "Taiwanese girl Ponpon Chen, currently living in California, was invited by ABC this May to rearrange the traditional news outro \"World News Polka\" into jazz. It has accumulated over 1.2 million views online and sparked discussions on Threads. Today, HR is happy to connect with Ponpon in the US to share how it all started.", source10: "Heaven Raven", readMore: "Read More" },
    interview: { title: "Radio Interview", description: "Listen to Ponpon's latest interview and dive deep into her musical journey.", rti1: "Music Essence: Rising Jazz Star Ponpon Chen - Finding the Original Voice (Part 1)", rti2: "Music Essence: Rising Jazz Star Ponpon Chen - Finding the Original Voice (Part 2)", rti1Date: "2026-03-16", rti2Date: "2026-03-23", pod1: "BCC Midnight You & Me - Interview: Ponpon Chen", pod1Date: "2026-03-08", podSource: "BCC Radio", listenNow: "Listen Now" },
    videos: { title: "Video Gallery", description: "Explore Ponpon's live performances, interviews, and vlogs.", p1: "Live & Originals", p2: "Shorts", p3: "Interviews", p4: "Vlogs & Features", p5: "Fan Cams" },
    links: { title: "Follow Ponpon", youtube: "YouTube", instagram: "Instagram", facebook: "Facebook", threads: "Threads", website: "Official Site" },
    comments: { title: "Fan Lounge", description: "Leave your footprints and feelings, letting this musical exchange resonate under the night sky..." }
  },
  ja: {
    nav: { home: "ホーム", about: "プロフィール", timeline: "タイムライン", news: "ニュース", interview: "インタビュー", videos: "動画", links: "リンク" },
    timeline: { title: "マイルストーン", description: "Ponponの音楽の旅と重要な瞬間" },
    hero: { title: "Ponpon Chen", subtitle: "ジャズアーティスト", slogan: "魂の歌声で、すべての夜の物語を語る。", disclaimer: "ファンによって構築された非公式の音楽アーカイブです。ラジオインタビュー、ライブパフォーマンスなど、Ponponの音楽の旅の貴重な瞬間を丁寧に集め、彼女の魂を揺さぶる歌声をいつでも楽しめる憩いの場を提供しています。" },
    about: { title: "Ponponについて", description: "Ponpon (陳芃瑄) の音楽の世界では、楽器と歌声に境界はありません。彼女は表現力豊かな歌声をベースに、流れるようなギターの伴奏を組み合わせ、メロディーの中を自由に駆け巡ります。\n\nファンを最も魅了するのは、ライブパフォーマンスにおいて、澄んだ口笛、軽快なスキャット、そしてギターのピッキングを同時に操る姿です。この「三位一体」の同時演奏技術は、彼女の最も象徴的な音楽的シグネチャーとなっています。2026年には待望のファースト・ジャズ・アルバムがリリース予定です。繊細かつ力強い音楽のエネルギーにぜひご期待ください。" },
    news: { title: "ニュース＆プレス", description: "メディア掲載と特集。", article1: "2025-10-11 台湾のミュージシャンPonpon ChenがABCプラットフォームに登場 (原文：中国語)", article1Desc: "23歳の台湾人ミュージシャンPonpon Chenが、ユニークなジャズギターとボーカルスタイルでABC Newsに...", source: "世界日報", article2: "2016-08-24 イーリン・スター エンターテインメント部門優勝 Ponpon Chen (原文：中国語)", article2Desc: "エンターテインメント部門の優勝は14歳のPonpon Chenが獲得しました。今大会最年少の受賞者であり、幼い頃から歌手を志していました...", source2: "中国時報", article3: "2025-07-18 台湾の歌手Ponpon Chenが米ニュースのエンディングに登場、ギター弾き語りで100万回再生を記録 (原文：中国語)", article3Desc: "23歳の台湾人歌手Ponpon Chenの90秒間のジャズパフォーマンスが米ABC Newsのエンディングで放送され、ネット上で120万回の再生回数を記録しました...", source3: "中央社 CNA", article4: "2025-07-27 Ponpon Chen performs news ‘Polka’ (原文：英語)", article4Desc: "「台湾出身で、現在はカリフォルニアで注目を集める若手ジャズアーティスト、Ponpon Chenと彼女のクインテットです」と米ニュース番組のアナウンサーが紹介しました...", source4: "Taipei Times", article5: "2025-07-25 FEATURE/Ponpon does polka: Taiwanese jazz musician whistles, scats her way onto US news (原文：英語)", article5Desc: "台湾のジャズミュージシャンPonpon Chenは、エレキギターを手にバンドを率い、アメリカの音楽コメディアンBarry Mitchellの有名なジングルを独自のアレンジで披露しました...", source5: "僑務電子報", article6: "2024-04-29 Meet Ponpon Chen | 歌手、ジャズギタリスト、ソングライター (原文：英語)", article6Desc: "Ponpon Chenとつながる幸運に恵まれ、その会話をシェアします。過去10年間、私の音楽の旅は多様な経験に満ちていました...", source6: "SHOUTOUT LA", article7: "2025-07-18 台湾の女性がジャズでアメリカを魅了！Ponpon ChenがABCニュースのエンディングに登場 (原文：中国語)", article7Desc: "23歳の台湾人歌手Ponpon Chenの90秒間のジャズパフォーマンスが米ABC Newsのエンディングで放送され、ネット上で120万回の再生回数を記録しました...", source7: "壹蘋新聞網", article8: "2025-07-20 Ponpon Chen、ギター初心者からジャズの新星へ変身、思いがけず巨匠たちと出会う (原文：中国語)", article8Desc: "23歳の台湾人女性Ponpon Chenは、わずか4年間でギター初心者からアメリカのジャズの新星へと成長しました。失敗を恐れない精神で異国で奮闘し...", source8: "僑務電子報", article9: "2018-05-07 ワン・ユエンが台湾の少女を自ら指名！「1対1のデュエットで見つめ合い」照れて2度笑ってしまう (原文：中国語)", article9Desc: "TFBOYSのメンバーであるワン・ユエン（王源）が最近、番組「Come Sing with Me 3」にゲスト出演しました。収録の前日に自らファンに電話をかけて招待しましたが、無情にも電話を切られてしまい、ため息をつく場面も。幸いにも最終的に3人のファンを招待できました。番組では他に6組とコラボし、最後に単独デュエットの相手として選ばれた幸運な女の子は、台湾出身のポンポン・チェン（陳芃瑄）でした。", source9: "ETtoday Star", article10: "2025-08-02 Heaven Raven インタビュー：カリフォルニア在住の台湾人女性 Ponpon Chen (原文：中国語)", article10Desc: "カリフォルニア在住の台湾人女性Ponpon Chenは、今年5月にABCから招待を受け、伝統的なニュースエンディング曲「World News Polka」をジャズにアレンジしました。ネット上で120万回以上の再生回数を記録し、Threadsでも話題になっています。今日HRはアメリカにいるPonponとつながり、すべてがどのように始まったのかをシェアしてもらいます。", source10: "Heaven Raven", readMore: "続きを読む" },
    interview: { title: "ラジオインタビュー", description: "Ponponの最新インタビューを聴いて、彼女の音楽の旅を深く知ろう。", rti1: "音楽の真髄：米国の新星ジャズシンガー Ponpon Chen - 魂の奥底にあるオリジナルな声を探して (前編)", rti2: "音楽の真髄：米国の新星ジャズシンガー Ponpon Chen - 魂の奥底にあるオリジナルな声を探して (後編)", rti1Date: "2026-03-16", rti2Date: "2026-03-23", pod1: "BCC Midnight You & Me - インタビュー: Ponpon Chen", pod1Date: "2026-03-08", podSource: "BCCラジオ", listenNow: "今すぐ聴く" },
    videos: { title: "ビデオギャラリー", description: "Ponponのライブパフォーマンス、インタビュー、Vlogをご覧ください。", p1: "ライブ＆オリジナル", p2: "ショート動画", p3: "インタビュー", p4: "Vlog＆特集", p5: "ファンカメラ (Fan Cams)" },
    links: { title: "フォローする", youtube: "YouTube", instagram: "Instagram", facebook: "Facebook", threads: "Threads", website: "公式サイト" },
    comments: { title: "Fan Lounge", description: "あなたの足跡と思いを残し、この音楽の交流を夜空の下で響かせましょう..." }
  }
};

const getTimelineData = (lang: Language) => {
  if (lang === 'en') {
    return [
      { year: "2012 - 2014", title: "Musical Beginnings", desc: <>Started learning street dance at 10, laying a rhythmic foundation and sparking her dream of becoming a singer-dancer. At 12, driven by her passion for singing, she began entering vocal competitions.</> },
      { year: "2015 - 2016", title: "Rising Star", desc: <>Won 2nd place at the "City Star" singing contest in 2015. In 2016, at just 14 years old, she won the Entertainment Group Championship of the 5th "Eelin Star".</> },
      { year: "2018 - 2019", title: "Overseas Duet & Landmark Contest", desc: <>Performed on the popular TV show "Come Sing with Me 3" in 2018, singing a solo duet with Wang Yuan. In 2019, she competed as a challenger in Taiwan's iconic music survival show <strong>"Jungle Voice"</strong>.</> },
      { year: "2020 - 2021", title: "Jazz Awakening", desc: <>Admitted to the Drama Dept at NTUA. Inspired by jazz legend <strong>George Benson</strong> during pandemic lockdown, she took a leave of absence to passionately self-study jazz electric guitar, deciding to pursue music in the US.</> },
      { year: "2022 - 2023", title: "Studying in LA & Transformation", desc: <>Moved to Los Angeles to study Jazz Guitar at the Musicians Institute (MI). Forced to take a six-month break from playing due to tendonitis from intense practice, she used this time to deeply study jazz vocals and music history, beautifully evolving into a versatile, all-around musician.</> },
      { year: "2024", title: "LA Gigs & Social Media Breakthrough", desc: <>Became active in LA jazz clubs as a Band Leader, accumulating deep live performance experience. Invited by Grammy-winning studio owner Tom Weir to release performance videos on his channel, her unique charm quickly sparked a social media craze with rapidly soaring viewership.</> },
      { year: "2025", title: "Global Recognition & Master Collaborations", desc: <>In May, she was invited to perform a rearranged outro for <strong>ABC News</strong> "World News Now", with the video surpassing a million views. At the end of the year, she was invited to an annual L.A. grand event to perform alongside Grammy winner Randy Waldman.</> },
      { year: "2026", title: "Debut Jazz Album & Gibson Spotlight Artist", desc: <>Synthesizing a decade of musical depth and her US experiences, she released her debut English jazz studio album, opening a new chapter in her career. That same year, her exceptional guitar skills were recognized by the world's top guitar brand, inviting her to be <strong>Gibson</strong>'s 2026 Spotlight Artist, showcasing the international impact of a new-generation jazz diva.</> }
    ];
  }
  if (lang === 'ja') {
    return [
      { year: "2012 - 2014", title: "音楽の芽生え", desc: <>10歳でストリートダンスを学びリズム感を養い、歌って踊れるアーティストへの夢を抱く。12歳で歌への情熱から、ボーカルコンテストに出場し始める。</> },
      { year: "2015 - 2016", title: "注目の新星", desc: <>2015年の歌唱コンテストで2位を獲得。2016年、わずか14歳で第5回「イーリン・スター」エンターテインメント部門で優勝。</> },
      { year: "2018 - 2019", title: "海外での挑戦と飛躍", desc: <>2018年に人気音楽番組「Come Sing with Me 3」に出演し、人気歌手ワン・ユエンとデュエット。2019年には台湾を代表するオーディション番組<strong>「Jungle Voice」</strong>にチャレンジャーとして参戦。</> },
      { year: "2020 - 2021", title: "ジャズへの覚醒", desc: <>台湾芸術大学に進学するも、コロナ禍でジャズの巨匠<strong>George Benson</strong>の動画に衝撃を受け、休学してジャズエレクトリックギターの猛特訓を開始。渡米を決意する。</> },
      { year: "2022 - 2023", title: "渡米と試練からの進化", desc: <>ロサンゼルスのMusicians Institute（MI）でジャズギターを専攻。猛練習による腱鞘炎で半年間ギターを弾けない休養期間を強いられるが、その間にジャズボーカルと音楽史を深く学び、楽器奏者から全方位的な音楽家へと華麗な進化を遂げる。</> },
      { year: "2024", title: "LAでのライブとSNSでのブレイク", desc: <>ロサンゼルスの各ジャズクラブでバンドリーダーとして活躍し、確かなライブパフォーマンスの実力を築く。グラミー賞受賞のスタジオオーナーTom Weirの招待で彼のチャンネルに演奏動画を公開したところ、その独特な魅力で瞬く間にSNSで話題となり、視聴回数が急上昇。</> },
      { year: "2025", title: "国際メディア掲載と巨匠との共演", desc: <>5月、米国<strong>ABC News</strong>「World News Now」のエンディング曲アレンジと演奏に招待され、動画は100万回再生を突破。年末にはロサンゼルスの年末恒例行事に招かれ、グラミー賞受賞者Randy Waldmanと共演を果たす。</> },
      { year: "2026", title: "ファーストアルバム＆Gibson年間注目アーティスト", desc: <>10年以上の音楽的蓄積と渡米の経験を結集し、自身初の全編英語ジャズスタジオアルバムをリリースし、キャリアの新たな扉を開く。同年、その卓越したギターテクニックが世界トップメーカーに認められ、<strong>Gibson</strong>の2026年度注目アーティストに選出。新世代ジャズ歌姫としての国際的な影響力を示している。</> }
    ];
  }
  return [
    { year: "2012 - 2014", title: "初心萌芽與舞台起步", desc: <>10歲學習街舞奠定律動基礎，萌發唱跳歌手夢。12歲憑藉對歌唱的熱愛，開始報名歌唱比賽。</> },
    { year: "2015 - 2016", title: "初試啼聲與耀眼新星", desc: <>2015年獲得「城市之星」歌唱比賽第二名；2016年以14歲之姿奪得第5屆「伊林璀璨之星」演藝組冠軍。</> },
    { year: "2018 - 2019", title: "跨海登台與指標定錨", desc: <>2018年赴湖南衛視參與《我想和你唱3》，獲選與王源單獨合唱《驕傲》；2019年擔任台灣指標性音樂節目<strong>《聲林之王》</strong>第二季踢館歌手，演唱《台北某個地方》。</> },
    { year: "2020 - 2021", title: "爵士覺醒與破釜沉舟", desc: <>錄取台藝大戲劇系後因疫情線上學習，深受爵士傳奇大師 <strong>George Benson</strong> 影片啟發，決定休學並全心鑽研爵士電吉他，拜師林正如，確立赴美深造的決心。</> },
    { year: "2022 - 2023", title: "赴美深造與沉潛蛻變", desc: <>前往洛杉磯 Musicians Institute 專攻爵士吉他。雖因高強度苦練引發肌腱炎被迫休養半年，卻在停彈期間深研爵士人聲與音樂史，完成從樂手到全方位音樂人的華麗進化。</> },
    { year: "2024", title: "洛杉磯實戰與社群突圍", desc: <>活躍於洛杉磯各大 Jazz Club 並擔任 Band Leader，累積深厚現場實戰力。受葛萊美錄音室老闆 Tom Weir 邀請，於其頻道發布演出影片，憑藉獨特魅力迅速引發社群熱潮，觀看人數迅速飆升。</> },
    { year: "2025", title: "躍上國際媒體與大師結緣", desc: <>5月受邀為美國 <strong>ABC News</strong>《World News Now》演出改編片尾曲，影片突破百萬點閱；年底受邀洛杉磯年度盛事，與葛萊美得主 Randy Waldman 同台演出。</> },
    { year: "2026", title: "首張爵士專輯與榮膺 Gibson 年度焦點藝術家", desc: <>匯聚十載音樂底蘊與旅美淬鍊，發行首張個人英文爵士錄音室專輯，開啟演藝生涯嶄新篇章。同年琴藝深獲國際頂尖琴廠肯定，受邀擔任 <strong>Gibson</strong> 2026 年度焦點藝術家，展現新世代爵士女伶的國際影響力。</> }
  ];
};

function MainContent() {
  const [lang, setLang] = useState<Language>('zh');
  const t = translations[lang];
  const timelineItems = getTimelineData(lang);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);

  // Scroll to top when changing route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-dark text-gray-100 font-sans selection:bg-gold/30 selection:text-gold-light flex flex-col pt-20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl font-semibold tracking-widest text-gold cursor-pointer" onClick={closeMenu}>
            PONPON
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest">
            <Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.home}</Link>
            <Link to="/about" className={`transition-colors ${location.pathname === '/about' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.about}</Link>
            <Link to="/timeline" className={`transition-colors ${location.pathname === '/timeline' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.timeline}</Link>
            <Link to="/news" className={`transition-colors ${location.pathname === '/news' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.news}</Link>
            <Link to="/interview" className={`transition-colors ${location.pathname === '/interview' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.interview}</Link>
            <Link to="/videos" className={`transition-colors ${location.pathname === '/videos' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.videos}</Link>
            <Link to="/links" className={`transition-colors ${location.pathname === '/links' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.links}</Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-sm border-none outline-none cursor-pointer hover:text-gold transition-colors focus:ring-0"
              >
                <option value="zh" className="bg-dark text-white">中文</option>
                <option value="en" className="bg-dark text-white">EN</option>
                <option value="ja" className="bg-dark text-white">日本語</option>
              </select>
            </div>
            <div className="hidden md:flex opacity-70 hover:opacity-100 transition-opacity shrink-0">
              <img src="https://visitor-badge.laobi.icu/badge?page_id=ponponchen.com&left_color=gray&right_color=goldenrod&left_text=VISITORS" alt="Visitors" className="h-5" />
            </div>
            
            {/* Mobile Hamburger Button */}
            <button 
              className="md:hidden text-gray-300 hover:text-gold p-2 transition-colors ml-4 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-dark/95 backdrop-blur-xl pt-24 pb-12 px-6 md:hidden flex flex-col items-center space-y-6 overflow-y-auto"
          >
            <div className="flex flex-col items-center space-y-8 w-full max-w-sm mt-8">
              <Link to="/" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 border-b border-white/5 transition-colors ${location.pathname === '/' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.home}</Link>
              <Link to="/about" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 border-b border-white/5 transition-colors ${location.pathname === '/about' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.about}</Link>
              <Link to="/timeline" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 border-b border-white/5 transition-colors ${location.pathname === '/timeline' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.timeline}</Link>
              <Link to="/news" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 border-b border-white/5 transition-colors ${location.pathname === '/news' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.news}</Link>
              <Link to="/interview" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 border-b border-white/5 transition-colors ${location.pathname === '/interview' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.interview}</Link>
              <Link to="/videos" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 border-b border-white/5 transition-colors ${location.pathname === '/videos' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.videos}</Link>
              <Link to="/links" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 transition-colors ${location.pathname === '/links' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.links}</Link>
              
              <div className="pt-8 w-full flex justify-center opacity-70">
                <img src="https://visitor-badge.laobi.icu/badge?page_id=ponponchen.com&left_color=gray&right_color=goldenrod&left_text=VISITORS" alt="Visitors" className="h-6" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow">
      <Routes>
        <Route path="/" element={
          <section id="hero" className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden py-12 md:py-20">
        {/* Atmospheric background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-[1px] w-12 bg-gold"></div>
              <span className="uppercase tracking-[0.3em] text-xs font-semibold text-gold">{t.hero.subtitle}</span>
            </div>
            <h1 className="font-serif mb-6 leading-tight flex flex-col gap-2 md:gap-4">
              <span className="text-5xl md:text-7xl lg:text-7xl tracking-wide">{t.hero.title}</span>
              <span className="text-3xl md:text-4xl lg:text-5xl text-gray-300 tracking-widest">(陳芃瑄)</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-light max-w-md leading-relaxed italic font-serif">
              "{t.hero.slogan}"
            </p>
            <div className="mt-8 text-sm md:text-base text-gray-400/80 leading-relaxed font-sans bg-white/5 border border-white/10 p-5 rounded-2xl shadow-inner max-w-lg md:mx-0 mx-auto text-left relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
              <div className="absolute top-0 left-0 w-1 h-full bg-gold/50 group-hover:bg-gold transition-colors duration-500"></div>
              <span className="text-gold/80 block mb-2 font-medium tracking-widest text-xs uppercase flex items-center gap-2">
                <Music className="w-3 h-3" /> Fan Project
              </span>
              {t.hero.disclaimer}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="order-1 md:order-2 flex justify-center"
          >
            <div className="relative w-64 h-80 md:w-80 md:h-[450px] rounded-t-full overflow-hidden border border-white/10 p-2">
              <div className="w-full h-full rounded-t-full overflow-hidden bg-dark-lighter relative">
                {/* Hero Image */}
                <img 
                  src="https://shoutoutla.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/04/c-PonponChen__IMG5020_1712948629197.jpg" 
                  alt="Ponpon Chen" 
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
        } />

        {/* About Section */}
        <Route path="/about" element={
      <section id="about" className="py-12 md:py-32 bg-dark-lighter relative min-h-[calc(100vh-80px)] flex items-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Mic2 className="w-8 h-8 text-gold mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-serif mb-10 text-center">{t.about.title}</h2>
            <p className="text-gray-300 leading-loose text-lg font-light md:text-xl text-left whitespace-pre-wrap max-w-3xl mx-auto">
              {t.about.description}
            </p>
            
            <div className="mt-16 inline-flex items-center justify-center space-x-4 border border-gold/30 rounded-full px-8 py-4 bg-dark/50">
              <Music className="w-5 h-5 text-gold" />
              <span className="text-sm tracking-widest uppercase text-gold-light">New Album 2026</span>
            </div>
          </motion.div>
        </div>
      </section>
        } />

        {/* Timeline Section */}
        <Route path="/timeline" element={
      <section id="timeline" className="py-12 md:py-32 bg-dark relative border-t border-white/5 overflow-hidden min-h-[calc(100vh-80px)]">
        {/* Background glow for timeline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px] pointer-events-none hidden md:block"></div>
        
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6">{t.timeline.title}</h2>
            <p className="text-gray-400 font-light max-w-xl mx-auto">{t.timeline.description}</p>
          </motion.div>

          {/* Timeline Container */}
          <div className="relative max-w-3xl mx-auto">
            {/* The vertical connector line */}
            <div className="absolute left-[15px] md:left-1/2 md:-ml-[1px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

            <div className="space-y-16 md:space-y-24">
              {timelineItems.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} group`}
                  >
                     {/* Center dot (Desktop) / Left dot (Mobile) */}
                     <div className="absolute left-[11px] md:left-1/2 md:-ml-[5px] top-1.5 w-[10px] h-[10px] rounded-full bg-gold shadow-[0_0_15px_rgba(212,175,55,0.8)] group-hover:bg-gold-light group-hover:scale-150 transition-all duration-300 z-10 border-2 border-dark"></div>
                     
                     {/* Desktop Spacer matching 50% width */}
                     <div className="hidden md:block w-1/2"></div>

                     {/* Content Card */}
                     <div className={`pl-12 md:pl-0 w-full md:w-1/2 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'} relative z-20`}>
                       <div className="bg-dark-lighter/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl group-hover:border-gold/30 transition-colors duration-500 hover:shadow-2xl hover:shadow-gold/5">
                         <span className="inline-block px-3 py-1 bg-gold/10 text-gold-light rounded-full text-sm font-mono tracking-widest mb-4">
                           {item.year}
                         </span>
                         <h3 className="text-xl md:text-2xl font-serif text-white mb-3 group-hover:text-gold transition-colors">{item.title}</h3>
                         <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base selection:bg-gold/30">
                           {item.desc}
                         </p>
                       </div>
                     </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
        } />

        {/* News Section */}
        <Route path="/news" element={
      <section id="news" className="py-12 md:py-32 bg-dark-lighter relative min-h-[calc(100vh-80px)]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6">{t.news.title}</h2>
            <p className="text-gray-400 font-light">{t.news.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <a 
              href="https://www.worldjournal.com/wj/story/121360/9063230" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://pgw.worldjournal.com/gw/photo.php?u=https://uc.udn.com.tw/photo/wj/realtime/2025/10/11/33336910.jpg&s=Y&x=0&y=19&sw=1280&sh=852&sl=W&fw=800&exp=3600" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article1}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article1Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://www.instagram.com/p/DM2TUqZTFYx/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://scontent-sof1-2.cdninstagram.com/v/t51.82787-15/527327478_18516424330008067_2745243435798350628_n.jpg?stp=cmp1_dst-jpg_e35_s640x640_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=H0QL959b968Q7kNvwEgK2le&_nc_oc=Adre3qL4hSpnUEAUD8xmOjSsJAVgvRyi0dvldm6FkKJ_b7HJDELLqwr1Y7XYCnml6BarFqXkgxKCYhlfwrXhcLGf&_nc_zt=23&_nc_ht=scontent-sof1-2.cdninstagram.com&_nc_gid=m_uQg6m-RFxyGtEunEzvQg&_nc_ss=7a289&oh=00_Af1g-f5CuhdKbhU3dDn4IAItENiqGREnfKcXvTqmQW29Gw&oe=69E63BCC" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source10}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article10}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article10Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://www.taipeitimes.com/News/taiwan/archives/2025/07/27/2003840999" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://img.taipeitimes.com/images/2025/07/27/P03-250727-601.jpg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source4}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article4}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article4Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://ocacnews.net/article/403781" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://ocacnews.net/storage/articleImages/20250722/M2_dbff1573ef73ec0a4780d7e1726880bc.jpeg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source5}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article5}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article5Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://ocacnews.net/article/403561" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://ocacnews.net/storage/articleImages/20250719/M2_yYFC1QYylcwhLOAcFiLFesVyj7ZJYaL5apEMScyD.jpg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source8}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article8}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article8Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://www.cna.com.tw/news/amov/202507180145.aspx" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://imgcdn.cna.com.tw/www/webphotos/WebOg/600/20250718/1365x716_469323157184.jpg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source3}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article3}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article3Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://shoutoutla.com/meet-ponpon-chen-singer-jazz-guitarist-songwriter/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://shoutoutla.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/04/c-PersonalPonponChen__IMG3539_1712979648617.jpg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source6}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article6}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article6Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://star.ettoday.net/news/1164745" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://cdn2.ettoday.net/images/3271/e3271688.jpg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source9}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article9}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article9Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://www.chinatimes.com/newspapers/20160824000626-260507?chdtv" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://images.chinatimes.com/newsphoto/2016-08-24/1024/BBC100_P_02_02.jpg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source2}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article2}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article2Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </section>
        } />

        {/* Interview Section */}
        <Route path="/interview" element={
      <section id="interview" className="py-12 md:py-32 bg-dark-lighter relative min-h-[calc(100vh-80px)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6">{t.interview.title}</h2>
            <p className="text-gray-400 mb-12 font-light">{t.interview.description}</p>
            
            <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
              
              {/* RTI Part 2 (Newest) */}
              <a 
                href="https://www.rti.org.tw/programnews?uid=4&pid=100400" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                  <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                    <img 
                      src="https://shoutoutla.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/04/c-PonponChen__IMG5020_1712948629197.jpg" 
                      alt="Interview Cover" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                    <div className="flex items-center mb-4">
                      <Mic2 className="w-4 h-4 text-gold mr-2" />
                      <span className="text-xs font-mono text-gold-light tracking-widest">{t.interview.rti2Date}</span>
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                      {t.interview.rti2}
                    </h3>
                    <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                      <span>{t.interview.listenNow}</span>
                      <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
              </a>

              {/* RTI Part 1 */}
              <a 
                href="https://www.rti.org.tw/programnews?uid=4&pid=99800" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                  <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                    <img 
                      src="https://shoutoutla.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/04/c-PersonalPonponChen__IMG3539_1712979648617.jpg" 
                      alt="Interview Cover" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                    <div className="flex items-center mb-4">
                      <Mic2 className="w-4 h-4 text-gold mr-2" />
                      <span className="text-xs font-mono text-gold-light tracking-widest">{t.interview.rti1Date}</span>
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                      {t.interview.rti1}
                    </h3>
                    <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                      <span>{t.interview.listenNow}</span>
                      <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
              </a>

              {/* Podcast 1 (BCC Radio) */}
              <div className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter relative overflow-hidden text-left hover:border-gold/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 flex flex-col h-full items-start">
                  <div className="flex items-center mb-4">
                    <Mic2 className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.interview.pod1Date}</span>
                    <span className="mx-3 text-white/20">|</span>
                    <Globe className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-xs font-mono text-gray-400 tracking-widest">{t.interview.podSource}</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl mb-6 group-hover:text-gold transition-colors leading-snug">
                    {t.interview.pod1}
                  </h3>
                  
                  <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-gold/5 border border-white/10 bg-dark-lighter">
                    <iframe 
                      style={{ borderRadius: '12px' }} 
                      src="https://embed.podcasts.apple.com/tw/podcast/2026-3-08-midnight-you-me-%E6%9C%89%E4%BA%BA%E4%BE%86%E8%A8%AA-%E8%87%BA%E7%81%A3%E7%88%B5%E5%A3%AB%E5%A5%BD%E5%A5%B3%E8%81%B2-%E5%94%B1%E9%80%B2%E7%BE%8E%E5%9C%8B%E6%96%B0%E8%81%9E%E5%9C%88-%E5%B0%88%E8%A8%AA-%E9%99%B3%E8%8A%83%E7%91%84/id1642839567?i=1000760815048&theme=dark" 
                      width="100%" 
                      height="175" 
                      frameBorder="0" 
                      allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
                      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
                      title="Apple Podcast Interview"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Podcast 2 (Spotify) */}
              <div className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter relative overflow-hidden text-left hover:border-gold/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 flex flex-col h-full items-start">
                  <div className="flex items-center mb-4">
                    <Mic2 className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.interview.pod2Date}</span>
                    <span className="mx-3 text-white/20">|</span>
                    <Globe className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-xs font-mono text-gray-400 tracking-widest">{t.interview.pod2Source}</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl mb-6 group-hover:text-gold transition-colors leading-snug">
                    {t.interview.pod2}
                  </h3>
                  
                  <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-gold/5 border border-white/10">
                    <iframe 
                      style={{ borderRadius: '12px' }} 
                      src="https://open.spotify.com/embed/episode/5E9Bl69WxCP1Ppj5oHC8V7?utm_source=generator&theme=0" 
                      width="100%" 
                      height="152" 
                      frameBorder="0" 
                      allowFullScreen={false} 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                      loading="lazy"
                      title="Spotify Podcast Interview"
                    ></iframe>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>
        } />

        {/* Videos Section */}
        <Route path="/videos" element={
      <section id="videos" className="py-12 md:py-32 bg-dark relative min-h-[calc(100vh-80px)]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6">{t.videos.title}</h2>
            <p className="text-gray-400 mb-12 font-light">{t.videos.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <YouTubePlaylist title={t.videos.p1} playlistId="PLLwWHVIUlB8lzbav-7ETbHfJhDqZDOkJj" />
              <YouTubePlaylist title={t.videos.p2} playlistId="PLLwWHVIUlB8lbrhitwdm9yq5MhKKn_lNT" />
              <YouTubePlaylist title={t.videos.p3} playlistId="PLLwWHVIUlB8llQJXiVeWR7vSSsg8Ink4e" />
              <YouTubePlaylist title={t.videos.p4} playlistId="PLLwWHVIUlB8ltR-2B1q4ZAFnQm6NOGxJq" />
            </div>

            {/* Fan Cams (Social Media) */}
            <div className="mt-16 border-t border-white/10 pt-16">
              <h3 className="text-2xl font-serif mb-8 text-gold">{t.videos.p5}</h3>
              <div className="flex flex-wrap justify-center gap-8">
                <div className="flex flex-col items-center">
                  <p className="text-gray-300 mb-4 font-medium tracking-wide">20260204 Music Corner 角落音樂餐廳。</p>
                  <div className="rounded-2xl overflow-hidden shadow-2xl shadow-gold/5 border border-white/10 bg-black inline-block">
                    <iframe 
                      src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1177729904529661&show_text=false&width=316&t=0" 
                      width="316" 
                      height="562" 
                      style={{ border: 'none', overflow: 'hidden' }} 
                      scrolling="no" 
                      frameBorder="0" 
                      allowFullScreen={true} 
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
        } />

        {/* Links Section */}
        <Route path="/links" element={<>
      <section id="links" className="py-12 md:py-32 bg-dark-lighter relative min-h-max">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-16">{t.links.title}</h2>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a 
                href="https://www.ponponchen.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 md:p-10 border border-white/5 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]"
              >
                <Globe className="w-8 h-8 md:w-10 md:h-10 mb-4 text-gray-400 group-hover:text-gold transition-colors" />
                <span className="tracking-widest uppercase text-xs md:text-sm whitespace-nowrap">{t.links.website}</span>
              </a>

              <a 
                href="https://youtube.com/channel/UCXeuyoBvlK5y0Wq173rfzow" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 md:p-10 border border-white/5 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]"
              >
                <Youtube className="w-8 h-8 md:w-10 md:h-10 mb-4 text-gray-400 group-hover:text-[#FF0000] transition-colors" />
                <span className="tracking-widest uppercase text-xs md:text-sm whitespace-nowrap">{t.links.youtube}</span>
              </a>
              
              <a 
                href="https://www.instagram.com/ponponofficial_/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 md:p-10 border border-white/5 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]"
              >
                <Instagram className="w-8 h-8 md:w-10 md:h-10 mb-4 text-gray-400 group-hover:text-[#E1306C] transition-colors" />
                <span className="tracking-widest uppercase text-xs md:text-sm whitespace-nowrap">{t.links.instagram}</span>
              </a>

              <a 
                href="https://www.threads.com/@ponponofficial_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 md:p-10 border border-white/5 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]"
              >
                <AtSign className="w-8 h-8 md:w-10 md:h-10 mb-4 text-gray-400 group-hover:text-white transition-colors" />
                <span className="tracking-widest uppercase text-xs md:text-sm whitespace-nowrap">{t.links.threads}</span>
              </a>
              
              <a 
                href="https://facebook.com/ponpon0405" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 md:p-10 border border-white/5 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]"
              >
                <Facebook className="w-8 h-8 md:w-10 md:h-10 mb-4 text-gray-400 group-hover:text-[#1877F2] transition-colors" />
                <span className="tracking-widest uppercase text-xs md:text-sm whitespace-nowrap">{t.links.facebook}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comments Section */}
      <section id="comments" className="py-32 bg-dark relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gold">{t.comments.title}</h2>
            <p className="text-gray-400 font-light italic">
              "{t.comments.description}"
            </p>
          </motion.div>
          
          <div className="bg-dark-lighter p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl shadow-gold/5">
            <GiscusComments />
          </div>
        </div>
      </section>
        </>} />
      </Routes>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/5 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Ponpon Chen. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}
