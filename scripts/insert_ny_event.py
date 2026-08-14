with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Item strictly following existing UI format
new_item = """  {
    year: '2026年8月',
    title: '首次紐約公開演出',
    category: 'first',
    desc: '在紐約知名爵士俱樂部 Birdland Theater 登上《Frank Vignola\\'s Guitar Night》舞台擔任特邀嘉賓，帶來吉他、歌聲與口哨即興演奏。',
    links: [
      { text: '點此觀看演出精華', url: 'https://www.youtube.com/watch?v=gUXx6-WK-V0' }
    ]
  },
"""

marker = "const timelineItems: TimelineItem[] = ["
if marker in text:
    text = text.replace(marker, marker + "\n" + new_item, 1)
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("ITEM_INSERTED_OK")
else:
    print("TIMELINE_MARKER_NOT_FOUND")
