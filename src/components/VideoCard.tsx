import { VideoInfo } from '../data/videos';
import { Play, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function VideoCard({ video }: { video: VideoInfo; key?: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 判斷是否為直向 FB 影片 (Reels 或特定 ID)
  const isFbVertical = video.platform === 'facebook' && (
    (video.embedUrl.includes('reel') && video.id !== 'v-music-corner' && video.id !== 'v-fb-5299252240089221') || 
    ['v-fb-cat821', 'v-fb-995751751518630', 'v-fb-1387294209248782'].includes(video.id)
  );

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
          {video.date && (
            <p className="text-sm text-gray-400 mt-1 font-mono tracking-wide">
              {video.displayDate || video.date}
            </p>
          )}
        </div>

        <div
          className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black relative flex justify-center items-center group-hover:border-gold/50 transition-colors duration-500 cursor-pointer aspect-video"
          onClick={() => {
            if (video.platform === 'instagram') {
              window.open(`https://www.instagram.com/p/${video.embedUrl}/`, '_blank', 'noopener,noreferrer');
            } else if (video.platform === 'threads') {
              window.open(video.embedUrl, '_blank', 'noopener,noreferrer');
            } else {
              setIsModalOpen(true);
            }
          }}
        >
          {video.platform === 'youtube' && (
            <>
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className={`absolute inset-0 w-full h-full opacity-70 group-hover:opacity-90 transition-opacity ${video.category === 'p2' ? 'object-contain bg-black' : 'object-cover'}`}
                />
              ) : (
                <img
                  src={`https://img.youtube.com/vi/${video.embedUrl}/maxresdefault.jpg`}
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
              )}
              
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/5 transition-colors z-10">
                <div className="z-20 w-16 h-16 rounded-full flex justify-center items-center shadow-2xl group-hover:scale-110 transition-transform duration-500 bg-red-600/90 shadow-red-600/30">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>
            </>
          )}

          {video.platform === 'facebook' && (
            <div className="w-full h-full flex justify-center items-center overflow-hidden relative pointer-events-none bg-black">
              <iframe
                src={video.embedUrl.replace(/width=\d+/, isFbVertical ? 'width=316' : 'width=350')}
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

          {video.platform === 'instagram' && (
            <>
              <img
                src={video.thumbnailUrl || ''}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/5 transition-colors z-10">
                <div className="z-20 w-16 h-16 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-full flex justify-center items-center shadow-[0_0_20px_rgba(238,42,123,0.5)] group-hover:scale-110 transition-transform duration-500">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>
            </>
          )}

          {video.platform === 'threads' && (
            <>
              <img
                src={video.thumbnailUrl || ''}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-contain bg-black opacity-70 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/5 transition-colors z-10">
                <div className="z-20 w-16 h-16 bg-black/80 rounded-full flex justify-center items-center shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>
            </>
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

          <div className={`bg-black md:rounded-2xl shadow-[0_0_80px_rgba(212,175,55,0.15)] ring-1 ring-white/10 md:ring-gold/30 relative flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 w-full md:w-[90vw] max-w-[1600px] ${
            (video.platform === 'youtube' || (video.platform === 'facebook' && !isFbVertical)) 
              ? 'aspect-video h-auto overflow-hidden' 
              : 'h-[90vh] md:h-[85vh] py-6 md:py-10 overflow-y-auto'
          }`}>
            {video.platform === 'youtube' && (
              <iframe
                className="w-full h-full aspect-video"
                src={`https://www.youtube.com/embed/${video.embedUrl}?autoplay=1&vq=hd1080&hd=1${video.startTime ? `&start=${video.startTime}` : ''}${video.endTime ? `&end=${video.endTime}` : ''}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            )}
            {video.platform === 'facebook' && (
              <iframe
                src={`${video.embedUrl.replace(/width=\d+/, isFbVertical ? 'width=500' : 'width=550')}`}
                className={isFbVertical ? "h-full aspect-[9/16] max-w-full mx-auto" : "w-full h-full max-w-5xl mx-auto"}
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            )}
            {video.platform === 'instagram' && (
              <iframe
                src={`https://www.instagram.com/p/${video.embedUrl}/embed`}
                className="w-full max-w-xl mx-auto"
                style={{ border: 'none', overflow: 'hidden', minHeight: '500px', height: '100%' }}
                scrolling="no"
                frameBorder="0"
                allowTransparency
              ></iframe>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
