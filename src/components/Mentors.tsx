import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Users, X, ChevronRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const HoverImageLink = ({ text, url, linkUrl, photoSourceLabel, index }: { text: string, url: string, linkUrl: string, photoSourceLabel: string, index: number }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const hasImage = url && url.trim() !== '';

  return (
    <a
      key={`img-${index}`}
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline text-gold font-medium cursor-pointer border-b border-gold/30 hover:border-gold transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch && hasImage) {
          if (!isOpenMobile) {
            e.preventDefault();
            setIsOpenMobile(true);
          }
        }
      }}
    >
      <span dangerouslySetInnerHTML={{ __html: text }} />
      {hasImage && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 transition-all duration-300 z-50 w-64 md:w-80 shadow-2xl rounded-xl overflow-hidden border border-white/10 origin-bottom pointer-events-none ${(isOpenMobile || isHovered) ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
          <div className="relative min-h-[120px] bg-[#1a1a1a] flex items-center justify-center">
            {!imgError ? (
              <img
                src={url}
                alt="hover popup"
                className="w-full h-auto object-cover block"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="text-gray-400 text-sm text-center p-6 mb-6">
                照片預覽已失效<br /><span className="text-xs text-gray-500">(FB圖床網址有時效限制)</span>
              </div>
            )}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/90 whitespace-nowrap bg-black/70 px-2.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-3 h-3"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              <span>{photoSourceLabel}</span>
            </div>
          </div>
        </div>
      )}
    </a>
  );
};


const Mentors = () => {
  const { t } = useTranslation();
  const mentorsData = (t as any).mentors;
  const [selectedMentor, setSelectedMentor] = useState<any>(null);

  if (!mentorsData) return null;

  const renderContentWithHoverImage = (content: string) => {
    if (!content) return null;
    const regex = /\[HOVER_IMG:(.*?)\|(.*?)(?:\|(.*?))?\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: content.slice(lastIndex, match.index) }} />);
      }
      const text = match[1];
      const url = match[2];
      const linkUrl = match[3] || "https://www.facebook.com/profile.php?id=100039208281828"; // Default to Ponpon's FB

      parts.push(
        <HoverImageLink
          key={`img-${match.index}`}
          index={match.index}
          text={text}
          url={url}
          linkUrl={linkUrl}
          photoSourceLabel={(t as any).hero?.photoSource || '照片來源：Ponpon的fb粉絲專頁'}
        />
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) {
      parts.push(<span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: content.slice(lastIndex) }} />);
    }

    return parts;
  };

  return (
    <section className="py-12 md:py-32 bg-dark-lighter relative min-h-[calc(100vh-80px)]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-left mb-16">
            <Users className="w-8 h-8 text-gold mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-serif mb-6">{mentorsData.title}</h2>
            <p className="text-gray-400 font-light max-w-2xl leading-relaxed" dangerouslySetInnerHTML={{ __html: mentorsData.description }}></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentorsData.list.map((mentor: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setSelectedMentor(mentor)}
                className="bg-dark/50 border border-white/5 p-6 md:p-8 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-gold/30 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-white group-hover:text-gold transition-colors">{mentor.name}</h3>
                    <p className="text-xs text-gold-light tracking-widest uppercase mt-1">{mentor.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light flex-grow">
                  {mentor.shortDesc}
                </p>
                <div className="mt-6 flex items-center text-gold/70 text-sm font-medium group-hover:text-gold transition-colors">
                  閱讀更多 <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMentor(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl max-h-[85vh] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-start bg-black/20 shrink-0">
                <div>
                  <h3 className="text-2xl md:text-3xl font-serif text-gold mb-2">{selectedMentor.name}</h3>
                  <p className="text-sm tracking-widest text-gray-400 uppercase">{selectedMentor.role}</p>
                </div>
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                {selectedMentor.intro && (
                  <div className="mb-12 bg-dark-lighter/50 border border-gold/20 rounded-2xl p-6 md:p-8 relative overflow-hidden group shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>
                    <div className="relative z-10">
                      <h4 className="text-gold font-serif text-xl mb-4 flex items-center gap-2">
                        關於 {selectedMentor.name}
                      </h4>
                      <p className="text-gray-300 font-light leading-relaxed mb-6">
                        {selectedMentor.intro.bio}
                      </p>
                      {selectedMentor.intro.classicSongs && (
                        <div>
                          <h5 className="text-xs font-mono text-gold-light tracking-widest uppercase mb-3 flex items-center gap-2">
                            <span className="w-4 h-px bg-gold/50"></span> {selectedMentor.intro.songListLabel || '經典必聽'} <span className="w-4 h-px bg-gold/50"></span>
                          </h5>
                          <div className="flex flex-col gap-2.5">
                            {selectedMentor.intro.classicSongs.map((song: any, idx: number) => (
                              <a
                                key={idx}
                                href={song.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/5 hover:border-gold/40 transition-all duration-300 w-fit group/song"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube text-red-500 group-hover/song:scale-110 transition-transform"><path d="M2.5 7.1c.1-1.4 1.2-2.5 2.6-2.6 3.1-.2 9.7-.2 12.8 0 1.4.1 2.5 1.2 2.6 2.6.2 3.1.2 9.7 0 12.8-.1 1.4-1.2 2.5-2.6 2.6-3.1.2-9.7.2-12.8 0-1.4-.1-2.5-1.2-2.6-2.6-.2-3.1-.2-9.7 0-12.8z" /><polygon points="10 15 15 12 10 9 10 15" /></svg>
                                {song.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                  {selectedMentor.detailedStory.map((story: any, idx: number) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#1a1a1a] bg-dark shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl z-10">
                        <div className="w-2 h-2 rounded-full bg-gold"></div>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-colors relative z-20">
                        <h4 className="text-gold font-medium mb-3">{story.date}</h4>
                        <p className="text-gray-300 text-sm leading-relaxed font-light">
                          {renderContentWithHoverImage(story.content)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Mentors;
