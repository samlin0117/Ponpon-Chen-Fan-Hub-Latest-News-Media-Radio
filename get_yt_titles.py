import urllib.request
import re
import html

urls = [
    'https://www.youtube.com/watch?v=01XxA9Xze-U', 
    'https://www.youtube.com/watch?v=NLcXFaTeCw4',
    'https://www.youtube.com/watch?v=ZRvUJJ0MGa4'
]

with open('yt_titles.txt', 'w', encoding='utf-8') as f:
    for url in urls:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            page = urllib.request.urlopen(req).read().decode('utf-8')
            title_match = re.search(r'<title>(.*?)</title>', page)
            if title_match:
                title = html.unescape(title_match.group(1)).replace(' - YouTube', '')
                f.write(f"{url}: {title}\n")
            else:
                f.write(f"{url}: Title not found\n")
        except Exception as e:
            f.write(f"{url}: Error {e}\n")
