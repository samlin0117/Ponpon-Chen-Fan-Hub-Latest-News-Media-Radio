import subprocess, json

urls = [
    'https://www.instagram.com/reels/DJbeXx1z078/',
    'https://www.instagram.com/reels/DWywNjjE7uu/',
    'https://www.instagram.com/reels/DXrpoJFjWeK/',
    'https://www.instagram.com/reels/DJ7CPUezm1q/'
]

with open("desc.txt", "w", encoding="utf-8") as f:
    for url in urls:
        result = subprocess.run(['yt-dlp', '--dump-json', url], capture_output=True, text=True, encoding='utf-8')
        if result.returncode == 0:
            data = json.loads(result.stdout)
            desc = data.get('description', '').split('\n')[0]
            f.write(f'{url}: {desc}\n')
