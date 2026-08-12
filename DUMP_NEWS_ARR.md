=== Search for "newsArticles" or "articles" array definitions ===
newsArticles: found at pos -1
newsData: found at pos -1
articleImages: found at pos 46814
article10: found at pos 42872
articles =: found at pos -1
newsItems: found at pos -1

=== Context around article10 ===
0">
                      <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                        <img
                          src="https://heavenraven.com/wp-content/uploads/2025/08/IMG_20250802_COVER-1024x1024.jpg"
                          onError={(e) => {
                            // Fallback robust image link (Shoutout LA photo) if original link fails
                            e.currentTarget.src = "https://shoutoutla.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/04/c-PonponChen__IMG5020_1712948629197.jpg";
                          }}
                          alt="News Article"
                          className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                        <div className="flex items-center mb-4">
                          <Globe className="w-4 h-4 text-gold mr-2" />
                          <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source10}</span>
                        </div>
                        <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                          {t.news.article10}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                          {t.news.article10Desc}
                        </p>
                        <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                          <span>{t.news.readMore}</span>
                          <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 trans
