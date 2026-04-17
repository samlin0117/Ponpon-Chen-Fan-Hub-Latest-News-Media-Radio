import { useEffect, useState, useRef } from 'react';

export default function FacebookComments() {
  const pageUrl = "https://samlin0117.github.io/Ponpon-Chen-Fan-Hub-Latest-News-Media-Radio/";
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. 確保 fb-root 存在
    let fbRoot = document.getElementById('fb-root');
    if (!fbRoot) {
      fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.appendChild(fbRoot);
    }

    const initFB = () => {
      if ((window as any).FB && containerRef.current) {
        // 使用明確指定區塊的方式讓 FB 重新解析，更穩健
        (window as any).FB.XFBML.parse(containerRef.current, () => {
          // FB 渲染完成的回調
          setStatus('loaded');
        });
      }
    };

    // 2. 載入腳本
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      // 注意：拿掉 app version 改用最基礎的寫法，有時候可以避開跨域擋截
      script.src = "https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v19.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      
      script.onload = () => {
        // Facebook 官方 SDK load 完畢後，還需要初始化
        if ((window as any).FB) {
           initFB();
        }
      };
      
      script.onerror = () => setStatus('error');
      
      document.body.appendChild(script);
    } else {
      // 腳本已存在，若狀態為未加載，延遲一點給它機會
      setTimeout(initFB, 500); 
    }

    // 4 秒後超時偵測
    const timer = setTimeout(() => {
      if (document.querySelector('.fb-comments span iframe') === null) {
         setStatus('error');
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full relative min-h-[250px] flex items-center justify-center bg-white rounded-xl p-4 md:p-8 overflow-hidden">
      
      {/* 錯誤或加載提示層 */}
      {status !== 'loaded' && (
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 bg-gray-50 z-20">
          {status === 'loading' ? (
            <div className="text-gray-400 font-medium tracking-widest text-sm animate-pulse">
              正在載入 Facebook 留言板...
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              <p className="font-bold text-gray-700 mb-2">⚠ 無法顯示留言板</p>
              <p>這通常是因為瀏覽器的<strong>追蹤保護</strong>或<strong>擋廣告外掛</strong>阻擋了 Facebook。</p>
              <p className="mt-3 text-xs text-blue-500">建議：使用無痕模式開啟，或將本網站加入白名單。</p>
            </div>
          )}
        </div>
      )}

      {/* FB 實際留言區塊 */}
      <div className="w-full relative z-10" ref={containerRef}>
        <div 
          className="fb-comments w-full" 
          data-href={pageUrl} 
          data-width="100%" 
          data-numposts="5"
          data-order-by="reverse_time"
        ></div>
      </div>
      
    </div>
  );
}
