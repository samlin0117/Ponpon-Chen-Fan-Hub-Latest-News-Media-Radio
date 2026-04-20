import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PlayCircle, X } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

interface YouTubePlaylistProps {
  title: string;
  playlistId: string;
  featured?: boolean;
}

export default function YouTubePlaylist({ title, playlistId, featured = false }: YouTubePlaylistProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Try to get from env, fallback to hardcoded key if env is missing
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyAp5UXwfKe-UJez2uraOdQ0q8147iuBiko';
        
        if (!apiKey) {
          console.error('YouTube API Key is missing');
          return;
        }
        
        let allItems: any[] = [];
        let nextPageToken = '';
        
        do {
          const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`);
          const data = await res.json();
          
          if (data.items) {
            allItems = [...allItems, ...data.items];
          }
          nextPageToken = data.nextPageToken;
        } while (nextPageToken && allItems.length < 150); // Fetch up to 150 videos to prevent infinite loops
        
        if (allItems.length > 0) {
          const fetchedVideos = allItems.map((item: any) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
          })).filter((v: Video) => v.title !== 'Private video' && v.title !== 'Deleted video');
          
          setVideos(fetchedVideos);
        }
      } catch (err) {
        console.error('Failed to fetch playlist', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [playlistId]);

  // Clean up body scroll when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      setCurrentVideo(null);
    }, 300); // clear after animation tick
  };

  if (loading) {
    return (
      <div className={`flex flex-col text-left bg-dark rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-gold/5 ${featured ? 'md:col-span-2' : ''}`}>
        <div className="p-6 pb-4 border-b border-white/5">
          <h3 className="text-xl font-serif text-gold">{title}</h3>
        </div>
        <div className={`w-full bg-dark-lighter animate-pulse flex items-center justify-center text-gray-500 ${featured ? 'h-[400px]' : 'h-[300px]'}`}>
          載入中...
        </div>
      </div>
    );
  }

  if (!videos.length) {
    return null;
  }

  return (
    <>
      <div className={`flex flex-col text-left bg-dark rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-gold/5 ${featured ? 'md:col-span-2' : ''}`}>
        <div className="p-6 pb-4 border-b border-white/5 flex justify-between items-center bg-dark z-10 sticky top-0">
          <h3 className="text-xl font-serif text-gold">{title}</h3>
          {featured && (
            <span className="text-xs font-mono text-gold-light border border-gold/20 px-2 py-1 rounded-full uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>
        
        {/* Playlist Items - Grid Layout */}
        <div className={`p-4 md:p-6 grid gap-4 md:gap-6 custom-scrollbar overflow-y-auto bg-dark-lighter ${featured ? 'grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 max-h-[600px] md:max-h-[800px]' : 'grid-cols-1 sm:grid-cols-2 max-h-[500px]'}`}>
          {videos.map((video, index) => (
            <button
              key={video.id + '-' + index}
              onClick={() => handleVideoSelect(video)}
              className="group flex flex-col text-left transition-all duration-300 focus:outline-none"
            >
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black mb-3 md:mb-4 border border-white/10 group-hover:border-gold/50 shadow-lg group-hover:shadow-gold/10 transition-all duration-300">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-lighten" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
                  <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm border border-white/10 group-hover:border-gold/30 group-hover:bg-gold/20 transition-all duration-300 group-hover:scale-110">
                    <PlayCircle className="w-8 h-8 md:w-10 md:h-10 text-white/90 group-hover:text-gold transition-colors" />
                  </div>
                </div>
              </div>
              <h4 className="text-sm md:text-base font-medium line-clamp-2 text-gray-300 group-hover:text-gold-light transition-colors leading-relaxed px-1">
                {video.title}
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* Modal Player Rendered via Portal */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-12 bg-black/95 backdrop-blur-xl transition-opacity animate-in fade-in duration-300">
          {/* Close Button */}
          <button 
            onClick={handleCloseModal}
            className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-full text-white/70 hover:text-white transition-all cursor-pointer z-[10000] focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          {/* Video Container */}
          <div className="w-full h-full md:h-auto max-w-6xl md:aspect-video bg-black md:rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-y md:border border-white/10 relative flex flex-col justify-center animate-in zoom-in-95 duration-300">
            {currentVideo && (
              <iframe 
                className="w-full aspect-video md:h-full"
                src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`} 
                title={currentVideo.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
