import { VideoInfo } from '../data/videos';
import { Play, Layers, X, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import VideoCard from './VideoCard';

export default function VideoGroupCard({ name, videos }: { name: string; videos: VideoInfo[]; key?: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const mainVideo = videos[0];
  const date = mainVideo.date;

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isExpanded]);

  return (
    <>
      <div className="flex flex-col items-center w-full group relative">
        <div className="mb-4 text-left w-full">
          <h3 className="text-lg font-serif text-gold group-hover:text-gold-light transition-colors line-clamp-2">
            {name}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-gray-400 font-mono tracking-wide flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {date}
            </p>
            <span className="text-xs px-2 py-0.5 bg-gold/10 text-gold-light rounded-full border border-gold/20">
              {videos.length} Videos
            </span>
          </div>
        </div>
        
        <div 
          className="w-full rounded-2xl overflow-hidden shadow-2xl border border-gold/30 bg-black relative flex justify-center items-center group-hover:border-gold transition-all duration-500 cursor-pointer aspect-video"
          onClick={() => setIsExpanded(true)}
        >
          {/* Stack effect background layers */}
          <div className="absolute inset-0 bg-gold/5 -rotate-2 scale-95 rounded-2xl border border-gold/10 -z-10 group-hover:-rotate-3 transition-transform"></div>
          <div className="absolute inset-0 bg-gold/10 rotate-1 scale-[0.98] rounded-2xl border border-gold/10 -z-10 group-hover:rotate-2 transition-transform"></div>

          <img 
            src={mainVideo.thumbnailUrl || `https://img.youtube.com/vi/${mainVideo.embedUrl}/maxresdefault.jpg`} 
            alt={name}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="z-20 flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gold/90 rounded-full flex justify-center items-center shadow-[0_0_30px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform">
              <Layers className="w-8 h-8 text-dark" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-gold-light font-bold drop-shadow-lg">View Collection</span>
          </div>
        </div>
      </div>

      {isExpanded && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-2xl transition-opacity animate-in fade-in duration-300">
          <button 
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-full text-white/70 hover:text-white transition-all cursor-pointer z-[10000] focus:outline-none"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <div className="w-full h-full overflow-y-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-serif text-gold mb-4">{name}</h2>
                <p className="text-gray-400 font-light flex items-center justify-center gap-4">
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {date}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                  <span>{videos.length} 首現場演出影片</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                {(() => {
                  const getBaseTitle = (title: string) => {
                    // Remove uploader info in parentheses
                    let t = title.replace(/\s*\([^)]+\)$/, '');
                    // Remove common song variation suffixes
                    t = t.replace(/\s*(scatting|-2|cover by|by)\s*$/i, '');
                    // Remove artist name prefix if present
                    t = t.replace(/^Ponpon Chen 陳芃瑄\s*-\s*/, '');
                    return t.trim().toLowerCase();
                  };

                  const sortedVideos = [...videos].sort((a, b) => {
                    const uploaderA = a.title.match(/\(([^)]+)\)$/)?.[1] || '';
                    const uploaderB = b.title.match(/\(([^)]+)\)$/)?.[1] || '';
                    
                    // Uploader priority (Stella Chen first)
                    if (uploaderA === 'Stella Chen' && uploaderB !== 'Stella Chen') return -1;
                    if (uploaderA !== 'Stella Chen' && uploaderB === 'Stella Chen') return 1;
                    
                    // If same uploader, sort by base song title to keep variations together
                    if (uploaderA === uploaderB) {
                      const baseA = getBaseTitle(a.title);
                      const baseB = getBaseTitle(b.title);
                      if (baseA !== baseB) return baseA.localeCompare(baseB);
                    }
                    
                    return uploaderA.localeCompare(uploaderB);
                  });

                  return sortedVideos.map(video => (
                    <motion.div 
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <VideoCard video={video} />
                    </motion.div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
