import urllib.request
import re
import json

urls = [
    'https://www.instagram.com/reels/DJbeXx1z078/',
    'https://www.instagram.com/reels/DWywNjjE7uu/',
    'https://www.instagram.com/reels/DXrpoJFjWeK/',
    'https://www.instagram.com/reels/DJ7CPUezm1q/'
]

results = []
for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        title_match = re.search(r'<title>(.*?)</title>', html)
        title = title_match.group(1).replace('Instagram', '').strip('- ') if title_match else ""
        
        # Meta title sometimes has better title without "Instagram"
        meta_title_match = re.search(r'<meta property="og:title" content="(.*?)"', html)
        if meta_title_match:
            title = meta_title_match.group(1).strip()
            
        og_image = re.search(r'<meta property="og:image" content="(.*?)"', html)
        image_url = og_image.group(1).replace("&amp;", "&") if og_image else ""
        
        results.append({
            "url": url,
            "title": title,
            "image": image_url
        })
    except Exception as e:
        print(f"Error fetching {url}: {e}")

print(json.dumps(results, indent=2, ensure_ascii=False))
