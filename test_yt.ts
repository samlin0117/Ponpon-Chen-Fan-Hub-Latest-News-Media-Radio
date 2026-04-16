async function test() {
  try {
    const res = await fetch('https://vid.puffyan.us/api/v1/playlists/PLLwWHVIUlB8lzbav-7ETbHfJhDqZDOkJj');
    console.log(res.status);
    const data = await res.json();
    console.log(data.videos ? data.videos.length : 'no videos');
    if (data.videos) console.log(data.videos[0].title);
  } catch (e) {
    console.log(e);
  }
}
test();
