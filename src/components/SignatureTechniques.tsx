import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic2, Music, Wind, Radio, MessageSquare, PlayCircle, Star, Info, Youtube, History, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface Master {
  name: string;
  era: string;
  trait: string;
  desc: string;
  image?: string;
  videoId?: string;
  videoHref?: string;
  videoTitle?: string;
}

interface Technique {
  id: string;
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  masters: Master[];
  hideMasters?: boolean;
  ponpon: {
    desc: string;
    videoId?: string;
    startTime?: number;
    endTime?: number;
    videos?: {
      videoId: string;
      startTime?: number;
      endTime?: number;
    }[];
  };
}

export default function SignatureTechniques() {
  const { t } = useTranslation();
  const sigT = (t as any)?.signature || {};
  
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeVideoHref, setActiveVideoHref] = useState<string | null>(null);

  // Master images (Using YouTube thumbnails or Wikipedia placeholders)
  const masterImages = {
    louis: "https://img.youtube.com/vi/BhVdLd43bDI/hqdefault.jpg",
    ella: "https://img.youtube.com/vi/ekmwIStfR0o/hqdefault.jpg",
    sarah: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sarah_Vaughan_in_1946.jpg/640px-Sarah_Vaughan_in_1946.jpg",
    benson: "https://img.youtube.com/vi/qWZFGXTuoRo/hqdefault.jpg",
    toots: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toots_Thielemans_1982.jpg/640px-Toots_Thielemans_1982.jpg",
    frank: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Frank_Sinatra_%2757.jpg/640px-Frank_Sinatra_%2757.jpg",
    carmen: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Carmen_McRae_%28Gottlieb_06151%29.jpg/640px-Carmen_McRae_%28Gottlieb_06151%29.jpg"
  };

  const techniques: Technique[] = [
    {
      id: "scatting",
      icon: <Mic2 className="w-6 h-6" />,
      titleKey: sigT.scatting?.title || "Scat Singing (擬聲吟唱)",
      descKey: sigT.scatting?.desc || "Scat Singing 是一種爵士人聲中的即興唱法，歌手不依賴完整歌詞，而是用沒有固定字義的音節（如「ba、doo、sha、bee」等）自由組合旋律與節奏，讓聲音像樂器一樣參與演出。這種唱法強調即時創作能力，透過音色變化、節奏律動與即興反應，表現出高度自由且富有個人風格的爵士語言。",
      masters: [
        { name: "Louis Armstrong", era: "1920s", trait: "Scat 先驅", desc: "Louis Armstrong 於 1926 年錄下《Heebie Jeebies》，這首作品常被視為早期 Scat Singing 的經典代表之一。他的風格以直接有力的節奏感、粗獷而溫暖的音色，以及與小號彼此呼應的即興語法著稱。", image: masterImages.louis, videoHref: "https://www.youtube.com/embed/BhVdLd43bDI?start=34&end=88&autoplay=1", videoTitle: 'Louis Armstrong "Dinah" 1933' },
        { name: "Ella Fitzgerald", era: "1940-60s", trait: "Scat 女王", desc: "Ella Fitzgerald 被譽為「Scat 女王」，以精準的音準、驚人的節奏感與高度器樂化的人聲即興聞名。她能在 Bebop 快速複雜的樂句中靈活穿梭，並以清晰俐落的線條，將 Scat Singing 發展成爵士史上最具代表性的表演藝術之一。", image: masterImages.ella, videoId: "ekmwIStfR0o", videoTitle: 'Ella Fitzgerald "One Note Samba" 1969' }
      ],
      ponpon: {
        desc: sigT.scatting?.ponpon || "Ponpon 的 Scat Singing 特色在於能於歌詞與即興之間自然切換，聲線溫潤且具備清晰的咬字顆粒感與節奏辨識度。她的即興線條常帶有器樂化思維，彷彿與樂團中的管樂聲部進行對話般流動，並融合現代切分節奏與 swing feel，使整體演出呈現輕盈、富空氣感且具推進力的音樂張力。",
        videoId: "S_eBj6DrYOY", // Scat Singing Highlights
        startTime: 12
      }
    },
    {
      id: "guitar-unison",
      icon: <Music className="w-6 h-6" />,
      titleKey: sigT.guitarUnison?.title || "Scat–Guitar Unison (吉他與人聲齊奏)",
      descKey: sigT.guitarUnison?.desc || "Scat–Guitar Unison 是一種高協調性的同步演奏方式，演唱者需同時構思即興旋律，並以聲帶精準重現吉他所演奏的音高與節奏。此技巧要求極高的聽覺反應能力與身體控制，使人聲不再只是歌唱，而是成為吉他的即時延伸聲部，形成高度一致且具速度感的音樂線條。",
      masters: [
        { name: "George Benson", era: "1970s-", trait: "人聲與吉他的革命", desc: "George Benson 以 Scat Singing 與吉他即興之間高度同步的 Unison 表現聞名。邊彈邊唱的緊密配合，讓他的旋律同時具備器樂般的流暢線條與人聲特有的溫度，形成極具辨識度的爵士風格。", image: masterImages.benson, videoHref: "https://www.youtube.com/embed/qWZFGXTuoRo?start=168&end=283&autoplay=1", videoTitle: 'George Benson "This Masquerade"' }
      ],
      ponpon: {
        desc: sigT.guitarUnison?.ponpon || "將這項技巧延伸到更自然的舞台互動。不只是炫技，更像是在「和自己的吉他對話」。",
        videos: [
          { videoId: "_BVm-hixXt4", startTime: 98, endTime: 139 },
          { videoId: "KmhrMOit4dI", startTime: 45, endTime: 93 }
        ]
      }
    },
    {
      id: "whistling",
      icon: <Wind className="w-6 h-6" />,
      titleKey: sigT.whistling?.title || "Whistling (爵士口哨)",
      descKey: sigT.whistling?.desc || "Whistling 是一種將口哨作為旋律聲部的爵士表現形式，其音色輕盈、透明且具空氣感，介於人聲與管樂器之間。透過穩定的氣息控制與精準音準，口哨能自然融入爵士和聲結構之中，為音樂帶來更開闊的聲響層次與柔和的旋律色彩，宛如木管樂器的延伸。",
      masters: [
        { name: "Toots Thielemans", era: "1960s", trait: "爵士口哨大師", desc: "代表作《Bluesette》以吉他與口哨 unison 開創爵士口哨技法，將口哨提升為正式爵士語言。", image: masterImages.toots }
      ],
      hideMasters: true,
      ponpon: {
        desc: sigT.whistling?.ponpon || "並非單純模仿，而是將這種歐洲爵士的浪漫感，結合亞洲細膩敘事，並同時融入自己的 Scat。",
        videoId: "erFPDQHv8fg",
        startTime: 33,
        endTime: 96
      }
    },
    {
      id: "whistling-guitar-independence",
      icon: <MessageSquare className="w-6 h-6" />,
      titleKey: sigT.whistlingGuitarIndependence?.title || "Whistle–Guitar Independence (口哨與吉他獨立雙聲部)",
      descKey: sigT.whistlingGuitarIndependence?.desc || "Whistle–Guitar Independence 是一種雙聲部表演形式，口哨負責主要旋律線，吉他則同時進行和聲鋪陳與節奏律動。兩者在保持獨立聲部運作的同時，又在整體音樂結構中彼此呼應，形成多層次的聲響結構，展現高度的音樂分工與即時協調能力。",
      masters: [],
      hideMasters: true,
      ponpon: {
        desc: sigT.whistlingGuitarIndependence?.ponpon || "Ponpon 將口哨與吉他視為兩個獨立卻互相呼應的聲部。當口哨流暢地描繪主旋律時，吉他同時進行和聲、節奏與切分律動的鋪陳，使兩條音樂線條在不同層次中交織對話，展現高度的協調性與即時音樂思維。",
        videoId: "p3v2XboDUEU",
        startTime: 73,
        endTime: 124
      }
    },
    {
      id: "whistling-unison",
      icon: <Radio className="w-6 h-6" />,
      titleKey: sigT.whistlingUnison?.title || "Whistle–Guitar Unison (口哨吉他同步)",
      descKey: sigT.whistlingUnison?.desc || "Whistle–Guitar Unison 是一種以完全同步旋律為核心的演奏方式，口哨與吉他在音高與節奏上高度一致，共同呈現同一條旋律線。兩種截然不同的音色疊合後，形成「單旋律、雙聲響」的效果，使音樂呈現更立體的層次感與清晰的旋律穿透力。",
      masters: [
        { name: "Toots Thielemans", era: "1960s", trait: "爵士口哨大師", desc: "Toots Thielemans 是爵士樂史上的傳奇，以半音階口琴與爵士口哨聞名於世。他在經典名曲《Bluesette》中展現了極具開創性的「口哨與吉他齊奏」，以輕快優美的音色風靡全球，更成功將口哨提升為正式且優雅的爵士語言。", image: masterImages.toots, videoId: "vtGMDmjk6EA", videoTitle: 'Toots Thielemans "Bluesette"' }
      ],
      ponpon: {
        desc: sigT.whistlingUnison?.ponpon || "Ponpon 在詮釋口哨與吉他同步齊奏時，展現出對音準與內在聽覺的高度控制能力...",
        videos: [
          { videoId: "HCUE2cDCOqs", startTime: 67, endTime: 86 }
        ]
      }
    },
    {
      id: "scat-whistle-guitar-unison",
      icon: <Star className="w-6 h-6" />,
      titleKey: sigT.scatWhistleGuitarUnison?.title || "Scat / Whistle–Guitar Unison (三重同步)",
      descKey: sigT.scatWhistleGuitarUnison?.desc || "Scat / Whistle–Guitar Unison 是一種高度整合的多聲部表演語法，在同一段即興樂句中，同時運用人聲、口哨與吉他進行同步或半同步演奏。表演者需在即時創作中統合三種發聲系統，使旋律、節奏與語氣在不同媒介間保持一致或相互呼應，展現極高的協調性與音樂控制力，形成具張力且多層次的聲響結構。",
      masters: [],
      hideMasters: true,
      ponpon: {
        desc: sigT.scatWhistleGuitarUnison?.ponpon || "這是她最具代表性的獨家絕活。她能在一瞬間於這三種發聲方式間自如切換並保持與吉他高度同步，令人嘆為觀止。",
        videos: [
          { videoId: "1Fnnr4TOjVQ", startTime: 38, endTime: 63 },
          { videoId: "HCUE2cDCOqs", startTime: 257, endTime: 287 }
        ]
      }
    }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="py-12 md:py-32 bg-dark relative min-h-screen">
      {/* Background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-gold tracking-[0.3em] uppercase mb-4 block">{sigT.subtitle || 'Behind the Notes'}</span>
          <h1 className="text-4xl md:text-6xl font-serif mb-6">{sigT.title || 'The Art of Ponpon'}</h1>
          <p className="text-gray-400 font-light max-w-2xl mx-auto text-lg leading-relaxed">
            {sigT.intro || '這些技巧在爵士史上曾被哪些大師使用？Ponpon 又如何重新詮釋？讓我們一起拆解她的爵士魔法。'}
          </p>
        </motion.div>

        {/* Index / Navigation */}
        <div className="mb-24">
          <h3 className="text-sm font-mono text-gold/80 tracking-[0.2em] uppercase text-center mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gold/30"></div>
            Signature Index
            <div className="h-px w-12 bg-gold/30"></div>
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {techniques.map((tech) => (
              <button
                key={tech.id}
                onClick={() => scrollToSection(tech.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${
                  activeSection === tech.id 
                    ? 'bg-gold/20 border-gold text-gold-light scale-105 shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                    : 'bg-dark-lighter/50 border-white/10 text-gray-300 hover:border-gold/50 hover:text-white'
                }`}
              >
                <div className={`${activeSection === tech.id ? 'text-gold' : 'text-gray-400'}`}>
                  {tech.icon}
                </div>
                <span className="font-medium tracking-wide">{tech.titleKey.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>



        {/* Detailed Sections */}
        <div className="space-y-32">
          {techniques.map((tech, index) => (
            <div key={tech.id} id={`section-${tech.id}`} className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-gold/10 rounded-2xl text-gold">
                  {tech.icon}
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif text-white">{tech.titleKey}</h2>
                  <p className="text-gray-400 mt-2">{tech.descKey}</p>
                </div>
              </div>

              <div className={`grid ${tech.hideMasters ? 'grid-cols-1 max-w-4xl mx-auto' : 'lg:grid-cols-2'} gap-12 items-start`}>
                {/* Left Column: Historical Context */}
                {!tech.hideMasters && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <History className="w-5 h-5 text-gold/70" />
                    <h3 className="text-lg font-mono text-gold/70 tracking-widest uppercase">{sigT.historicalContext || '歷史傳承'}</h3>
                  </div>
                  
                  {tech.masters.length > 0 ? (
                    tech.masters.map((master, mIdx) => (
                      <div key={mIdx} className="flex gap-6 p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-white/10">
                          {master.image ? (
                            <img src={master.image} alt={master.name} className="w-full h-full object-cover grayscale opacity-80" />
                          ) : (
                            <div className="w-full h-full bg-dark flex items-center justify-center">
                              <Star className="w-8 h-8 text-white/20" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-3 mb-1">
                            <h4 className="text-xl font-serif text-white">{master.name}</h4>
                            <span className="text-xs text-gold font-mono">{master.era}</span>
                          </div>
                          <span className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-gray-300 mb-3">{master.trait}</span>
                          <p className="text-gray-400 text-sm leading-relaxed mb-3">{master.desc}</p>
                          {(master.videoId || master.videoHref) && (
                            <button 
                              onClick={() => setActiveVideoHref(master.videoHref || `https://www.youtube.com/embed/${master.videoId}?autoplay=1`)}
                              className="inline-flex items-center gap-2 text-xs font-mono text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Youtube className="w-4 h-4" />
                              {master.videoTitle || '觀看示範影片'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 rounded-2xl border border-dashed border-white/20 text-center text-gray-500">
                      這項極為珍稀的組合，在歷史上極少有單一人選能完全涵蓋。
                    </div>
                  )}
                </div>
                )}

                {/* Right Column: Ponpon's Interpretation */}
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-b from-gold/10 to-transparent rounded-3xl blur-xl -z-10"></div>
                  <div className="bg-dark-lighter border border-gold/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full"></div>
                    
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                      <Star className="w-5 h-5 text-gold" />
                      <h3 className="text-lg font-mono text-gold tracking-widest uppercase">{sigT.ponponInterpretation || 'Ponpon 的詮釋'}</h3>
                    </div>

                    <p className="text-gray-200 text-lg leading-relaxed mb-8 relative z-10">
                      {tech.ponpon.desc}
                    </p>

                    <div className="flex flex-col gap-6">
                      {(tech.ponpon.videos || [{videoId: tech.ponpon.videoId, startTime: tech.ponpon.startTime, endTime: tech.ponpon.endTime}]).map((video, vIdx) => video.videoId ? (
                        <div key={vIdx} className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 group">
                          <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                            <Youtube className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-white font-medium tracking-wider">Golden Snippet</span>
                          </div>
                          <iframe 
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${video.videoId}?start=${video.startTime || 0}${video.endTime ? `&end=${video.endTime}` : ''}`} 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen>
                          </iframe>
                        </div>
                      ) : null)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideoHref && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideoHref(null)}
              className="absolute inset-0 bg-dark/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 z-10 p-4">
                <button
                  onClick={() => setActiveVideoHref(null)}
                  className="p-2 rounded-full bg-black/60 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={activeVideoHref}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
