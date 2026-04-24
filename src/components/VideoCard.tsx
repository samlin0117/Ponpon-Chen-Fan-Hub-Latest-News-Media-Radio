import { VideoInfo } from '../data/videos';
import { Play, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function VideoCard({ video }: { video: VideoInfo }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFbVertical = video.id === 'v-fb-cat821';

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full group relative">
        <div className="mb-4 text-left w-full">

          <h3 className="text-lg font-serif text-gray-200 group-hover:text-gold transition-colors line-clamp-2">
            {video.title}
          </h3>
        </div>
        
        <div 
          className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black relative flex justify-center items-center group-hover:border-gold/50 transition-colors duration-500 cursor-pointer aspect-video"
          onClick={() => setIsModalOpen(true)}
        >
          {video.platform === 'youtube' && (
            <>
              <img 
                src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.embedUrl}/maxresdefault.jpg`} 
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.includes('hqdefault.jpg')) {
                    target.src = `https://img.youtube.com/vi/${video.embedUrl}/hqdefault.jpg`;
                  } else if (!target.src.includes('mqdefault.jpg')) {
                    target.src = `https://img.youtube.com/vi/${video.embedUrl}/mqdefault.jpg`;
                  } else if (!target.src.includes('0.jpg')) {
                    target.src = `https://img.youtube.com/vi/${video.embedUrl}/0.jpg`;
                  }
                }}
                alt={video.title}
                className={`absolute inset-0 w-full h-full opacity-70 group-hover:opacity-90 transition-opacity ${video.category === 'p2' ? 'object-contain bg-black' : 'object-cover'}`}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
              <div className="z-20 w-16 h-16 bg-red-600/90 rounded-full flex justify-center items-center shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </div>
            </>
          )}

          {video.platform === 'facebook' && (
            <div className="w-full h-full flex justify-center items-center overflow-hidden relative pointer-events-none bg-black">
              <iframe 
                src={video.embedUrl.replace(/width=\d+/, isFbVertical ? 'width=316' : 'width=450')} 
                className={isFbVertical ? "h-full aspect-[9/16]" : "w-full h-full"}
                style={{ border: 'none', overflow: 'hidden' }} 
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors z-10">
                <div className="z-20 w-16 h-16 bg-blue-600/80 rounded-full flex justify-center items-center shadow-[0_0_20px_rgba(37,99,235,0.5)] group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-12 bg-black/95 backdrop-blur-xl transition-opacity animate-in fade-in duration-300">
          <button 
            onClick={handleCloseModal}
            className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-full text-white/70 hover:text-white transition-all cursor-pointer z-[10000] focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <div className={`w-full max-w-6xl bg-black md:rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-y md:border border-white/10 relative flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 ${video.platform === 'youtube' ? 'aspect-video h-auto' : 'h-full md:h-[85vh] py-10'}`}>
            {video.platform === 'youtube' && (
              <iframe 
                className="w-full h-full aspect-video"
                src={`https://www.youtube.com/embed/${video.embedUrl}?autoplay=1&vq=hd1080&hd=1`} 
                title={video.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            )}
            {video.platform === 'facebook' && (
              <iframe 
                src={`${video.embedUrl.replace(/width=\d+/, isFbVertical ? 'width=500' : 'width=600')}&autoplay=1`} 
                className={isFbVertical ? "h-full aspect-[9/16] max-w-full mx-auto" : "w-full h-full max-w-5xl mx-auto"}
                style={{ border: 'none', overflow: 'hidden' }} 
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
