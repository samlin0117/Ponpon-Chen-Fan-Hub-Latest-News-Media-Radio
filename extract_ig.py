import subprocess
import json

urls = [
    'https://www.instagram.com/reels/DJbeXx1z078/',
    'https://www.instagram.com/reels/DWywNjjE7uu/',
    'https://www.instagram.com/reels/DXrpoJFjWeK/',
    'https://www.instagram.com/reels/DJ7CPUezm1q/'
]

results = []
for url in urls:
    print(f"Processing {url}...")
    try:
        result = subprocess.run(['yt-dlp', '--dump-json', url], capture_output=True, text=True, encoding='utf-8')
        if result.returncode == 0:
            data = json.loads(result.stdout)
            results.append({
                'url': url,
                'title': data.get('title') or data.get('description') or '',
                'date': data.get('upload_date') or '', # YYYYMMDD
                'thumbnail': data.get('thumbnail') or ''
            })
        else:
            print(f"Error for {url}: {result.stderr}")
    except Exception as e:
        print(f"Exception for {url}: {e}")

print(json.dumps(results, ensure_ascii=False, indent=2))
