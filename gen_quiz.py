import json

def main():
    with open(r'src\locales\en.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    questions = data['quiz']['questions']
    md_lines = ["# Ponpon Fan Quiz (English)", ""]

    for idx, q in enumerate(questions, 1):
        md_lines.append(f"{idx}. {q['question']}\n")
        for opt_idx, opt in enumerate(q['options']):
            if opt_idx == q['correctAnswer']:
                md_lines.append(f"⊙ {opt}")
            else:
                md_lines.append(f"○ {opt}")
        md_lines.append(f"\n解答說明: {q['explanation']}\n")
        md_lines.append("---")
        md_lines.append("")

    with open('quiz_en.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(md_lines))

if __name__ == "__main__":
    main()
