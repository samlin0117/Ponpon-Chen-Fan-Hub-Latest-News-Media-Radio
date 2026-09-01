import { useState, useEffect, useRef, type ReactNode, type FC } from 'react';
import { createPortal } from 'react-dom';

interface HoverImageLinkProps {
  text: string;
  url: string;
  linkUrl: string;
  photoSourceLabel: string;
  index: number;
}

const FbSourceBadge: FC<{ label: string }> = ({ label }) => (
  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/90 whitespace-nowrap bg-black/70 px-2.5 py-1.5 rounded-full backdrop-blur-md inline-flex items-center gap-1.5">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-3 h-3"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
    <span>{label}</span>
  </span>
);

export const HoverImageLink: FC<HoverImageLinkProps> = ({ text, url, linkUrl, photoSourceLabel, index }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const hasImage = url && url.trim() !== '';

  // Lock body scroll while the mobile preview is open, and close on Esc.
  useEffect(() => {
    if (!isOpenMobile) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpenMobile(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpenMobile]);

  return (
    <a
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
          // First tap reveals the preview; a second tap on the same link
          // falls through and opens the FB link normally.
          e.preventDefault();
          setIsOpenMobile(true);
        }
      }}
    >
      <span dangerouslySetInnerHTML={{ __html: text }} />

      {/* Desktop: hover tooltip anchored above the link */}
      {hasImage && (
        <span
          aria-hidden
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 transition-all duration-300 z-50 w-64 md:w-80 shadow-2xl rounded-xl overflow-hidden border border-white/10 origin-bottom pointer-events-none ${isHovered ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
        >
          <span className="relative min-h-[120px] bg-[#1a1a1a] flex items-center justify-center">
            {!imgError ? (
              <img src={url} alt="" className="w-full h-auto object-cover block" onError={() => setImgError(true)} />
            ) : (
              <span className="text-gray-400 text-sm text-center p-6 mb-6 block">
                照片預覽已失效<br /><span className="text-xs text-gray-500">(FB圖床網址有時效限制)</span>
              </span>
            )}
            <FbSourceBadge label={photoSourceLabel} />
          </span>
        </span>
      )}

      {/* Touch: full-screen lightbox rendered at the document root so the
          backdrop reliably captures the dismiss tap. Tapping anywhere closes;
          the FB link is a separate, explicitly labelled button. */}
      {hasImage && isOpenMobile && createPortal(
        <div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-4 p-6 bg-black/80 backdrop-blur-sm"
          onClick={(e) => { e.stopPropagation(); setIsOpenMobile(false); }}
        >
          <button
            type="button"
            aria-label="關閉"
            onClick={(e) => { e.stopPropagation(); setIsOpenMobile(false); }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>

          <div className="relative w-full max-w-xs rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#1a1a1a]">
            {!imgError ? (
              <img src={url} alt="" className="w-full h-auto object-cover block" onError={() => setImgError(true)} />
            ) : (
              <div className="text-gray-400 text-sm text-center p-8">
                照片預覽已失效<br /><span className="text-xs text-gray-500">(FB圖床網址有時效限制)</span>
              </div>
            )}
            <FbSourceBadge label={photoSourceLabel} />
          </div>

          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md"
          >
            在 FB 查看原文
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10M7 17 17 7" /></svg>
          </a>
          <div className="text-[11px] text-white/50">點任意處關閉</div>
        </div>,
        document.body
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
