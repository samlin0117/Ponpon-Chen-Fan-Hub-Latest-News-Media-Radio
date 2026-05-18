export interface RepertoireSong {
  id: string; // Used as key for localization
  year: string;
  composer: string;
  lyricsLink?: string;
  youtubeId?: string;
  videoLink?: string;
}

export const repertoireData: RepertoireSong[] = [
  {
    id: 'cheek-to-cheek',
    year: '1935',
    composer: 'Irving Berlin',
    lyricsLink: 'https://genius.com/Irving-berlin-cheek-to-cheek-lyrics',
    youtubeId: 'n28RVYQhuKg'
  },
  {
    id: 'fly-me-to-the-moon',
    year: '1954',
    composer: 'Bart Howard',
    lyricsLink: 'https://genius.com/Frank-sinatra-fly-me-to-the-moon-lyrics',
    youtubeId: 'iHhSNW5aqp8'
  },
  {
    id: 'all-of-me',
    year: '1931',
    composer: 'Gerald Marks, Seymour Simons',
    lyricsLink: 'https://genius.com/Billie-holiday-all-of-me-lyrics',
    youtubeId: '03_h4Pnn3jA'
  },
  {
    id: 'on-the-sunny-side',
    year: '1930',
    composer: 'Jimmy McHugh, Dorothy Fields',
    lyricsLink: 'https://genius.com/Billie-holiday-on-the-sunny-side-of-the-street-lyrics',
    youtubeId: '0uxWxdIMtbk'
  },
  {
    id: 'them-there-eyes',
    year: '1930',
    composer: 'Maceo Pinkard, Doris Tauber, William Tracey',
    lyricsLink: 'https://genius.com/Billie-holiday-them-there-eyes-lyrics',
    youtubeId: 'PwxGVbZvWXI'
  },
  {
    id: 'route-66',
    year: '1946',
    composer: 'Bobby Troup',
    lyricsLink: 'https://genius.com/Nat-king-cole-route-66-lyrics',
    youtubeId: 'TwpQd-D4Lf8'
  },
  {
    id: 'but-not-for-me',
    year: '1930',
    composer: 'George Gershwin, Ira Gershwin',
    lyricsLink: 'https://genius.com/Chet-baker-but-not-for-me-lyrics',
    youtubeId: 'KmhrMOit4dI'
  },
  {
    id: 'how-high-the-moon',
    year: '1940',
    composer: 'Morgan Lewis, Nancy Hamilton',
    lyricsLink: 'https://genius.com/Ella-fitzgerald-how-high-the-moon-lyrics',
    youtubeId: '_BVm-hixXt4'
  },
  {
    id: 'bennys-from-heaven',
    year: '1977',
    composer: 'Arthur Johnston, Eddie Jefferson',
    lyricsLink: 'https://www.lyrics.com/sublyric/190292/Eddie+Jefferson/Bennie%E2%80%99s+from+Heaven#google_vignette',
    youtubeId: 'p3v2XboDUEU'
  },
  {
    id: 'if-i-had-you',
    year: '1928',
    composer: 'Jimmy Campbell, Reginald Connelly, Ted Shapiro',
    lyricsLink: 'https://genius.com/Frank-sinatra-if-i-had-you-lyrics',
    youtubeId: 'WB2B_y2jbhQ'
  },
  {
    id: 'ive-never-been-in-love-before',
    year: '1950',
    composer: 'Frank Loesser',
    lyricsLink: 'https://genius.com/Chet-baker-ive-never-been-in-love-before-lyrics',
    youtubeId: 'ckiVCfDHduk'
  },
  {
    id: 'sway',
    year: '1953',
    composer: 'Pablo Beltrán Ruiz, Norman Gimbel',
    lyricsLink: 'https://www.azlyrics.com/lyrics/michaelbuble/sway.html',
    youtubeId: '5YdGLRsudOE'
  },
  {
    id: 'i-cant-give-you-anything-but-love',
    year: '1928',
    composer: 'Jimmy McHugh, Dorothy Fields',
    lyricsLink: 'https://www.azlyrics.com/lyrics/billieholiday/icantgiveyouanythingbutlove.html',
    videoLink: 'https://www.facebook.com/watch/?ref=embed_video&v=1387294209248782'
  }
];
