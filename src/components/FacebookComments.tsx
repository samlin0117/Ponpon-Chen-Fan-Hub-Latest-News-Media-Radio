import { useEffect, useState } from 'react';

export default function FacebookComments() {
  const pageUrl = "https://samlin0117.github.io/Ponpon-Chen-Fan-Hub-Latest-News-Media-Radio/";
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    // 1. 確保 fb-root 存在於 body 的最上層，這是 FB SDK 的強制要求
    if (!document.getElementById('fb-root')) {
      const root = document.createElement('div');
      root.id = 'fb-root';
      document.body.appendChild(root);
    }

    // 當 FB 準備好時要執行的函數
    const initFB = () => {
      if ((window as any).FB) {
        // 要求 FB 重新掃描畫面中 class="fb-comments" 的區塊並轉化為留言板
        (window as any).FB.XFBML.parse();
        setStatus('loaded');
      }
    };

    // 2. 只有在還沒載入 FB SDK 的情況下才掛載 script
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = "https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v19.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      
      // 最重要的一步：等 Facebook 官方程式碼下載完畢後，立刻執行轉化
      script.onload = initFB;
      script.onerror = () => setStatus('error'); // 如果被 AdBocker 擋住會觸發 error
      
      document.body.appendChild(script);
    } else {
      // 若曾經載入過 (例如切換頁面)，直接要求 FB 重新轉化
      initFB();
    }

    // 加入超時偵測：若 4 秒後仍未出現 JS 物件，通常代表被廣告阻擋外掛殺掉了
    const timer = setTimeout(() => {
      if (!(window as any).FB) {
        setStatus('error');
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full relative min-h-[250px] flex items-center justify-center bg-white rounded-xl p-4 md:p-8 overflow-hidden">
      
      {/* 狀態提示層 (放在底部) - 如果遇到擋廣告外掛或網路慢，就不會看起來像破圖白畫面 */}
      {status !== 'loaded' && (
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 bg-gray-50/50">
          {status === 'loading' ? (
            <div className="text-gray-400 font-medium tracking-widest text-sm animate-pulse">
              正在載入 Facebook 留言板...
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              <p className="font-bold text-gray-700 mb-2">⚠ 無法顯示留言板</p>
              <p>這通常是因為您安裝了 <strong>擋廣告外掛 (AdBlock)</strong><br className="hidden md:block"/> 或瀏覽器開啟了「追蹤保護 (如 Brave 或 Safari)」。</p>
              <p className="mt-3 text-xs text-blue-500">請試著將本網站加入白名單，即可正常與粉絲互動喔！</p>
            </div>
          )}
        </div>
      )}

      {/* FB 實際留言區塊容器 (載入後會蓋在前方的提示層之上) */}
      <div className="w-full relative z-10 bg-white">
        <div 
          className="fb-comments w-full flex justify-center" 
          data-href={pageUrl} 
          data-width="100%" 
          data-numposts="5"
        ></div>
      </div>
      
    </div>
  );
}
