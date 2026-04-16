import fs from 'fs';
async function check() {
  const res1 = await fetch('https://www.rti.org.tw/programnews?uid=4&pid=99800');
  const text1 = await res1.text();
  const title1 = text1.match(/<title>(.*?)<\/title>/i);
  const date1 = text1.match(/<div class="date[^>]*>(.*?)<\/div>/i) || text1.match(/202[0-9]-[0-9]{2}-[0-9]{2}/);
  
  const res2 = await fetch('https://www.rti.org.tw/programnews?uid=4&pid=100400');
  const text2 = await res2.text();
  const title2 = text2.match(/<title>(.*?)<\/title>/i);
  const date2 = text2.match(/<div class="date[^>]*>(.*?)<\/div>/i) || text2.match(/202[0-9]-[0-9]{2}-[0-9]{2}/);

  console.log('1:', title1?.[1], date1?.[0]);
  console.log('2:', title2?.[1], date2?.[0]);
}
check();
