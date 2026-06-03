export type Platform = 'youtube' | 'facebook' | 'instagram' | 'threads';

export interface VideoInfo {
  id: string;
  platform: Platform;
  category: 'p1' | 'p2' | 'p3' | 'p5' | 'p6' | 'p7' | 'p8';
  title: string;
  date: string;
  displayDate?: string;
  embedUrl: string;
  thumbnailUrl?: string;
  isFeatured: boolean;
  eventGroup?: string;
}

export const videoList: VideoInfo[] = [
  {
    "id": "v-fb-1387294209248782",
    "platform": "facebook",
    "category": "p1",
    "title": "Ponpon｜I Can't Give You Anything But Love (Live at Cicada Club)",
    "date": "2025-04-12",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/1387294209248782/&show_text=0&width=500",
    "isFeatured": false
  },
  {
    "id": "v-fb-1364553878201641",
    "platform": "facebook",
    "category": "p1",
    "title": "Ponpon｜It's Been a Long, Long Time (Live at Cicada Club)",
    "date": "2025-04-12",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/1364553878201641/&show_text=0&width=500",
    "isFeatured": false
  },
  {
    "id": "v-ig-CJ-39RJnPhQ",
    "platform": "instagram",
    "category": "p1",
    "title": "Ponpon｜Cellophane (Cover by Ponpon)",
    "date": "2021-01-14",
    "embedUrl": "CJ-39RJnPhQ",
    "thumbnailUrl": "/ig-cellophane.jpg",
    "isFeatured": false
  },
  {
    "id": "v-ig-CRwRLU1n5c4",
    "platform": "instagram",
    "category": "p1",
    "title": "Ponpon｜Someday (Cover by Ponpon)",
    "date": "2021-07-25",
    "embedUrl": "CRwRLU1n5c4",
    "thumbnailUrl": "/ig-someday.jpg",
    "isFeatured": false
  },
  {
    "id": "v-fb-995751751518630",
    "platform": "facebook",
    "category": "p1",
    "title": "Ponpon｜I’ll Close My Eyes (Live at The Barkley)",
    "date": "2023-11-22",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/watch/?v=995751751518630&show_text=0&width=500",
    "isFeatured": false
  },
  {
    "id": "v-ig-C9g4xitu6qT",
    "platform": "instagram",
    "category": "p1",
    "title": "Ponpon｜Blue Skies (Live at Pacific GROOVE)",
    "date": "2024-07-16",
    "embedUrl": "C9g4xitu6qT",
    "thumbnailUrl": "/ig-blue-skies.jpg",
    "isFeatured": false
  },
  {
    "id": "v-ig-C18e6XCL0G8",
    "platform": "instagram",
    "category": "p1",
    "title": "Ponpon｜Billie’s Bounce / Charlie Parker (Live at The Barkley)",
    "date": "2024-01-10",
    "embedUrl": "C18e6XCL0G8",
    "thumbnailUrl": "/ig-billies-bounce.jpg",
    "isFeatured": false
  },
  {
    "id": "v-ig-COP_dlIgVCM",
    "platform": "instagram",
    "category": "p1",
    "title": "Ponpon｜找自己 (Live at OKIII Studio)",
    "date": "2021-04-25",
    "embedUrl": "COP_dlIgVCM",
    "thumbnailUrl": "/ig-find-myself.jpg",
    "isFeatured": false
  },
  {
    "id": "v-fb-1295790065336477",
    "platform": "facebook",
    "category": "p1",
    "title": "Ponpon｜If I Had You (Live in San Francisco)",
    "date": "2025-09-21",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/1295790065336477&show_text=0&width=500",
    "isFeatured": false
  },
  {
    "id": "v-fb-5299252240089221",
    "platform": "facebook",
    "category": "p1",
    "title": "Ponpon｜Just Friends (Live at Oldie Goodie)",
    "date": "2021-12-17",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/5299252240089221&show_text=0&width=500",
    "isFeatured": false
  },
  {
    "id": "v-PBjJmX-bf_0",
    "platform": "youtube",
    "category": "p1",
    "title": "陳綺貞 Cheer Chen -【台北某個地方 Somewhere, Taipei】 Cover by 陳芃瑄 Ponpon",
    "date": "2020-09-30",
    "embedUrl": "PBjJmX-bf_0",
    "thumbnailUrl": "https://i.ytimg.com/vi/PBjJmX-bf_0/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-fb-353832705569724",
    "platform": "facebook",
    "category": "p1",
    "title": "陳粒 · 奇妙能力歌/純字幕 【cover by-Ponpon陳芃瑄】",
    "date": "2019-08-07",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/ponpon0405/videos/353832705569724/&show_text=0&width=500",
    "isFeatured": false
  },
  {
    "id": "v-HCUE2cDCOqs",
    "platform": "youtube",
    "category": "p1",
    "title": "Ponpon｜Let It Snow & Sleigh Ride (Live)",
    "date": "2025-12-24",
    "embedUrl": "HCUE2cDCOqs",
    "thumbnailUrl": "https://i.ytimg.com/vi/HCUE2cDCOqs/maxresdefault.jpg",
    "isFeatured": true
  },
  {
    "id": "v-1X0U_GupqPQ",
    "platform": "youtube",
    "category": "p1",
    "title": "Ponpon Chen 陳芃瑄 - The Moon Represents My Heart 月亮代表我的心(Live at Biscuits and Blues)",
    "date": "2025-09-20",
    "embedUrl": "1X0U_GupqPQ",
    "thumbnailUrl": "https://i.ytimg.com/vi/1X0U_GupqPQ/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-3L2s2zq0dM8",
    "platform": "youtube",
    "category": "p1",
    "title": "Shirley Diaz Tribute - \"Over The Rainbow\" Ponpon Chen",
    "date": "2025-07-15",
    "embedUrl": "3L2s2zq0dM8",
    "thumbnailUrl": "https://i.ytimg.com/vi/3L2s2zq0dM8/hqdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-1Fnnr4TOjVQ",
    "platform": "youtube",
    "category": "p1",
    "title": "Ponpon｜The World News Polka (ABC-TV Debut) 純享版",
    "date": "2025-05-09",
    "embedUrl": "1Fnnr4TOjVQ",
    "thumbnailUrl": "https://i.ytimg.com/vi/1Fnnr4TOjVQ/maxresdefault.jpg",
    "isFeatured": true
  },
  {
    "id": "v-5YdGLRsudOE",
    "platform": "youtube",
    "category": "p1",
    "title": "Sway...LIVE!",
    "date": "2025-05-04",
    "embedUrl": "5YdGLRsudOE",
    "thumbnailUrl": "https://i.ytimg.com/vi/5YdGLRsudOE/hqdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-PwxGVbZvWXI",
    "platform": "youtube",
    "category": "p1",
    "title": "Ponpon｜Them There Eyes (Live)",
    "date": "2025-04-12",
    "embedUrl": "PwxGVbZvWXI",
    "thumbnailUrl": "https://i.ytimg.com/vi/PwxGVbZvWXI/maxresdefault.jpg",
    "isFeatured": true
  },
  {
    "id": "v-fb-938722408121993",
    "platform": "facebook",
    "category": "p1",
    "title": "Ponpon Chen 陳芃瑄 - Reflection (Live at Disney Hotel)",
    "date": "2025-03-23",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/938722408121993&show_text=0&width=500",
    "isFeatured": false
  },
  {
    "id": "v-n28RVYQhuKg",
    "platform": "youtube",
    "category": "p1",
    "title": "CHEEK TO CHEEK (4), PonPon Chen live at PBDA  #swingdance  #Jitterbug #dance  #JoeNDancer",
    "date": "2025-03-22",
    "embedUrl": "n28RVYQhuKg",
    "thumbnailUrl": "https://i.ytimg.com/vi/n28RVYQhuKg/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-iHhSNW5aqp8",
    "platform": "youtube",
    "category": "p1",
    "title": "FLY ME TO THE MOON (6), PonPon Chen and her Quintet  #swingdance  #Jitterbug #dance  #JoeNDancer",
    "date": "2025-01-19",
    "embedUrl": "iHhSNW5aqp8",
    "thumbnailUrl": "https://i.ytimg.com/vi/iHhSNW5aqp8/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-ckiVCfDHduk",
    "platform": "youtube",
    "category": "p1",
    "title": "Fall in love with her voice, Feat Ponpon Chen, I'VE NEVER BEEN IN LOVE BEFORE (5)",
    "date": "2025-01-14",
    "embedUrl": "ckiVCfDHduk",
    "thumbnailUrl": "https://i.ytimg.com/vi/ckiVCfDHduk/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-TwpQd-D4Lf8",
    "platform": "youtube",
    "category": "p1",
    "title": "ROUTE 66 (1) by Ponpon Chen live at The Moose Lodge",
    "date": "2025-01-17",
    "embedUrl": "TwpQd-D4Lf8",
    "thumbnailUrl": "https://i.ytimg.com/vi/TwpQd-D4Lf8/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-KmhrMOit4dI",
    "platform": "youtube",
    "category": "p1",
    "title": "Ponpon｜But Not For Me (Live)",
    "date": "2025-01-02",
    "embedUrl": "KmhrMOit4dI",
    "thumbnailUrl": "https://i.ytimg.com/vi/KmhrMOit4dI/maxresdefault.jpg",
    "isFeatured": true
  },
  {
    "id": "v-fb-1104056930986826",
    "platform": "facebook",
    "category": "p1",
    "title": "Ponpon Chen 陳芃瑄 - It’s beginning to look a lot like Christmas (Live at Riverside)",
    "date": "2024-12-13",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/1104056930986826&show_text=0&width=500",
    "isFeatured": false
  },
  {
    "id": "v-fb-565723796377618",
    "platform": "facebook",
    "category": "p1",
    "title": "Ponpon Chen 陳芃瑄 - They can’t take that away from me (Live at Riverside)",
    "date": "2024-12-13",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/565723796377618&show_text=0&width=500",
    "isFeatured": false
  },
  {
    "id": "v-fb-492894840464111",
    "platform": "facebook",
    "category": "p1",
    "title": "Ponpon Chen 陳芃瑄 - Benny’s from heaven (Live at Riverside)",
    "date": "2024-12-13",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/492894840464111&show_text=0&width=500",
    "isFeatured": false
  },
  {
    "id": "v-fb-943741067777001",
    "platform": "facebook",
    "category": "p1",
    "title": "Ponpon Chen 陳芃瑄 - All of me (Live in LA)",
    "date": "2024-10-31",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/943741067777001&show_text=0&width=500",
    "isFeatured": false
  },
  {
    "id": "_BVm-hixXt4",
    "platform": "youtube",
    "category": "p1",
    "title": "Ponpon Chen \"How High The Moon\"",
    "date": "2024-08-15",
    "displayDate": "2024 Q3",
    "embedUrl": "_BVm-hixXt4",
    "thumbnailUrl": "https://i.ytimg.com/vi/_BVm-hixXt4/maxresdefault.jpg",
    "isFeatured": true
  },
  {
    "id": "v-hY3H5ob2wbE",
    "platform": "youtube",
    "category": "p1",
    "title": "Ponpon Chen 陳芃瑄 - 夢想騎士-唐吉訶德(2021希望城堡主題曲)Dream Knight – Don Quixote (2021 Castle of Hope Theme Song)",
    "date": "2021-03",
    "embedUrl": "hY3H5ob2wbE",
    "thumbnailUrl": "https://i.ytimg.com/vi/hY3H5ob2wbE/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-03_h4Pnn3jA",
    "platform": "youtube",
    "category": "p1",
    "title": "ALL OF ME (3) by Ponpon Chen live at The Barkley #JoeNDancer",
    "date": "2025-05-04",
    "embedUrl": "03_h4Pnn3jA",
    "thumbnailUrl": "https://i.ytimg.com/vi/03_h4Pnn3jA/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-WB2B_y2jbhQ",
    "platform": "youtube",
    "category": "p1",
    "title": "IF I HAD YOU (2) by Ponpon Chen live at The Barkley",
    "date": "2025-05-03",
    "embedUrl": "WB2B_y2jbhQ",
    "thumbnailUrl": "https://i.ytimg.com/vi/WB2B_y2jbhQ/hqdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-fb-1347708726174990",
    "platform": "facebook",
    "category": "p1",
    "title": "Ponpon Chen 陳芃瑄 - I’ve never been in love before",
    "date": "2023-08-31",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/ponpon0405/videos/1347708726174990/&show_text=0&width=500",
    "isFeatured": false
  },
  {
    "id": "v-4myuA0yusHE",
    "platform": "youtube",
    "category": "p1",
    "title": "陳芃瑄Ponpon - 找到一樣在邊緣徘徊中的你｜Music Video",
    "date": "2022-09-03",
    "embedUrl": "4myuA0yusHE",
    "thumbnailUrl": "https://i.ytimg.com/vi/4myuA0yusHE/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-jPLzOi0IRiU",
    "platform": "youtube",
    "category": "p1",
    "title": "陳芃瑄Ponpon - 無畏無謂 | Live Video",
    "date": "2022-07-23",
    "embedUrl": "jPLzOi0IRiU",
    "thumbnailUrl": "https://i.ytimg.com/vi/jPLzOi0IRiU/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-6mbNk1uqzns",
    "platform": "youtube",
    "category": "p1",
    "title": "陳芃瑄Ponpon - 愛的代價 The price of love | Live Video",
    "date": "2022-07-23",
    "embedUrl": "6mbNk1uqzns",
    "thumbnailUrl": "https://i.ytimg.com/vi/6mbNk1uqzns/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-5IMYZKvUgTY",
    "platform": "youtube",
    "category": "p1",
    "title": "陳芃瑄Ponpon - On The Sunny Side Of The Street | Live Video",
    "date": "2022-07-23",
    "embedUrl": "5IMYZKvUgTY",
    "thumbnailUrl": "https://i.ytimg.com/vi/5IMYZKvUgTY/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-5_Z4G6ar7d4",
    "platform": "youtube",
    "category": "p1",
    "title": "陳芃瑄 [周休六日]￼",
    "date": "2022-02-02",
    "embedUrl": "5_Z4G6ar7d4",
    "thumbnailUrl": "https://i.ytimg.com/vi/5_Z4G6ar7d4/hqdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-EOqoo_513Ic",
    "platform": "youtube",
    "category": "p1",
    "title": "木匠兄妹The Carpenters【Top of the world 】 Cover by 陳芃瑄 Ponpon Chen（Live At Oldie Goodie）",
    "date": "2021-05-14",
    "embedUrl": "EOqoo_513Ic",
    "thumbnailUrl": "https://i.ytimg.com/vi/EOqoo_513Ic/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-p53N4_5HdmE",
    "platform": "youtube",
    "category": "p1",
    "title": "盧廣仲 Crowd Lu 【100種生活 100 Kinds of Living】 Cover by 陳芃瑄 Ponpon",
    "date": "2020-12-25",
    "embedUrl": "p53N4_5HdmE",
    "thumbnailUrl": "https://i.ytimg.com/vi/p53N4_5HdmE/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-jCo0cspQ65M",
    "platform": "youtube",
    "category": "p1",
    "title": "陳綺貞 Cheer Chen -【After 17】 Cover by 陳芃瑄 Ponpon",
    "date": "2020-12-11",
    "embedUrl": "jCo0cspQ65M",
    "thumbnailUrl": "https://i.ytimg.com/vi/jCo0cspQ65M/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-noykxfdrOnw",
    "platform": "youtube",
    "category": "p1",
    "title": "木匠兄妹The carpenters【Top of the world 】 Cover by 陳芃瑄 Ponpon",
    "date": "2021-02-09",
    "embedUrl": "noykxfdrOnw",
    "thumbnailUrl": "https://i.ytimg.com/vi/noykxfdrOnw/maxresdefault.jpg",
    "isFeatured": false
  },

  {
    "id": "v-5lPml-yAc2I",
    "platform": "youtube",
    "category": "p7",
    "title": "【聲林之王2】Ep13 陳芃瑄精華片段｜踢館小魔王馬來貘年僅17歲 吉他彈唱陳綺貞《台北某個地方》獲得三位導師一致好評",
    "date": "2019-11-17",
    "embedUrl": "5lPml-yAc2I",
    "thumbnailUrl": "https://i.ytimg.com/vi/5lPml-yAc2I/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-JNy94_bUgx0",
    "platform": "youtube",
    "category": "p7",
    "title": "【我想和你唱3】Ep2 陳芃瑄精華片段｜TFBOYS王源搭檔元氣少女陳芃瑄 清新溫暖薄荷音同台合唱《我們的時光》《十七》《第一天》《驕傲》",
    "date": "2018-05-04",
    "embedUrl": "JNy94_bUgx0",
    "thumbnailUrl": "https://i.ytimg.com/vi/JNy94_bUgx0/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-wINZhpe7ZSY",
    "platform": "youtube",
    "category": "p7",
    "title": "【希望之星】陳芃瑄《葉子》〈EP3 20171021〉",
    "date": "2017-10-21",
    "embedUrl": "wINZhpe7ZSY",
    "thumbnailUrl": "https://i.ytimg.com/vi/wINZhpe7ZSY/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-D4eou5cff68",
    "platform": "youtube",
    "category": "p7",
    "title": "Ponpon Chen 陳芃瑄 2016 伊林璀璨之星演藝組冠軍高光與訪問 (Performing Arts Champion Highlights & Interview)",
    "date": "2016-08-23",
    "embedUrl": "D4eou5cff68",
    "thumbnailUrl": "https://i.ytimg.com/vi/D4eou5cff68/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-zQf79JxO9k4",
    "platform": "youtube",
    "category": "p7",
    "title": "仁中校慶星光大道決賽 陳芃瑄 張宗奇",
    "date": "2015-10",
    "embedUrl": "zQf79JxO9k4",
    "thumbnailUrl": "https://i.ytimg.com/vi/zQf79JxO9k4/hqdefault.jpg",
    "isFeatured": false
  },


  {
    "id": "v-LHz2Y36D4bM",
    "platform": "youtube",
    "category": "p6",
    "title": "Ponpon Chen(陳芃瑄) - Christmas Song Medley (Taipei & Los Angeles) 陳芃瑄 - 耶誕暖心歌曲串燒 (台北 & 洛杉磯)",
    "date": "2026-04-10",
    "embedUrl": "LHz2Y36D4bM",
    "thumbnailUrl": "https://i.ytimg.com/vi/LHz2Y36D4bM/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-3UbzT0qT1w8",
    "platform": "youtube",
    "category": "p6",
    "title": "他們都笑了 They All Laugh｜Ponpon Chen 陳芃瑄  Highlights of Joyful Moments",
    "date": "2025-11-07",
    "embedUrl": "3UbzT0qT1w8",
    "thumbnailUrl": "https://i.ytimg.com/vi/3UbzT0qT1w8/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-tEqs-1S47Fw",
    "platform": "youtube",
    "category": "p6",
    "title": "Ponpon Chen  陳芃瑄– Guitar, Scat Singing, Washboard & Whistling Highlights 吉他彈唱・即興哼唱・Washboard 打擊與口哨精華",
    "date": "2025-10-11",
    "embedUrl": "tEqs-1S47Fw",
    "thumbnailUrl": "https://i.ytimg.com/vi/tEqs-1S47Fw/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-nhcE4DW--A4",
    "platform": "youtube",
    "category": "p6",
    "title": "Ponpon Chen 陳芃瑄– Guitar, Scat Singing, Washboard, Shaker & Whistling Highlights",
    "date": "2025-10-06",
    "embedUrl": "nhcE4DW--A4",
    "thumbnailUrl": "https://i.ytimg.com/vi/nhcE4DW--A4/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-S_eBj6DrYOY",
    "platform": "youtube",
    "category": "p6",
    "title": "Ponpon Chen 陳芃瑄 即興哼唱 Scat Singing 精華 | Ponpon Chen Scat Singing Highlights",
    "date": "2025-10-04",
    "embedUrl": "S_eBj6DrYOY",
    "thumbnailUrl": "https://i.ytimg.com/vi/S_eBj6DrYOY/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-tIed1O57EPg",
    "platform": "youtube",
    "category": "p6",
    "title": "陳芃瑄 Ponpon Chen 微博早期翻唱精華(我還年輕 我還年輕&我愛你&魚仔&你不知道的事&真心話太冒險)",
    "date": "2025-09-26",
    "embedUrl": "tIed1O57EPg",
    "thumbnailUrl": "https://i.ytimg.com/vi/tIed1O57EPg/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-2GXGTsKk1hE",
    "platform": "youtube",
    "category": "p6",
    "title": "陳芃瑄 Ponpon Chen 微博早期翻唱精華(我不願讓你一個人&寵愛&如果沒有你&紙短情長)",
    "date": "2025-09-23",
    "embedUrl": "2GXGTsKk1hE",
    "thumbnailUrl": "https://i.ytimg.com/vi/2GXGTsKk1hE/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-QYjG_8KhaJY",
    "platform": "youtube",
    "category": "p6",
    "title": "陳芃瑄 Ponpon Chen 微博早期翻唱精華(被馴服的象&斑馬，斑馬&蒲公英的約定&陽光不鏽&因為遇見你)",
    "date": "2025-09-14",
    "embedUrl": "QYjG_8KhaJY",
    "thumbnailUrl": "https://i.ytimg.com/vi/QYjG_8KhaJY/maxresdefault.jpg",
    "isFeatured": false
  },


  {
    "id": "v-omov--yzMQw",
    "platform": "youtube",
    "category": "p2",
    "title": "Ponpon Chen 唱歌也太好聽了吧⋯⋯ #跳脫do式圈",
    "date": "2025-09",
    "embedUrl": "omov--yzMQw",
    "thumbnailUrl": "https://i.ytimg.com/vi/omov--yzMQw/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-XaiYQoDK6uM",
    "platform": "youtube",
    "category": "p2",
    "title": "They all laughed when Ponpon played some piano…😝 #1930s #Swing #Jazz #Vocals #Piano #fun",
    "date": "2025-02-21",
    "embedUrl": "XaiYQoDK6uM",
    "thumbnailUrl": "https://i.ytimg.com/vi/XaiYQoDK6uM/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-HC1NYr_GeaU",
    "platform": "youtube",
    "category": "p2",
    "title": "Ponpon Chen Jazzes Up \"On the Sunny Side of the Street\" Duo Performance! #jazz #duo #vocal #bass",
    "date": "2024-06",
    "embedUrl": "HC1NYr_GeaU",
    "thumbnailUrl": "https://i.ytimg.com/vi/HC1NYr_GeaU/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-bCBVW_Xs-NY",
    "platform": "youtube",
    "category": "p2",
    "title": "Ponpon's guitar solo over \"This I Dig Of You\" #1960s #swing #jazz #guitar #solo #livemusic",
    "date": "2024-06",
    "embedUrl": "bCBVW_Xs-NY",
    "thumbnailUrl": "https://i.ytimg.com/vi/bCBVW_Xs-NY/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-3p26J-MbuTY",
    "platform": "youtube",
    "category": "p2",
    "title": "Ponpon Chen's vocal sactting and guitar solo over \"But Not For Me\" (1930, Girl Crazy) #jazz #swing",
    "date": "2024-06",
    "embedUrl": "3p26J-MbuTY",
    "thumbnailUrl": "https://i.ytimg.com/vi/3p26J-MbuTY/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-11czxqFegzI",
    "platform": "youtube",
    "category": "p2",
    "title": "純淨嗓音｜#台北某個地方｜#陳芃瑄  #Shorts｜#聲林之王",
    "date": "2019-11-17",
    "embedUrl": "11czxqFegzI",
    "thumbnailUrl": "https://i.ytimg.com/vi/11czxqFegzI/maxresdefault.jpg",
    "isFeatured": false
  },


  {
    "id": "v-ZakfOT7pN6c",
    "platform": "youtube",
    "category": "p3",
    "title": "ジョージ・ベンソンスタイルの台湾人ジャズシンガーPONPON CHEN（ポンポンチェン：陳芃瑄）がおすすめ！",
    "date": "2026-01-25",
    "embedUrl": "ZakfOT7pN6c",
    "thumbnailUrl": "https://i.ytimg.com/vi/ZakfOT7pN6c/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-jtArmZvzigs",
    "platform": "youtube",
    "category": "p3",
    "title": "不是衝動休學　以精準計畫開啟美國爵士夢　需要勇氣更需要規畫　台灣女孩用行動證明自己｜叫我CEO｜鏡新聞調查報告｜#鏡新聞",
    "date": "2025-11-22",
    "embedUrl": "jtArmZvzigs",
    "thumbnailUrl": "https://i.ytimg.com/vi/jtArmZvzigs/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-Snovf3c8Qnk",
    "platform": "youtube",
    "category": "p3",
    "title": "Ponpon Chen 陳芃瑄 - The Moon Represents My Heart 月亮代表我的心(Live @ Biscuits & Blues), A Layman's Reaction",
    "date": "2025-11-21",
    "embedUrl": "Snovf3c8Qnk",
    "thumbnailUrl": "https://i.ytimg.com/vi/Snovf3c8Qnk/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-7GvGhrEkp80",
    "platform": "youtube",
    "category": "p3",
    "title": "EP125｜休學勇闖洛杉磯追夢！連 ABC News 都看到她的爵士實力！feat.Ponpon Chen 陳芃瑄 @ponponchen2002",
    "date": "2025-09-15",
    "embedUrl": "7GvGhrEkp80",
    "thumbnailUrl": "https://i.ytimg.com/vi/7GvGhrEkp80/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-425ULiZebD8",
    "platform": "youtube",
    "category": "p3",
    "title": "Ponpon Chen (with her quintet performed at Cicada Restaurant) - Them There Eyes. A Layman's Reaction",
    "date": "2025-07-28",
    "embedUrl": "425ULiZebD8",
    "thumbnailUrl": "https://i.ytimg.com/vi/425ULiZebD8/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-aswtSPQCcOU",
    "platform": "youtube",
    "category": "p3",
    "title": "23歲台灣歌手陳芃瑄　登ABC新聞片尾 | 中央社影音新聞",
    "date": "2025-07-19",
    "embedUrl": "aswtSPQCcOU",
    "thumbnailUrl": "https://i.ytimg.com/vi/aswtSPQCcOU/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-DbZEcTrNNyw",
    "platform": "youtube",
    "category": "p3",
    "title": "歌もギターもチャーミングなPonpon Chen【Aji Radio 94】",
    "date": "2025-05-28",
    "embedUrl": "DbZEcTrNNyw",
    "thumbnailUrl": "https://i.ytimg.com/vi/DbZEcTrNNyw/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-2j1KwBp28Nk",
    "platform": "youtube",
    "category": "p3",
    "title": "陳芃瑄Ponpon - 找到一樣在邊緣徘徊中的你｜MV 花絮",
    "date": "2022-09-10",
    "embedUrl": "2j1KwBp28Nk",
    "thumbnailUrl": "https://i.ytimg.com/vi/2j1KwBp28Nk/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-music-corner",
    "platform": "facebook",
    "category": "p5",
    "title": "Music Corner 角落音樂餐廳",
    "date": "2026-02-04",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1177729904529661&show_text=false&width=316&t=0",
    "isFeatured": false
  },
  {
    "id": "v-fb-cat821",
    "platform": "facebook",
    "category": "p5",
    "title": "Ponpon Chen Quintet at View Music Bar",
    "date": "2025-09-05",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcat821%2Fvideos%2F1786267441981450%2F&show_text=false&width=316&t=0",
    "isFeatured": false
  },
  {
    "id": "v-0uxWxdIMtbk",
    "platform": "youtube",
    "category": "p5",
    "title": "Ponpon Chen 陳芃瑄 - On the Sunny Side of the Street (Stella Chen)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "0uxWxdIMtbk",
    "thumbnailUrl": "https://i.ytimg.com/vi/0uxWxdIMtbk/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-t9ajbW_ge5U",
    "platform": "youtube",
    "category": "p5",
    "title": "Ponpon Chen 陳芃瑄 - Them There Eyes (Stella Chen)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "t9ajbW_ge5U",
    "thumbnailUrl": "https://i.ytimg.com/vi/t9ajbW_ge5U/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-cFz6HHFAZ18",
    "platform": "youtube",
    "category": "p5",
    "title": "Ponpon Chen 陳芃瑄 - Almost Like Being in Love (Stella Chen)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "cFz6HHFAZ18",
    "thumbnailUrl": "https://i.ytimg.com/vi/cFz6HHFAZ18/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-479YPbzDjBE",
    "platform": "youtube",
    "category": "p5",
    "title": "Ponpon Chen 陳芃瑄 - On the Sunny Side of the Street (Fu-Tien Chiou)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "479YPbzDjBE",
    "thumbnailUrl": "https://i.ytimg.com/vi/479YPbzDjBE/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-FQ8HoS0HQxg",
    "platform": "youtube",
    "category": "p5",
    "title": "The Frim-Fram Sauce cover by PonPon Chen (Fu-Tien Chiou)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "FQ8HoS0HQxg",
    "thumbnailUrl": "https://i.ytimg.com/vi/FQ8HoS0HQxg/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-S57lXI0jQ_o",
    "platform": "youtube",
    "category": "p5",
    "title": "Moon River by PonPon Chen (Fu-Tien Chiou)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "S57lXI0jQ_o",
    "thumbnailUrl": "https://i.ytimg.com/vi/S57lXI0jQ_o/maxresdefault.jpg",
    "isFeatured": false
  },

  {
    "id": "v-p3v2XboDUEU",
    "platform": "youtube",
    "category": "p5",
    "title": "Ponpon Chen 陳芃瑄 - Benny's From Heaven (Stella Chen)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "p3v2XboDUEU",
    "thumbnailUrl": "https://i.ytimg.com/vi/p3v2XboDUEU/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-ZvreeOM6rKg",
    "platform": "youtube",
    "category": "p5",
    "title": "Ponpon Chen 陳芃瑄 - Skylark (Stella Chen)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "ZvreeOM6rKg",
    "thumbnailUrl": "https://i.ytimg.com/vi/ZvreeOM6rKg/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-YEK5rj1BSe4",
    "platform": "youtube",
    "category": "p5",
    "title": "Ponpon Chen 陳芃瑄 - How High the Moon (Stella Chen)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "YEK5rj1BSe4",
    "thumbnailUrl": "https://i.ytimg.com/vi/YEK5rj1BSe4/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-ATPRb9TE41w",
    "platform": "youtube",
    "category": "p5",
    "title": "Ponpon Chen 陳芃瑄 - The Frim-Fram Sauce (Stella Chen)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "ATPRb9TE41w",
    "thumbnailUrl": "https://i.ytimg.com/vi/ATPRb9TE41w/maxresdefault.jpg",
    "isFeatured": false
  },

  {
    "id": "v-kuJ4iRKAwz8",
    "platform": "youtube",
    "category": "p5",
    "title": "Ponpon Chen 陳芃瑄 - Destination Moon (Stella Chen)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "kuJ4iRKAwz8",
    "thumbnailUrl": "https://i.ytimg.com/vi/kuJ4iRKAwz8/maxresdefault.jpg",
    "isFeatured": false
  },

  {
    "id": "v-LcM-CXK7VJo",
    "platform": "youtube",
    "category": "p5",
    "title": "Ponpon Chen 陳芃瑄 - How High the Moon scatting (Stella Chen)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "LcM-CXK7VJo",
    "thumbnailUrl": "https://i.ytimg.com/vi/LcM-CXK7VJo/maxresdefault.jpg",
    "isFeatured": false
  },

  {
    "id": "v-uEnrXSQpXDY",
    "platform": "youtube",
    "category": "p5",
    "title": "Ponpon Chen 陳芃瑄 - Benny's From Heaven-2 (Stella Chen)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "uEnrXSQpXDY",
    "thumbnailUrl": "https://i.ytimg.com/vi/uEnrXSQpXDY/maxresdefault.jpg",
    "isFeatured": false
  },

  {
    "id": "v-ORpAsB_xC8c",
    "platform": "youtube",
    "category": "p5",
    "title": "Sway - cover by PonPon Chen (Fu-Tien Chiou)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "ORpAsB_xC8c",
    "thumbnailUrl": "https://i.ytimg.com/vi/ORpAsB_xC8c/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-KemQ67OBJCk",
    "platform": "youtube",
    "category": "p5",
    "title": "Skylark - cover by PonPon Chen (Fu-Tien Chiou)",
    "date": "2025-07-27",
    "eventGroup": "Arcadia Elks Lodge (2025-07-27)",
    "embedUrl": "KemQ67OBJCk",
    "thumbnailUrl": "https://i.ytimg.com/vi/KemQ67OBJCk/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-threads-riverside-20241213",
    "platform": "threads",
    "category": "p5",
    "title": "Ponpon Chen & 古皓｜Scatting 擬聲吟唱即興現場 @河岸留言",
    "date": "2024-12-13",
    "embedUrl": "https://www.threads.net/@singaporeanintaipei/post/DDhn0bKzMn9",
    "thumbnailUrl": "/threads-riverside.jpg",
    "isFeatured": false
  },
  {
    "id": "v-01XxA9Xze-U",
    "platform": "youtube",
    "category": "p8",
    "title": "Ponpon Chen 陳芃瑄 - All Of Me Scat Solo Transcription",
    "date": "2026-04-21",
    "embedUrl": "01XxA9Xze-U",
    "thumbnailUrl": "https://i.ytimg.com/vi/01XxA9Xze-U/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-NLcXFaTeCw4",
    "platform": "youtube",
    "category": "p8",
    "title": "Ponpon Chen 陳芃瑄 - But Not For Me Scat & Guitar Solo Transcription",
    "date": "2025-10-21",
    "embedUrl": "NLcXFaTeCw4",
    "thumbnailUrl": "https://i.ytimg.com/vi/NLcXFaTeCw4/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-ZoRF-C-fzOg",
    "platform": "youtube",
    "category": "p8",
    "title": "Ponpon Chen - Fly Me To The Moon Cover (Tap Dance)",
    "date": "2026-01-16",
    "embedUrl": "ZoRF-C-fzOg",
    "thumbnailUrl": "https://i.ytimg.com/vi/ZoRF-C-fzOg/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-ZRvUJJ0MGa4",
    "platform": "youtube",
    "category": "p8",
    "title": "Ponpon & Colin - How high the Moon (Acoustic Fretless Bass)",
    "date": "2025-07-21",
    "embedUrl": "ZRvUJJ0MGa4",
    "thumbnailUrl": "https://i.ytimg.com/vi/ZRvUJJ0MGa4/maxresdefault.jpg",
    "isFeatured": false
  },
  {
    "id": "v-ig-DWhAwQeiJqa",
    "platform": "instagram",
    "category": "p8",
    "title": "Ponpon Chen - How high the moon (Guitar Cover)",
    "date": "2026-03-31",
    "embedUrl": "DWhAwQeiJqa",
    "thumbnailUrl": "/ig-DWhAwQeiJqa.png",
    "isFeatured": false
  }
];
