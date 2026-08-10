import cv2
import yt_dlp
import sys
import urllib.request
import os

url = "https://www.instagram.com/reel/DWywNjjE7uu/"

ydl_opts = {
    'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    'quiet': True
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=False)
        video_url = info_dict.get("url", None)

    if not video_url:
        # try to get the first video format URL
        for f in info_dict.get('formats', []):
            if f.get('vcodec') != 'none' and f.get('ext') == 'mp4':
                video_url = f.get('url')
                break

    print(f"Video URL: {video_url}")

    if not video_url:
        print("Could not find video URL.")
        sys.exit(1)

    cap = cv2.VideoCapture(video_url)
    if not cap.isOpened():
        print("Cannot open video stream")
        sys.exit(1)

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:
        fps = 30 # default assumption
    
    # Let's get the frame at 10 seconds
    target_frame = int(fps * 10)
    cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)
    
    ret, frame = cap.read()
    if ret:
        cv2.imwrite("public/ig-DWywNjjE7uu.jpg", frame)
        print("Successfully saved frame to public/ig-DWywNjjE7uu.jpg")
    else:
        print("Failed to read frame at 10s. Trying 5s...")
        target_frame = int(fps * 5)
        cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)
        ret, frame = cap.read()
        if ret:
            cv2.imwrite("public/ig-DWywNjjE7uu.jpg", frame)
            print("Successfully saved frame to public/ig-DWywNjjE7uu.jpg")
        else:
            print("Failed to read frame at 5s too.")

    cap.release()
except Exception as e:
    print(f"Error: {e}")
