import sys, json

sys.stdout = open('src/locales/fix_output.txt', 'w', encoding='utf-8')

with open('src/locales/zh.json', 'rb') as f:
    raw = f.read()

text = raw.decode('utf-8', errors='replace')

# Find replacement chars
idx = 0
count = 0
while True:
    idx = text.find('\ufffd', idx)
    if idx == -1:
        break
    print(f'Bad char at text pos {idx}:')
    print('  Context:', repr(text[max(0,idx-200):idx+200]))
    print()
    idx += 1
    count += 1

print(f'Total bad chars: {count}')
sys.stdout.close()
