import { useState, useEffect } from 'react';
import { PlayCircle } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

interface YouTubePlaylistProps {
  title: string;
  playlistId: string;
}

export default function YouTubePlaylist({ title, playlistId }: YouTubePlaylistProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [userClicked, setUserClicked] = useState(false);

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
            thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
          })).filter((v: Video) => v.title !== 'Private video' && v.title !== 'Deleted video');
          
          setVideos(fetchedVideos);
          if (fetchedVideos.length > 0) {
            setCurrentVideo(fetchedVideos[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch playlist', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [playlistId]);

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    setUserClicked(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col text-left bg-dark rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-gold/5">
        <div className="p-6 pb-4 border-b border-white/5">
          <h3 className="text-xl font-serif text-gold">{title}</h3>
        </div>
        <div className="w-full aspect-video bg-dark-lighter animate-pulse flex items-center justify-center text-gray-500">
          載入中...
        </div>
      </div>
    );
  }

  if (!videos.length || !currentVideo) {
    return null;
  }

  return (
    <div className="flex flex-col text-left bg-dark rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-gold/5">
      <div className="p-6 pb-4 border-b border-white/5">
        <h3 className="text-xl font-serif text-gold">{title}</h3>
      </div>
      
      {/* Main Player */}
      <div className="w-full aspect-video bg-black shrink-0">
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/${currentVideo.id}${userClicked ? '?autoplay=1' : ''}`} 
          title={currentVideo.title}
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
        ></iframe>
      </div>

      {/* Playlist Items */}
      <div className="flex-1 overflow-y-auto h-96 bg-dark-lighter custom-scrollbar">
        {videos.map((video, index) => (
          <button
            key={video.id + index}
            onClick={() => handleVideoSelect(video)}
            className={`w-full flex items-start p-3 text-left transition-colors border-b border-white/5 hover:bg-white/5 ${
              currentVideo.id === video.id ? 'bg-gold/10 border-l-2 border-l-gold' : 'border-l-2 border-l-transparent'
            }`}
          >
            <div className="relative w-24 aspect-video rounded overflow-hidden shrink-0 bg-black mr-3">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80" />
              {currentVideo.id === video.id && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <PlayCircle className="w-6 h-6 text-gold" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 py-1">
              <h4 className={`text-sm line-clamp-2 leading-snug ${currentVideo.id === video.id ? 'text-gold' : 'text-gray-300'}`}>
                {video.title}
              </h4>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
