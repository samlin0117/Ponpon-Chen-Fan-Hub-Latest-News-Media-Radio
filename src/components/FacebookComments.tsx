import { useEffect } from 'react';

export default function FacebookComments() {
  const pageUrl = "https://samlin0117.github.io/Ponpon-Chen-Fan-Hub-Latest-News-Media-Radio/";

  useEffect(() => {
    // 1. 確保 fb-root 存在
    if (!document.getElementById('fb-root')) {
      const root = document.createElement('div');
      root.id = 'fb-root';
      document.body.appendChild(root);
    }

    // 2. Facebook 官方的非同步初始化函式
    (window as any).fbAsyncInit = function() {
      (window as any).FB.init({
        xfbml      : true,
        version    : 'v19.0'
      });
    };

    // 3. 載入 Facebook SDK 腳本
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = "https://connect.facebook.net/zh_TW/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    } else {
      // 若曾經載入過，要求 FB 重新渲染
      if ((window as any).FB) {
        (window as any).FB.XFBML.parse();
      }
    }
  }, []);

  return (
    <div className="w-full bg-white rounded-xl p-4 md:p-8 min-h-[200px] flex flex-col items-center justify-center">
      <p className="text-gray-400 text-sm mb-4 relative z-0">
        🎵 如果您沒有看到留言板，代表 Facebook 拒絕在此環境顯示。<br/>
        (在您的 GitHub Pages 正式網址中通常會正常顯示)
      </p>
      
      {/* 實際留言區塊 */}
      <div className="w-full relative z-10 flex justify-center">
        <div 
          className="fb-comments" 
          data-href={pageUrl} 
          data-width="100%" 
          data-numposts="5"
        ></div>
      </div>
    </div>
  );
}
