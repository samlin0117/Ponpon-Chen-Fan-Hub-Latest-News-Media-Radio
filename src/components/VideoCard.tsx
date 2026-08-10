import { VideoInfo } from '../data/videos';
import { Play, X, ExternalLink } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '../hooks/useTranslation';

// FB SDK Video Player：支援 startTime / endTime 片段播放
function FbVideoPlayer({ video, isFbVertical }: { video: VideoInfo; isFbVertical: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 從 embedUrl 取出真正的 FB 影片 URL
  const fbHref = (() => {
    const match = video.embedUrl.match(/href=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  })();

  useEffect(() => {
    const cleanup = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    let handleReady: ((msg: any) => void) | null = null;

    const setupPlayer = (FB: any) => {
      handleReady = (msg: any) => {
        if (msg.type !== 'video') return;
        const player = msg.instance;

        // seek 到開始時間
        if (video.startTime !== undefined) {
          player.seek(video.startTime);
        }
        player.play();

        // polling 到 endTime 時暫停
        if (video.endTime !== undefined) {
          intervalRef.current = setInterval(() => {
            try {
              const pos = player.getCurrentPosition();
              if (pos >= video.endTime!) {
                player.pause();
                cleanup();
              }
            } catch {
              cleanup();
            }
          }, 500);
        }
      };

      FB.Event.subscribe('xfbml.ready', handleReady);
      if (containerRef.current) {
        FB.XFBML.parse(containerRef.current);
      }
    };

    if ((window as any).FB) {
      setupPlayer((window as any).FB);
    } else {
      const prevInit = (window as any).fbAsyncInit;
      (window as any).fbAsyncInit = () => {
        if (prevInit) prevInit();
        const FB = (window as any).FB;
        FB.init({ xfbml: false, version: 'v22.0' });
        setupPlayer(FB);
      };
      if (!document.getElementById('fb-sdk-script')) {
        const script = document.createElement('script');
        script.id = 'fb-sdk-script';
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    }

    return () => {
      cleanup();
      if (handleReady && (window as any).FB) {
        try { (window as any).FB.Event.unsubscribe('xfbml.ready', handleReady); } catch {}
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="flex justify-center items-center w-full h-full bg-black">
      <div
        className="fb-video"
        data-href={fbHref}
        data-width={isFbVertical ? '316' : '560'}
        data-allowfullscreen="true"
        data-autoplay="false"
        data-show-text="false"
      />
    </div>
  );
}

// TikTok 官方 blockquote embed：每次開啟都重新注入，確保 embed.js 會處理到新的 blockquote
function TikTokEmbed({ videoId }: { videoId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/video/${videoId}" data-video-id="${videoId}" style="max-width: 605px;min-width: 325px;"><section></section></blockquote>`;
    }
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      try { document.body.removeChild(script); } catch {}
    };
  }, [videoId]);

  return <div ref={containerRef} className="w-full h-full flex justify-center items-center overflow-y-auto" />;
}

export default function VideoCard({ video }: { video: VideoInfo; key?: any }) {
  const { t } = useTranslation();
  const localizedTitle = (t as any)?.videoTitles?.[video.id] || video.title;

  const [isModalOpen, setIsModalOpen] = useState(false);
  // 判斷是否為直向 FB 影片 (Reels 或特定 ID)
  const isFbVertical = video.platform === 'facebook' && (
    (video.embedUrl.includes('reel') && video.id !== 'v-music-corner' && video.id !== 'v-fb-5299252240089221') ||
    ['v-fb-cat821', 'v-fb-995751751518630', 'v-fb-1387294209248782', 'v-fb-1026651136577463'].includes(video.id)
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
            {localizedTitle}
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
          {(video.platform === 'youtube' || video.platform === 'pbs') && (
            <>
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={localizedTitle}
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
                  alt={localizedTitle}
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
                alt={localizedTitle}
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
                alt={localizedTitle}
                className="absolute inset-0 w-full h-full object-contain bg-black opacity-70 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/5 transition-colors z-10">
                <div className="z-20 w-16 h-16 bg-black/80 rounded-full flex justify-center items-center shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>
            </>
          )}

          {video.platform === 'tiktok' && (
            <>
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={localizedTitle}
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-70 group-hover:opacity-90 transition-opacity"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-[#25F4EE]/10 to-[#FE2C55]/10" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/5 transition-colors z-10">
                <div className="z-20 w-16 h-16 bg-black rounded-full flex justify-center items-center shadow-2xl group-hover:scale-110 transition-transform duration-500 ring-2 ring-[#25F4EE]">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-12 bg-black/95 backdrop-blur-xl transition-opacity animate-in fade-in duration-300">
          {(() => {
            let link = video.originalUrl;
            if (!link) {
              if (video.platform === 'youtube') link = `https://www.youtube.com/watch?v=${video.embedUrl}${video.startTime ? `&t=${video.startTime}s` : ''}`;
              else if (video.platform === 'instagram') link = `https://www.instagram.com/p/${video.embedUrl}/`;
              else if (video.platform === 'threads') link = video.embedUrl;
              else if (video.platform === 'facebook') {
                const fbMatch = video.embedUrl.match(/href=([^&]+)/);
                if (fbMatch) link = decodeURIComponent(fbMatch[1]);
              }
            }
            if (!link) return null;
            return (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 left-4 md:top-8 md:left-8 p-3 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-full text-white/70 hover:text-white transition-all cursor-pointer z-[10000] focus:outline-none flex items-center gap-2 group backdrop-blur-md"
                aria-label="Open original video"
                title="前往原網站觀看"
              >
                <ExternalLink className="w-6 h-6 md:w-7 md:h-7" />
                <span className="hidden md:inline text-sm font-medium pr-2 whitespace-nowrap">在原網站觀看</span>
              </a>
            );
          })()}
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-full text-white/70 hover:text-white transition-all cursor-pointer z-[10000] focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <div className={`bg-black md:rounded-2xl shadow-[0_0_80px_rgba(212,175,55,0.15)] ring-1 ring-white/10 md:ring-gold/30 relative flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 w-full md:w-[90vw] max-w-[1600px] ${(video.platform === 'youtube' || video.platform === 'pbs' || (video.platform === 'facebook' && !isFbVertical))
              ? 'aspect-video h-auto overflow-hidden'
              : 'h-[90vh] md:h-[85vh] py-6 md:py-10 overflow-y-auto'
            }`}>
            {video.platform === 'youtube' && (
              <iframe
                className="w-full h-full aspect-video"
                src={`https://www.youtube.com/embed/${video.embedUrl}?autoplay=1&vq=hd1080&hd=1${video.startTime ? `&start=${video.startTime}` : ''}${video.endTime ? `&end=${video.endTime}` : ''}`}
                title={localizedTitle}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            )}
            {video.platform === 'pbs' && (
              <iframe
                className="w-full h-full aspect-video"
                src={`https://player.pbs.org/viralplayer/${video.embedUrl}/?autoplay=true${video.startTime ? `&start=${video.startTime}` : ''}${video.endTime ? `&end=${video.endTime}` : ''}`}
                title={localizedTitle}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            )}
            {video.platform === 'facebook' && (
              video.startTime !== undefined
                ? <FbVideoPlayer video={video} isFbVertical={isFbVertical} />
                : <iframe
                    src={`${video.embedUrl.replace(/width=\d+/, isFbVertical ? 'width=500' : 'width=550')}`}
                    className={isFbVertical ? "h-full aspect-[9/16] max-w-full mx-auto" : "w-full h-full max-w-5xl mx-auto"}
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
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
            {video.platform === 'tiktok' && (
              <TikTokEmbed videoId={video.embedUrl} />
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
