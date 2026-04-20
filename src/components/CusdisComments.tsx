import { ReactCusdis } from 'react-cusdis';

export default function CusdisComments() {
  const appId = import.meta.env.VITE_CUSDIS_APP_ID || "14de6220-7400-4e81-a30e-5cea977722ab";

  return (
    <div className="w-full relative">
      <div className="text-center mb-6">
        <p className="text-gray-400 text-sm">
          💡 請在此留下想對 Ponpon 說的話。 (免登入即可留言，為了維護版面品質，留言發送後需稍微等待版主審核才會顯示唷！)
        </p>
      </div>
      <div className="w-full min-h-[300px] text-left">
        <ReactCusdis
          attrs={{
            host: 'https://cusdis.com',
            appId: appId,
            pageId: 'ponpon-fan-site-main',
            pageTitle: 'Ponpon Fan Site Messages',
            pageUrl: window.location.href,
            theme: 'dark'
          }}
        />
      </div>
    </div>
  );
}
