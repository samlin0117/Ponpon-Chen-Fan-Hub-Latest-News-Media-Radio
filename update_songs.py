import json
import codecs
import re

zh_data = {
    'title': 'How High The Moon',
    'background': '《How High The Moon》是爵士樂史上最具指標性的標準曲之一，更是咆勃爵士（Bebop）時代樂手們最愛用來即興較勁的經典和聲架構。<br/><br/>📍 時代背景：從百老匯到咆勃爵士的國歌<br/>這首歌誕生於 1940 年，最初是為百老匯音樂劇《Two for the Show》所寫。然而，真正讓它名留青史的，是 1940 年代咆勃爵士（Bebop）革命。由於它的和聲行進（Chord progression）極具挑戰性與流動感，當時的爵士巨匠如 Charlie Parker 等人，常以它的和絃為基礎，創作出全新的複雜旋律（例如著名的《Ornithology》）。這讓《How High The Moon》成為了爵士樂手證明自己即興實力的「終極試金石」。隨後，爵士天后 Ella Fitzgerald 更以這首歌展現了史上最偉大的 Scatting（擬聲吟唱）表演，將它推向了神壇。<br/><br/>🌧️ 歌曲意境與歌詞含意：遙不可及的愛與月亮<br/>歌詞將「愛情」與「月亮」相連繫，描繪一種思念與渴望。開頭唱道：「Somewhere there\'s music, how faint the tune / Somewhere there\'s heaven, how high the moon.」（某處有著微弱的音樂，某處有著天堂，而月亮有多高？）月亮在此象徵著遙不可及的愛情，當愛人不在身邊時，美好的事物似乎都顯得虛無縹緲。直到愛人出現，那些遙遠的音符與月光，才會真正照進心裡。<br/><br/>🌟 Ponpon 的演繹特色<br/>在這場演出中，Ponpon 首度在公開場合向觀眾展示了她的招牌絕活——「吉他與人聲 Scatting 同步」。她在影片中抱著爵士吉他，優雅而自信地以清亮慵懶的嗓音詮釋這首經典名曲。在歌曲中段的即興橋段，她巧妙地讓歌聲與吉他琴音合而為一，完美復刻了吉他大師 George Benson 的經典技巧。這種將極致的樂器技巧與人聲天賦結合的演出，不僅向咆勃時代的即興精神致敬，也為這首歷史悠久的爵士經典注入了屬於 Ponpon 的迷人火花。'
}

en_data = {
    'title': 'How High The Moon',
    'background': '"How High The Moon" is one of the most iconic standards in jazz history and famously served as the ultimate canvas for improvisation during the Bebop era.<br/><br/>📍 Historical Background: From Broadway to the Anthem of Bebop<br/>Composed in 1940 for the Broadway revue "Two for the Show," the song\'s true legacy was cemented during the Bebop revolution of the 1940s. Because of its challenging and endlessly flowing chord progression, jazz legends like Charlie Parker used its chords to compose entirely new, complex melodies (such as the famous "Ornithology"). This made "How High The Moon" the ultimate proving ground for a jazz musician\'s improvisational skills. Later, the First Lady of Song, Ella Fitzgerald, elevated it to legendary status with one of the greatest Scatting performances ever recorded.<br/><br/>🌧️ Atmosphere & Lyrical Meaning: An Unreachable Love<br/>The lyrics poetically link "love" to the "moon," illustrating deep longing and desire. The opening lines, "Somewhere there\'s music, how faint the tune / Somewhere there\'s heaven, how high the moon," use the moon as a metaphor for love that feels distant and unattainable. When a lover is far away, heaven and music seem faint and unreachable, waiting for love\'s return to bring them back to reality.<br/><br/>🌟 Ponpon\'s Interpretation<br/>In this performance, Ponpon showcases her signature talent to a public audience for the first time: her "synchronized guitar and vocal Scatting." Holding her jazz guitar, she gracefully delivers the classic melody with her clear, lazy, and captivating vocals. During the mid-song improvisation, she masterfully merges her voice with the guitar notes, perfectly recreating the iconic technique of jazz master George Benson. This flawless combination of instrumental virtuosity and vocal talent not only pays homage to the improvisational spirit of the Bebop era but also breathes a fresh, mesmerizing energy into this historic jazz standard.'
}

ja_data = {
    'title': 'How High The Moon',
    'background': '「How High The Moon」はジャズ史上最も象徴的なスタンダード曲の一つであり、ビバップ（Bebop）時代のミュージシャンたちが即興演奏の腕を競い合うための究極のキャンバスでした。<br/><br/>📍 時代背景：ブロードウェイからビバップのアンセムへ<br/>この曲は1940年にブロードウェイ・ミュージカル「Two for the Show」のために書かれました。しかし、この曲を真に歴史に刻んだのは、1940年代のビバップ革命です。その和音進行（コード進行）は非常に挑戦的で流動的であったため、チャーリー・パーカー（Charlie Parker）などの当時のジャズの巨匠たちは、このコードを基礎にして全く新しい複雑なメロディ（有名な「Ornithology」など）を作曲しました。これにより、「How High The Moon」はジャズミュージシャンの即興スキルを証明する究極の試金石となりました。その後、ジャズの女王エラ・フィッツジェラルド（Ella Fitzgerald）が歴史に残る素晴らしいスキャット（Scatting）パフォーマンスでこの曲を神格化させました。<br/><br/>🌧️ 楽曲の世界観と歌詞の意味：遥か彼方の愛と月<br/>歌詞は「愛」と「月」を結びつけ、深い切なさと切望を描いています。冒頭の「Somewhere there\'s music, how faint the tune / Somewhere there\'s heaven, how high the moon.」（どこかで音楽が鳴っている、なんてかすかなメロディ / どこかに天国がある、月はなんて高いのだろう）という一節では、月を遥か遠く手の届かない愛の象徴としています。愛する人がそばにいない時、天国や美しい音楽は虚無的に感じられ、愛の存在だけがそれらを現実のものにしてくれるのです。<br/><br/>🌟 Ponpon の演繹特色<br/>このパフォーマンスで、Ponponは彼女の代名詞とも言える絶技「ギターとボーカルのスキャット同期」を初めて公の場で披露しました。ジャズギターを抱え、透明感のあるアンニュイな歌声でこの名曲を優雅に歌い上げます。中盤の即興パートでは、彼女の歌声とギターの音色が完全に一体化し、ジャズギターの巨匠ジョージ・ベンソン（George Benson）のプレイスタイルを見事に再現しています。楽器の卓越した技巧とボーカルの才能を融合させたこの演奏は、ビバップ時代の即興精神へのオマージュであるだけでなく、歴史あるこのジャズ・スタンダードにPonponならではの魅力的な火花を吹き込んでいます。'
}

def update_json(filepath, data_to_insert):
    with codecs.open(filepath, 'r', 'utf-8') as f:
        data = json.load(f)
    
    data['repertoire']['songs']['how-high-the-moon'] = data_to_insert
    
    with codecs.open(filepath, 'w', 'utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

update_json(r'src\locales\zh.json', zh_data)
update_json(r'src\locales\en.json', en_data)
update_json(r'src\locales\ja.json', ja_data)

ts_path = r'src\data\repertoire.ts'
with codecs.open(ts_path, 'r', 'utf-8') as f:
    ts_content = f.read()

new_song = """  },
  {
    id: 'how-high-the-moon',
    year: '1940',
    composer: 'Morgan Lewis, Nancy Hamilton',
    lyricsLink: 'https://genius.com/Ella-fitzgerald-how-high-the-moon-lyrics',
    youtubeId: '_BVm-hixXt4'
  }
];"""

ts_content = re.sub(r'  }\n\];', new_song, ts_content)

with codecs.open(ts_path, 'w', 'utf-8') as f:
    f.write(ts_content)

print('done updating content')
