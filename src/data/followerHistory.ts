// Instagram @ponponofficial_ 粉絲數變化紀錄 / Follower count history
// 資料來源 / Source: Social Blade — https://socialblade.com/instagram/user/ponponofficial_
//
// 更新方式：每個月月底到 Social Blade 查一次當前粉絲數，
// 把新的一筆 { date: 'YYYY-MM-DD', followers: 數字 } 加到陣列最後面即可。
// （2026 年 8 月為每日資料，記錄了粉絲數從 3.8 萬爆發成長到 4.8 萬的過程。）

export interface FollowerDataPoint {
  date: string; // YYYY-MM-DD
  followers: number;
  // 選填：這個日期粉絲數變化的原因。可填單一字串，或三語物件 { zh, en, ja }。
  note?: string | { zh?: string; en?: string; ja?: string };
}

export const followerHistory: FollowerDataPoint[] = [
  { date: '2026-08-01', followers: 38083 },
  { date: '2026-08-02', followers: 38151 },
  { date: '2026-08-03', followers: 38231 },
  { date: '2026-08-04', followers: 38244 },
  { date: '2026-08-05', followers: 38265 },
  { date: '2026-08-06', followers: 38330 },
  { date: '2026-08-07', followers: 38348 },
  { date: '2026-08-08', followers: 38396 },
  { date: '2026-08-09', followers: 38415 },
  { date: '2026-08-10', followers: 38432 },
  { date: '2026-08-11', followers: 38445 },
  { date: '2026-08-12', followers: 38457 },
  { date: '2026-08-13', followers: 38477 },
  { date: '2026-08-14', followers: 38515 },
  { date: '2026-08-15', followers: 38872 },
  { date: '2026-08-16', followers: 39386 },
  { date: '2026-08-17', followers: 40399 },
  { date: '2026-08-18', followers: 40727 },
  { date: '2026-08-19', followers: 41054 },
  { date: '2026-08-20', followers: 41201 },
  { date: '2026-08-21', followers: 41333 },
  {
    date: '2026-08-22',
    followers: 44667,
    note: {
      zh: 'Ponpon 在 IG 發布〈How High The Moon〉短影音爆紅，單日粉絲數 +3,334。',
      en: 'Ponpon\'s "How High The Moon" short went viral on Instagram — +3,334 followers in a day.',
      ja: 'PonponがInstagramに投稿した「How High The Moon」のショート動画がバズり、1日で+3,334フォロワー。',
    },
  },
  { date: '2026-08-23', followers: 45693 },
  { date: '2026-08-24', followers: 46234 },
  { date: '2026-08-25', followers: 46698 },
  { date: '2026-08-26', followers: 47012 },
  { date: '2026-08-27', followers: 47308 },
  { date: '2026-08-28', followers: 47640 },
  { date: '2026-08-29', followers: 47875 },
  { date: '2026-08-30', followers: 48061 },
  { date: '2026-08-31', followers: 48148 },
];

export const followerProfile = {
  handle: 'ponponofficial_',
  url: 'https://www.instagram.com/ponponofficial_/',
  following: 943,
  posts: 115,
  lastUpdated: '2026-08-31',
};
