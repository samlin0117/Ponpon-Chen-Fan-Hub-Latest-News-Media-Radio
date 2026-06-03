import urllib.request
import re

urls = ['https://www.instagram.com/reel/DWhAwQeiJqa/']
for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        date_match = re.search(r'"uploadDate":"(.*?)"', html)
        title_match = re.search(r'<title>(.*?)</title>', html)
        with open('ig_info.txt', 'w', encoding='utf-8') as f:
            f.write(f"Date: {date_match.group(1) if date_match else 'Not found'}\n")
            f.write(f"Title: {title_match.group(1) if title_match else 'Not found'}\n")
    except Exception as e:
        with open('ig_info.txt', 'w', encoding='utf-8') as f:
            f.write(str(e))
