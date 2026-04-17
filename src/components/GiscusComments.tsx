import { useEffect, useRef } from 'react';

export default function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // 為了避免 React Strict Mode 重複載入，先清空容器
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "samlin0117/Ponpon-Chen-Fan-Hub-Latest-News-Media-Radio");
    script.setAttribute("data-repo-id", "R_kgDOSED3Sw");
    // 您已經提供過的正確分類資訊
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOSED3S84C7BzS");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    // 將主題改為無邊框深色模式，以完美融入我們的爵士風格網站
    script.setAttribute("data-theme", "noborder_dark");
    script.setAttribute("data-lang", "zh-TW");
    script.crossOrigin = "anonymous";
    script.async = true;

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full relative">
      <div className="text-center mb-6">
        <p className="text-gray-400 text-sm">
          💡 歡迎使用您的 GitHub 帳號登入，在此留下想對 Ponpon 說的話。
        </p>
      </div>
      <div ref={containerRef} className="w-full min-h-[300px]" />
    </div>
  );
}
