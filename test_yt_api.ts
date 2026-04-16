async function test() {
  const key = 'AIzaSyAp5UXwfKe-UJez2uraOdQ0q8147iuBiko';
  const playlistId = 'PLLwWHVIUlB8lzbav-7ETbHfJhDqZDOkJj';
  const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=${playlistId}&key=${key}`);
  console.log(res.status);
  const data = await res.json();
  if (data.items) {
    console.log(data.items[0].snippet.title);
  } else {
    console.log(data);
  }
}
test();
