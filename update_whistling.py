import json
import codecs

def update_zh(filepath):
    with codecs.open(filepath, 'r', 'utf-8') as f:
        data = json.load(f)
    bg = data['repertoire']['songs']['bennys-from-heaven']['background']
    bg = bg.replace('成功地將這種帶有脫口秀性質的 Vocalese 爵士風格，以極具個人魅力的方式呈現給觀眾，讓全場充滿了笑聲與驚喜。', '成功地將這種帶有脫口秀性質的 Vocalese 爵士風格，以極具個人魅力的方式呈現給觀眾。此外，她還在演出中巧妙地融入了她的招牌絕活「口哨即興（Whistling）」，清脆靈動的口哨聲不僅豐富了音樂層次，更讓全場充滿了笑聲與驚喜。')
    data['repertoire']['songs']['bennys-from-heaven']['background'] = bg
    with codecs.open(filepath, 'w', 'utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def update_en(filepath):
    with codecs.open(filepath, 'r', 'utf-8') as f:
        data = json.load(f)
    bg = data['repertoire']['songs']['bennys-from-heaven']['background']
    bg = bg.replace('She successfully delivers the stand-up comedy essence of Vocalese jazz, keeping the audience engaged and filling the room with laughter and delight.', 'She successfully delivers the stand-up comedy essence of Vocalese jazz, keeping the audience engaged. Moreover, she brilliantly incorporates her signature "whistling improvisation" into the performance. The clear, lively whistling not only enriches the musical texture but also fills the room with laughter and delight.')
    data['repertoire']['songs']['bennys-from-heaven']['background'] = bg
    with codecs.open(filepath, 'w', 'utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def update_ja(filepath):
    with codecs.open(filepath, 'r', 'utf-8') as f:
        data = json.load(f)
    bg = data['repertoire']['songs']['bennys-from-heaven']['background']
    bg = bg.replace('スタンドアップコメディのようなヴォカリーズの魅力を、彼女独自のスタイルで見事に表現し、会場を笑いと驚きで包み込みました。', 'スタンドアップコメディのようなヴォカリーズの魅力を、彼女独自のスタイルで見事に表現しています。さらに、パフォーマンスの中では彼女の代名詞とも言える絶技「口笛の即興演奏（Whistling）」を巧みに取り入れています。軽快で澄んだ口笛の音色が音楽に豊かな層を加え、会場を笑いと驚きで包み込みました。')
    data['repertoire']['songs']['bennys-from-heaven']['background'] = bg
    with codecs.open(filepath, 'w', 'utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

update_zh(r'src\locales\zh.json')
update_en(r'src\locales\en.json')
update_ja(r'src\locales\ja.json')
print('done')
