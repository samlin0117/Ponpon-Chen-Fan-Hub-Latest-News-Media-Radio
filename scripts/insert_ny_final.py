with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

ny_item = """  {
    year: '2026年8月',
    title: '首次紐約公開演出',
    category: 'first',
    desc: "在紐約知名爵士俱樂部 Birdland Theater 登上《Frank Vignola's Guitar Night》舞台擔任特邀嘉賓，帶來吉他、歌聲與口哨即興演奏。",
    links: [
      { text: '點此觀看演出精華', url: 'https://www.youtube.com/watch?v=gUXx6-WK-V0' }
    ]
  },
"""

# 先移除任何可能重複的項目
if "首次紐約公開演出" not in text:
    target_str = "category: 'first'"
    last_idx = text.rfind(target_str)
    if last_idx != -1:
        # 找到該 first 物件的結尾 '},'
        obj_end = text.find("},", last_idx)
        if obj_end != -1:
            insert_pos = obj_end + 2
            text = text[:insert_pos] + "\n" + ny_item + text[insert_pos:]
            with open('src/App.tsx', 'w', encoding='utf-8') as f:
                f.write(text)
            print("INSERTED_SUCCESSFULLY_AFTER_LAST_FIRST_ITEM")
        else:
            print("COULD_NOT_FIND_OBJECT_END")
    else:
        print("FIRST_CATEGORY_NOT_FOUND")
else:
    print("ALREADY_IN_APP_TSX")
