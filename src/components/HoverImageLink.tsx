import { useState, useEffect, useRef, type ReactNode, type FC } from 'react';

interface HoverImageLinkProps {
  text: string;
  url: string;
  linkUrl: string;
  photoSourceLabel: string;
  index: number;
}

export const HoverImageLink: FC<HoverImageLinkProps> = ({ text, url, linkUrl, photoSourceLabel, index }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const hasImage = url && url.trim() !== '';

  // On touch devices, close the preview when tapping anywhere outside the link.
  useEffect(() => {
    if (!isOpenMobile) return;
    const handleOutside = (e: Event) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        setIsOpenMobile(false);
      }
    };
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('click', handleOutside);
    return () => {
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('click', handleOutside);
    };
  }, [isOpenMobile]);

  return (
    <a
      key={`img-${index}`}
      ref={anchorRef}
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline text-gold font-medium cursor-pointer border-b border-gold/30 hover:border-gold transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch && hasImage && !isOpenMobile) {
          // First tap only reveals the preview; a second tap on the
          // same link falls through and opens the FB link normally.
          e.preventDefault();
          setIsOpenMobile(true);
        }
      }}
    >
      <span dangerouslySetInnerHTML={{ __html: text }} />
      {hasImage && (
        <div
          onClick={(e) => {
            // Tapping the preview itself (touch) just dismisses it — the tap
            // must not fall through to the link behind it and open FB.
            if (isOpenMobile) {
              e.preventDefault();
              e.stopPropagation();
              setIsOpenMobile(false);
            }
          }}
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 transition-all duration-300 z-50 w-64 md:w-80 shadow-2xl rounded-xl overflow-hidden border border-white/10 origin-bottom ${isOpenMobile ? 'pointer-events-auto' : 'pointer-events-none'} ${(isOpenMobile || isHovered) ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
        >
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

// Parse a string that may contain [HOVER_IMG:text|imageUrl|linkUrl] tokens into
// React nodes. Plain text (incl. inline HTML like <a>) is rendered as-is.
export const renderRichText = (content: string, photoSourceLabel: string) => {
  if (!content) return null;
  const regex = /\[HOVER_IMG:(.*?)\|(.*?)(?:\|(.*?))?\]/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: content.slice(lastIndex, match.index) }} />);
    }
    const text = match[1];
    const url = match[2];
    const linkUrl = match[3] || 'https://www.facebook.com/profile.php?id=100039208281828';

    parts.push(
      <HoverImageLink
        key={`img-${match.index}`}
        index={match.index}
        text={text}
        url={url}
        linkUrl={linkUrl}
        photoSourceLabel={photoSourceLabel}
      />
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push(<span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: content.slice(lastIndex) }} />);
  }

  return parts;
};
