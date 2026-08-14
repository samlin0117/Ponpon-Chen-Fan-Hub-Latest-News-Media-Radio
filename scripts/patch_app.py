import base64
import os
import urllib.request
import json

# Read current App.tsx
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = """  const filteredTimelineItems = timelineItems.filter(item => {
    if (timelineFilter === 'all') return item.category !== 'first' && item.category !== 'album';
    return item.category === timelineFilter;
  });"""

replacement = """  const filteredTimelineItems = (() => {
    const result = timelineItems.filter(item => {
      if (timelineFilter === 'all') return item.category !== 'first' && item.category !== 'album';
      return item.category === timelineFilter;
    });
    if (timelineFilter === 'first') return [...result].reverse();
    return result;
  })();"""

if target in text:
    text = text.replace(target, replacement, 1)
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("SUCCESS")
elif "if (timelineFilter === 'first') return [...result].reverse();" in text:
    print("ALREADY_DONE")
else:
    print("TARGET_NOT_FOUND")
    # try looser match
    lines = text.split('\n')
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if 'const filteredTimelineItems = timelineItems.filter' in line:
            # find end of statement
            new_lines.append("  const filteredTimelineItems = (() => {")
            new_lines.append("    const result = timelineItems.filter(item => {")
            new_lines.append("      if (timelineFilter === 'all') return item.category !== 'first' && item.category !== 'album';")
            new_lines.append("      return item.category === timelineFilter;")
            new_lines.append("    });")
            new_lines.append("    if (timelineFilter === 'first') return [...result].reverse();")
            new_lines.append("    return result;")
            new_lines.append("  })();")
            # skip until ');'
            while i < len(lines) and ');' not in lines[i]:
                i += 1
            i += 1
            continue
        new_lines.append(line)
        i += 1
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))
    print("FALLBACK_REPLACED")
