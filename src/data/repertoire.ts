export interface RepertoireSong {
  id: string;
  year: string;
  composer: string;
  lyricsLink?: string;
  youtubeId?: string;
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
  }
];
