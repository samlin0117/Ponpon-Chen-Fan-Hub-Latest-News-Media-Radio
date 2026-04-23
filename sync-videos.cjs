const fs = require('fs');
const https = require('https');

const API_KEY = 'AIzaSyAp5UXwfKe-UJez2uraOdQ0q8147iuBiko';

const PLAYLISTS = [
  { id: 'PLLwWHVIUlB8lzbav-7ETbHfJhDqZDOkJj', category: 'p1' },
  { id: 'PLLwWHVIUlB8lbrhitwdm9yq5MhKKn_lNT', category: 'p2' },
  { id: 'PLLwWHVIUlB8llQJXiVeWR7vSSsg8Ink4e', category: 'p3' },
  { id: 'PLLwWHVIUlB8ltR-2B1q4ZAFnQm6NOGxJq', category: 'p4' }
];

const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
};

async function main() {
  let allVideos = [];
  
  for (const pl of PLAYLISTS) {
    let nextPageToken = '';
    do {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${pl.id}&key=${API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      const data = await fetchJson(url);
      
      if (data.items) {
        for (const item of data.items) {
          const title = item.snippet.title;
          if (title === 'Private video' || title === 'Deleted video') continue;
          
          const thumbnails = item.snippet.thumbnails;
          const thumbnailUrl = thumbnails?.maxres?.url || thumbnails?.high?.url || thumbnails?.medium?.url || thumbnails?.default?.url || '';

          allVideos.push({
            id: `v-${item.snippet.resourceId.videoId}`,
            platform: 'youtube',
            category: pl.category,
            title: title.replace(/"/g, '\\"'),
            date: item.snippet.publishedAt.split('T')[0],
            embedUrl: item.snippet.resourceId.videoId,
            thumbnailUrl: thumbnailUrl,
            isFeatured: false
          });
        }
      }
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);
  }
  
  // Set some featured videos based on known IDs
  const featuredIds = ['KmhrMOit4dI', '1Fnnr4TOjVQ', 'HCUE2cDCOqs', '_BVm-hixXt4', 'PwxGVbZvWXI'];
  allVideos = allVideos.map(v => {
    if (featuredIds.includes(v.embedUrl)) {
      v.isFeatured = true;
    }
    return v;
  });

  // Add the facebook video
  allVideos.push({
    id: "v-music-corner",
    platform: "facebook",
    category: "p5",
    title: "Music Corner 角落音樂餐廳",
    date: "2026-02-04",
    embedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1177729904529661&show_text=false&width=316&t=0",
    isFeatured: false
  });

  allVideos.push({
    id: "v-fb-cat821",
    platform: "facebook",
    category: "p5",
    title: "Ponpon Chen Quintet at View Music Bar",
    date: "2025-09-05",
    embedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcat821%2Fvideos%2F1786267441981450%2F&show_text=false&width=316&t=0",
    isFeatured: false
  });

  const fileContent = `export type Platform = 'youtube' | 'facebook' | 'instagram' | 'threads';

export interface VideoInfo {
  id: string;
  platform: Platform;
  category: 'p1' | 'p2' | 'p3' | 'p4' | 'p5';
  title: string;
  date: string;
  embedUrl: string;
  thumbnailUrl?: string;
  isFeatured: boolean;
}

export const videoList: VideoInfo[] = ${JSON.stringify(allVideos, null, 2)};
`;

  fs.writeFileSync('./src/data/videos.ts', fileContent);
  console.log(`Successfully synced ${allVideos.length} videos!`);
}

main().catch(console.error);
