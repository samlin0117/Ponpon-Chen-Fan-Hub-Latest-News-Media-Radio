import urllib.request
import re

url = 'https://www.instagram.com/reel/DWhAwQeiJqa/'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    og_image = re.search(r'<meta property="og:image" content="(.*?)"', html)
    if og_image:
        print(f"Found OG image: {og_image.group(1)}")
    else:
        print("OG image not found")
except Exception as e:
    print(f"Error: {e}")
