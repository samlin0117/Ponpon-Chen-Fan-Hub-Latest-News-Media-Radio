async function check() {
  const res = await fetch('https://www.rti.org.tw/api/program/news/99800');
  console.log(res.status);
  console.log(await res.text());
}
check();
