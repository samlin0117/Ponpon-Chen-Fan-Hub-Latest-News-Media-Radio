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
  // Assume a hover-capable pointer until we can check; corrected on mount.
  const [canHover, setCanHover] = useState(true);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const hasImage = url && url.trim() !== '';

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  // Close the mobile preview on Esc.
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
      onMouseEnter={() => canHover && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        // No hover pointer → tap opens the preview instead of navigating.
        if (!canHover && hasImage && !isOpenMobile) {
          e.preventDefault();
          setIsOpenMobile(true);
        }
      }}
    >
      <span dangerouslySetInnerHTML={{ __html: text }} />

      {/* Desktop only: hover tooltip anchored above the link */}
      {hasImage && canHover && (
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

      {/* Touch: a small preview card (not full-screen), portalled out so it
          escapes the surrounding <p>/<a> and can use real <button>s — which
          register taps on every mobile browser, unlike bare <div>s on iOS
          Safari. A transparent button behind it catches "tap outside". */}
      {hasImage && isOpenMobile && createPortal(
        <>
          <button
            type="button"
            aria-label="關閉預覽"
            onClick={() => setIsOpenMobile(false)}
            className="fixed inset-0 z-[110] bg-black/20 cursor-default"
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[111] w-60 max-w-[calc(100vw-2rem)]">
            <button
              type="button"
              aria-label="關閉預覽"
              onClick={() => setIsOpenMobile(false)}
              className="relative block w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#1a1a1a] cursor-pointer"
            >
              {!imgError ? (
                <img src={url} alt="" className="w-full h-auto object-cover block" onError={() => setImgError(true)} />
              ) : (
                <span className="block text-gray-400 text-sm text-center p-6">
                  照片預覽已失效<br /><span className="text-xs text-gray-500">(FB圖床網址有時效限制)</span>
                </span>
              )}
              <FbSourceBadge label={photoSourceLabel} />
              <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-black border border-white/20 text-white flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </span>
            </button>
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-white/90 bg-black/70 active:bg-black/90 py-1.5 rounded-full backdrop-blur-md"
            >
              在 FB 查看原文
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10M7 17 17 7" /></svg>
            </a>
          </div>
        </>,
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
