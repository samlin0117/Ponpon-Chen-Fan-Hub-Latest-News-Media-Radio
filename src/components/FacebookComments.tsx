import { useEffect } from 'react';

export default function FacebookComments() {
  useEffect(() => {
    // 檢查是否已經載入過 FB SDK
    if (document.getElementById('facebook-jssdk')) return;

    // 動態載入 FB SDK
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = "https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v18.0";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

  }, []);

  useEffect(() => {
    // 當元件掛載或重新渲染時，請 FB 重新解析留言板 (針對 React Router 或重新整理)
    if ((window as any).FB) {
      (window as any).FB.XFBML.parse();
    }
  });

  // 使用我們部署在 GitHub Pages 上的最終網址作為留言板的綁定依據
  const pageUrl = "https://samlin0117.github.io/Ponpon-Chen-Fan-Hub-Latest-News-Media-Radio/";

  return (
    <div className="w-full relative min-h-[300px] flex items-center justify-center bg-white rounded-xl p-4 md:p-8">
      {/* FB 留有自己的暗色模式，但在跨平台常常有 Bug，因此我們在白底的容器內安全呈現它，維持最好的易讀性 */}
      <div id="fb-root"></div>
      <div 
        className="fb-comments" 
        data-href={pageUrl} 
        data-width="100%" 
        data-numposts="10"
        data-colorscheme="light"
      ></div>
    </div>
  );
}
