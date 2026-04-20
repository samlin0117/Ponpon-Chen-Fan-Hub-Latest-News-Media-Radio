import { useEffect, useRef } from 'react';

export default function CusdisComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appId = import.meta.env.VITE_CUSDIS_APP_ID || "14de6220-7400-4e81-a30e-5cea977722ab";

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear out previous loads safely
    containerRef.current.innerHTML = '';

    // Create the Cusdis target div
    const cusdisDiv = document.createElement('div');
    cusdisDiv.id = 'cusdis_thread';
    cusdisDiv.setAttribute('data-host', 'https://cusdis.com');
    cusdisDiv.setAttribute('data-app-id', appId);
    cusdisDiv.setAttribute('data-page-id', 'ponpon-fan-site-main');
    cusdisDiv.setAttribute('data-page-title', 'Ponpon Fan Site Messages');
    cusdisDiv.setAttribute('data-page-url', window.location.href);
    cusdisDiv.setAttribute('data-theme', 'dark');
    
    containerRef.current.appendChild(cusdisDiv);

    // Initialize Cusdis script
    const script = document.createElement('script');
    script.src = 'https://cusdis.com/js/cusdis.es.js';
    script.async = true;
    script.defer = true;
    
    containerRef.current.appendChild(script);
  }, [appId]);

  return (
    <div className="w-full relative">
      <div className="text-center mb-6">
        <p className="text-gray-400 text-sm">
          💡 請在此留下想對 Ponpon 說的話。 (免登入即可留言，為了維護版面品質，留言發送後需稍微等待版主審核才會顯示唷！)
        </p>
      </div>
      <div ref={containerRef} className="w-full min-h-[300px] text-left" />
    </div>
  );
}
