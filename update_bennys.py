import json
import codecs
import re

zh_data = {
    'title': 'Benny\'s From Heaven',
    'background': '《Benny\'s From Heaven》是一首極具幽默感與戲劇張力的 Vocalese（爵士填詞演唱）經典作品。它改編自 1936 年的爵士標準曲《Pennies from Heaven》，由 Vocalese 先驅 Eddie Jefferson 重新填詞並唱紅。<br/><br/>📍 時代背景：Vocalese 的幽默革命<br/>在 1950 到 1960 年代，爵士樂手們開始流行一種名為「Vocalese」的演唱形式，也就是將原本只有樂器演奏的即興獨奏（Solo）旋律填上歌詞來演唱。Eddie Jefferson 將原本浪漫溫馨的《Pennies from Heaven》大改編，賦予了它一個極具黑色幽默的全新靈魂，讓這首歌在 1968 年錄製後成為了爵士樂迷津津樂道的奇作。<br/><br/>🌧️ 歌曲意境與歌詞含意：一頂綠帽子的黑色喜劇<br/>歌詞講述了一個荒誕又惹人發笑的故事：一位士兵離家服役了整整三年，滿心歡喜地退伍回家後，卻發現妻子懷裡抱著一個剛出生的男嬰，名叫 Benny。面對丈夫的質疑，妻子堅決不承認自己出軌，反而指著天花板發誓，聲稱這是一個奇蹟，說「Benny 是從天上掉下來的（Benny\'s from Heaven）」。整首歌以第一人稱視角，充滿了丈夫的無奈、傻眼與自嘲，把一個悲慘的「戴綠帽」故事唱成了令人捧腹的喜劇。<br/><br/>🌟 Ponpon 的演繹特色<br/>Ponpon 在這場演出中，展現了她身為「說故事歌手（Storyteller）」的絕佳天賦。她不再只是單純地演唱旋律，而是化身為那位無奈的丈夫，用豐富的臉部表情、生動的肢體動作與戲劇化的語氣，將這齣「家庭慘劇」演繹得活靈活現。她的咬字充滿節奏感，與吉他的搖擺律動完美契合，成功地將這種帶有脫口秀性質的 Vocalese 爵士風格，以極具個人魅力的方式呈現給觀眾，讓全場充滿了笑聲與驚喜。'
}

en_data = {
    'title': 'Benny\'s From Heaven',
    'background': '"Benny\'s From Heaven" is a brilliant and humorous classic in the Vocalese jazz tradition. It is a witty parody of the 1936 jazz standard "Pennies from Heaven," with special lyrics written and popularized by Vocalese pioneer Eddie Jefferson.<br/><br/>📍 Historical Background: The Humorous Revolution of Vocalese<br/>In the 1950s and 60s, a new singing style called "Vocalese" emerged, where vocalists wrote and sang lyrics to preexisting instrumental jazz solos. Eddie Jefferson completely transformed the originally sweet and romantic "Pennies from Heaven" into a masterpiece of dark comedy. His 1968 recording of this version quickly became a legendary and highly entertaining anomaly among jazz enthusiasts.<br/><br/>🌧️ Atmosphere & Lyrical Meaning: A Dark Comedy of Infidelity<br/>The lyrics tell an absurd and hilarious story: a soldier returns home after being deployed overseas for three long years, only to find his wife nursing a brand new baby boy named Benny. When the baffled husband questions her, the wife stubbornly denies any infidelity. Instead, she points to the sky and swears it was a miracle, claiming that "Benny\'s from Heaven." Sung from the husband\'s perspective, the song is filled with disbelief, helplessness, and self-deprecation, turning a tragic tale of betrayal into a side-splitting comedy.<br/><br/>🌟 Ponpon\'s Interpretation<br/>In this performance, Ponpon showcases her incredible talent as a musical storyteller. Instead of simply singing the melody, she fully embodies the role of the bewildered husband. Through her expressive facial expressions, animated body language, and theatrical vocal delivery, she brings this "domestic tragedy" to life with vivid humor. Her rhythmic articulation syncs perfectly with the swinging groove of her guitar. She successfully delivers the stand-up comedy essence of Vocalese jazz, keeping the audience engaged and filling the room with laughter and delight.'
}

ja_data = {
    'title': 'Benny\'s From Heaven',
    'background': '「Benny\'s From Heaven」は、ユーモアと演劇的な魅力に溢れたヴォカリーズ（Vocalese）の傑作です。1936年のジャズ・スタンダード「Pennies from Heaven」のパロディであり、ヴォカリーズの先駆者であるエディ・ジェファーソン（Eddie Jefferson）が新たな歌詞を書き下ろし、一躍有名にしました。<br/><br/>📍 時代背景：ヴォカリーズのユーモラスな革命<br/>1950年代から60年代にかけて、ジャズのインストゥルメンタル即興ソロに歌詞をつけて歌う「ヴォカリーズ」というスタイルが流行しました。エディ・ジェファーソンは、元々ロマンチックで温かい「Pennies from Heaven」を、ブラックユーモア全開の全く新しい作品へと作り変えました。1968年に録音されたこのバージョンは、ジャズファンの間で語り継がれる伝説のコメディソングとなりました。<br/><br/>🌧️ 楽曲の世界観と歌詞の意味：不倫を巡るブラックコメディ<br/>歌詞は、荒唐無稽で笑えるストーリーを描いています。兵役で3年間家を空けていた夫が、喜び勇んで帰宅すると、妻が見知らぬ生まれたばかりの赤ん坊（ベニー）を抱いていました。困惑する夫の追及に対し、妻は絶対に浮気を認めず、天井を指差して「これは奇跡だ、ベニーは天国から降ってきたんだ（Benny\'s from Heaven）」と言い張ります。夫の一人称視点で歌われるこの曲は、彼の無力感、呆れ、そして自虐に満ちており、「妻の不倫」という悲惨な出来事を爆笑のコメディへと変えています。<br/><br/>🌟 Ponpon の演繹特色<br/>このパフォーマンスで、Ponponは「ストーリーテラー」としての素晴らしい才能を発揮しています。彼女はただメロディを歌うだけでなく、困惑する夫になりきり、豊かな表情、コミカルな身振り、そして演劇的な語り口で、この「家庭の悲劇」を生き生きと演じています。彼女の弾むようなボーカルのアーティキュレーションは、ギターのスウィング感と完璧に調和しています。スタンドアップコメディのようなヴォカリーズの魅力を、彼女独自のスタイルで見事に表現し、会場を笑いと驚きで包み込みました。'
}

def update_json(filepath, data_to_insert):
    with codecs.open(filepath, 'r', 'utf-8') as f:
        data = json.load(f)
    
    data['repertoire']['songs']['bennys-from-heaven'] = data_to_insert
    
    with codecs.open(filepath, 'w', 'utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

update_json(r'src\locales\zh.json', zh_data)
update_json(r'src\locales\en.json', en_data)
update_json(r'src\locales\ja.json', ja_data)

print('done updating content')
