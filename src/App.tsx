import { useState, useEffect } from 'react';
import { Youtube, Instagram, Facebook, Globe, Music, Mic2, AtSign, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import YouTubePlaylist from './components/YouTubePlaylist';
import CusdisComments from './components/CusdisComments';

import { Language } from './locales';
import { useTranslation } from './hooks/useTranslation';

function MainContent() {
  const { t, lang, setLang } = useTranslation();
  const timelineItems = t.timelineItems;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeVideoTab, setActiveVideoTab] = useState('all');
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);

  // Scroll to top when changing route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-dark text-gray-100 font-sans selection:bg-gold/30 selection:text-gold-light flex flex-col pt-20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl font-semibold tracking-widest text-gold cursor-pointer" onClick={closeMenu}>
            PONPON
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest">
            <Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.home}</Link>
            <Link to="/about" className={`transition-colors ${location.pathname === '/about' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.about}</Link>
            <Link to="/timeline" className={`transition-colors ${location.pathname === '/timeline' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.timeline}</Link>
            <Link to="/news" className={`transition-colors ${location.pathname === '/news' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.news}</Link>
            <Link to="/interview" className={`transition-colors ${location.pathname === '/interview' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.interview}</Link>
            <Link to="/videos" className={`transition-colors ${location.pathname === '/videos' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.videos}</Link>
            <Link to="/links" className={`transition-colors ${location.pathname === '/links' ? 'text-gold' : 'hover:text-gold'}`}>{t.nav.links}</Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-sm border-none outline-none cursor-pointer hover:text-gold transition-colors focus:ring-0"
              >
                <option value="zh" className="bg-dark text-white">中文</option>
                <option value="en" className="bg-dark text-white">EN</option>
                <option value="ja" className="bg-dark text-white">日本語</option>
              </select>
            </div>
            <div className="hidden md:flex opacity-70 hover:opacity-100 transition-opacity shrink-0">
              <img src="https://visitor-badge.laobi.icu/badge?page_id=ponponchen.com&left_color=gray&right_color=goldenrod&left_text=VISITORS" alt="Visitors" className="h-5" />
            </div>
            
            {/* Mobile Hamburger Button */}
            <button 
              className="md:hidden text-gray-300 hover:text-gold p-2 transition-colors ml-4 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-dark/95 backdrop-blur-xl pt-24 pb-12 px-6 md:hidden flex flex-col items-center space-y-6 overflow-y-auto"
          >
            <div className="flex flex-col items-center space-y-8 w-full max-w-sm mt-8">
              <Link to="/" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 border-b border-white/5 transition-colors ${location.pathname === '/' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.home}</Link>
              <Link to="/about" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 border-b border-white/5 transition-colors ${location.pathname === '/about' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.about}</Link>
              <Link to="/timeline" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 border-b border-white/5 transition-colors ${location.pathname === '/timeline' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.timeline}</Link>
              <Link to="/news" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 border-b border-white/5 transition-colors ${location.pathname === '/news' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.news}</Link>
              <Link to="/interview" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 border-b border-white/5 transition-colors ${location.pathname === '/interview' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.interview}</Link>
              <Link to="/videos" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 border-b border-white/5 transition-colors ${location.pathname === '/videos' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.videos}</Link>
              <Link to="/links" onClick={closeMenu} className={`text-xl uppercase tracking-[0.2em] w-full text-center py-3 transition-colors ${location.pathname === '/links' ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>{t.nav.links}</Link>
              
              <div className="pt-8 w-full flex justify-center opacity-70">
                <img src="https://visitor-badge.laobi.icu/badge?page_id=ponponchen.com&left_color=gray&right_color=goldenrod&left_text=VISITORS" alt="Visitors" className="h-6" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow">
      <Routes>
        <Route path="/" element={
          <section id="hero" className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden py-12 md:py-20">
        {/* Atmospheric background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-[1px] w-12 bg-gold"></div>
              <span className="uppercase tracking-[0.3em] text-xs font-semibold text-gold">{t.hero.subtitle}</span>
            </div>
            <h1 className="font-serif mb-6 leading-tight flex flex-col gap-2 md:gap-4">
              <span className="text-5xl md:text-7xl lg:text-7xl tracking-wide">{t.hero.title}</span>
              <span className="text-3xl md:text-4xl lg:text-5xl text-gray-300 tracking-widest">(陳芃瑄)</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-light max-w-md leading-relaxed italic font-serif">
              "{t.hero.slogan}"
            </p>
            <div className="mt-8 text-sm md:text-base text-gray-400/80 leading-relaxed font-sans bg-white/5 border border-white/10 p-5 rounded-2xl shadow-inner max-w-lg md:mx-0 mx-auto text-left relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
              <div className="absolute top-0 left-0 w-1 h-full bg-gold/50 group-hover:bg-gold transition-colors duration-500"></div>
              <span className="text-gold/80 block mb-2 font-medium tracking-widest text-xs uppercase flex items-center gap-2">
                <Music className="w-3 h-3" /> Fan Project
              </span>
              <span dangerouslySetInnerHTML={{ __html: t.hero.disclaimer as string }} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="order-1 md:order-2 flex justify-center"
          >
            <div className="relative w-64 h-80 md:w-80 md:h-[450px] rounded-t-full overflow-hidden border border-white/10 p-2">
              <div className="w-full h-full rounded-t-full overflow-hidden bg-dark-lighter relative">
                {/* Hero Image */}
                <img 
                  src="https://shoutoutla.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/04/c-PonponChen__IMG5020_1712948629197.jpg" 
                  alt="Ponpon Chen" 
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
        } />

        {/* About Section */}
        <Route path="/about" element={
      <section id="about" className="py-12 md:py-32 bg-dark-lighter relative min-h-[calc(100vh-80px)] flex items-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Mic2 className="w-8 h-8 text-gold mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-serif mb-10 text-center">{t.about.title}</h2>
            <p className="text-gray-300 leading-loose text-lg font-light md:text-xl text-left whitespace-pre-wrap max-w-3xl mx-auto">
              {t.about.description}
            </p>
            
            <div className="mt-16 inline-flex items-center justify-center space-x-4 border border-gold/30 rounded-full px-8 py-4 bg-dark/50">
              <Music className="w-5 h-5 text-gold" />
              <span className="text-sm tracking-widest uppercase text-gold-light">New Album 2026</span>
            </div>
          </motion.div>
        </div>
      </section>
        } />

        {/* Timeline Section */}
        <Route path="/timeline" element={
      <section id="timeline" className="py-12 md:py-32 bg-dark relative border-t border-white/5 overflow-hidden min-h-[calc(100vh-80px)]">
        {/* Background glow for timeline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px] pointer-events-none hidden md:block"></div>
        
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6">{t.timeline.title}</h2>
            <p className="text-gray-400 font-light max-w-xl mx-auto">{t.timeline.description}</p>
          </motion.div>

          {/* Timeline Container */}
          <div className="relative max-w-3xl mx-auto">
            {/* The vertical connector line */}
            <div className="absolute left-[15px] md:left-1/2 md:-ml-[1px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

            <div className="space-y-16 md:space-y-24">
              {timelineItems.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} group`}
                  >
                     {/* Center dot (Desktop) / Left dot (Mobile) */}
                     <div className="absolute left-[11px] md:left-1/2 md:-ml-[5px] top-1.5 w-[10px] h-[10px] rounded-full bg-gold shadow-[0_0_15px_rgba(212,175,55,0.8)] group-hover:bg-gold-light group-hover:scale-150 transition-all duration-300 z-10 border-2 border-dark"></div>
                     
                     {/* Desktop Spacer matching 50% width */}
                     <div className="hidden md:block w-1/2"></div>

                     {/* Content Card */}
                     <div className={`pl-12 md:pl-0 w-full md:w-1/2 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'} relative z-20`}>
                       <div className="bg-dark-lighter/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl group-hover:border-gold/30 transition-colors duration-500 hover:shadow-2xl hover:shadow-gold/5">
                         <span className="inline-block px-3 py-1 bg-gold/10 text-gold-light rounded-full text-sm font-mono tracking-widest mb-4">
                           {item.year}
                         </span>
                         <h3 className="text-xl md:text-2xl font-serif text-white mb-3 group-hover:text-gold transition-colors">{item.title}</h3>
                         <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base selection:bg-gold/30">
                           <span dangerouslySetInnerHTML={{ __html: item.desc as string }} />
                         </p>
                       </div>
                     </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
        } />

        {/* News Section */}
        <Route path="/news" element={
      <section id="news" className="py-12 md:py-32 bg-dark-lighter relative min-h-[calc(100vh-80px)]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6">{t.news.title}</h2>
            <p className="text-gray-400 font-light">{t.news.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <a 
              href="https://www.worldjournal.com/wj/story/121360/9063230" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://pgw.worldjournal.com/gw/photo.php?u=https://uc.udn.com.tw/photo/wj/realtime/2025/10/11/33336910.jpg&s=Y&x=0&y=19&sw=1280&sh=852&sl=W&fw=800&exp=3600" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article1}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article1Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://www.instagram.com/p/DM2TUqZTFYx/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
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
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://www.taipeitimes.com/News/taiwan/archives/2025/07/27/2003840999" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://img.taipeitimes.com/images/2025/07/27/P03-250727-601.jpg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source4}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article4}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article4Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://ocacnews.net/article/403781" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://ocacnews.net/storage/articleImages/20250722/M2_dbff1573ef73ec0a4780d7e1726880bc.jpeg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source5}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article5}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article5Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://ocacnews.net/article/403561" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://ocacnews.net/storage/articleImages/20250719/M2_yYFC1QYylcwhLOAcFiLFesVyj7ZJYaL5apEMScyD.jpg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source8}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article8}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article8Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://www.cna.com.tw/news/amov/202507180145.aspx" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://imgcdn.cna.com.tw/www/webphotos/WebOg/600/20250718/1365x716_469323157184.jpg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source3}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article3}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article3Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://shoutoutla.com/meet-ponpon-chen-singer-jazz-guitarist-songwriter/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://shoutoutla.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/04/c-PersonalPonponChen__IMG3539_1712979648617.jpg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source6}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article6}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article6Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://star.ettoday.net/news/1164745" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://cdn2.ettoday.net/images/3271/e3271688.jpg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source9}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article9}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article9Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://www.chinatimes.com/newspapers/20160824000626-260507?chdtv" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5 flex items-start justify-center">
                  <img 
                    src="https://images.chinatimes.com/newsphoto/2016-08-24/1024/BBC100_P_02_02.jpg" 
                    alt="News Article" 
                    className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source2}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article2}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article2Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>

            <a 
              href="https://news.ltn.com.tw/news/life/breakingnews/1327418" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                  <img 
                    src="https://img.ltn.com.tw/Upload/news/600/2015/05/24/1327418_1.jpg" 
                    alt="News Article" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                  <div className="flex items-center mb-4">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.news.source11}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                    {t.news.article11}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {t.news.article11Desc}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                    <span>{t.news.readMore}</span>
                    <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </section>
        } />

        {/* Interview Section */}
        <Route path="/interview" element={
      <section id="interview" className="py-12 md:py-32 bg-dark-lighter relative min-h-[calc(100vh-80px)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6">{t.interview.title}</h2>
            <p className="text-gray-400 mb-12 font-light">{t.interview.description}</p>
            
            <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
              
              {/* RTI Part 2 (Newest) */}
              <a 
                href="https://www.rti.org.tw/programnews?uid=4&pid=100400" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                  <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                    <img 
                      src="https://shoutoutla.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/04/c-PonponChen__IMG5020_1712948629197.jpg" 
                      alt="Interview Cover" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                    <div className="flex items-center mb-4">
                      <Mic2 className="w-4 h-4 text-gold mr-2" />
                      <span className="text-xs font-mono text-gold-light tracking-widest">{t.interview.rti2Date}</span>
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                      {t.interview.rti2}
                    </h3>
                    <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                      <span>{t.interview.listenNow}</span>
                      <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
              </a>

              {/* RTI Part 1 */}
              <a 
                href="https://www.rti.org.tw/programnews?uid=4&pid=99800" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                  <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                    <img 
                      src="https://shoutoutla.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/04/c-PersonalPonponChen__IMG3539_1712979648617.jpg" 
                      alt="Interview Cover" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 text-left flex flex-col justify-center h-full py-2">
                    <div className="flex items-center mb-4">
                      <Mic2 className="w-4 h-4 text-gold mr-2" />
                      <span className="text-xs font-mono text-gold-light tracking-widest">{t.interview.rti1Date}</span>
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl mb-4 group-hover:text-gold transition-colors leading-snug">
                      {t.interview.rti1}
                    </h3>
                    <div className="mt-auto flex items-center text-xs text-gray-300 uppercase tracking-wider">
                      <span>{t.interview.listenNow}</span>
                      <div className="ml-3 w-6 h-[1px] bg-gray-500 group-hover:bg-gold group-hover:w-10 transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
              </a>

              {/* Podcast 1 (BCC Radio) */}
              <div className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter relative overflow-hidden text-left hover:border-gold/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 flex flex-col h-full items-start">
                  <div className="flex items-center mb-4">
                    <Mic2 className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.interview.pod1Date}</span>
                    <span className="mx-3 text-white/20">|</span>
                    <Globe className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-xs font-mono text-gray-400 tracking-widest">{t.interview.podSource}</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl mb-6 group-hover:text-gold transition-colors leading-snug">
                    {t.interview.pod1}
                  </h3>
                  
                  <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-gold/5 border border-white/10 bg-dark-lighter">
                    <iframe 
                      style={{ borderRadius: '12px' }} 
                      src="https://embed.podcasts.apple.com/tw/podcast/2026-3-08-midnight-you-me-%E6%9C%89%E4%BA%BA%E4%BE%86%E8%A8%AA-%E8%87%BA%E7%81%A3%E7%88%B5%E5%A3%AB%E5%A5%BD%E5%A5%B3%E8%81%B2-%E5%94%B1%E9%80%B2%E7%BE%8E%E5%9C%8B%E6%96%B0%E8%81%9E%E5%9C%88-%E5%B0%88%E8%A8%AA-%E9%99%B3%E8%8A%83%E7%91%84/id1642839567?i=1000760815048&theme=dark" 
                      width="100%" 
                      height="175" 
                      frameBorder="0" 
                      allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
                      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
                      title="Apple Podcast Interview"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Podcast 2 (Spotify) */}
              <div className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter relative overflow-hidden text-left hover:border-gold/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 flex flex-col h-full items-start">
                  <div className="flex items-center mb-4">
                    <Mic2 className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.interview.pod2Date}</span>
                    <span className="mx-3 text-white/20">|</span>
                    <Globe className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-xs font-mono text-gray-400 tracking-widest">{t.interview.pod2Source}</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl mb-6 group-hover:text-gold transition-colors leading-snug">
                    {t.interview.pod2}
                  </h3>
                  
                  <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-gold/5 border border-white/10">
                    <iframe 
                      style={{ borderRadius: '12px' }} 
                      src="https://open.spotify.com/embed/episode/5E9Bl69WxCP1Ppj5oHC8V7?utm_source=generator&theme=0" 
                      width="100%" 
                      height="352" 
                      frameBorder="0" 
                      allowFullScreen={false} 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                      loading="lazy"
                      title="Spotify Podcast Interview"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Podcast 3 (Apple Podcast) */}
              <div className="group block p-8 border border-white/10 rounded-2xl bg-dark-lighter relative overflow-hidden text-left hover:border-gold/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 flex flex-col h-full items-start">
                  <div className="flex items-center mb-4">
                    <Mic2 className="w-4 h-4 text-gold mr-2" />
                    <span className="text-xs font-mono text-gold-light tracking-widest">{t.interview.pod3Date}</span>
                    <span className="mx-3 text-white/20">|</span>
                    <Globe className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-xs font-mono text-gray-400 tracking-widest">{t.interview.pod3Source}</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl mb-6 group-hover:text-gold transition-colors leading-snug">
                    {t.interview.pod3}
                  </h3>
                  
                  <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-gold/5 border border-white/10 bg-dark-lighter">
                    <iframe 
                      style={{ borderRadius: '12px' }} 
                      src="https://embed.podcasts.apple.com/tw/podcast/ep125-%E4%BC%91%E5%AD%B8%E5%8B%87%E9%97%96%E6%B4%9B%E6%9D%89%E7%A3%AF%E8%BF%BD%E5%A4%A2-%E9%80%A3-abc-news-%E9%83%BD%E7%9C%8B%E5%88%B0%E5%A5%B9%E7%9A%84%E7%88%B5%E5%A3%AB%E5%AF%A6%E5%8A%9B-feat-ponpon-chen-%E9%99%B3%E8%8A%83%E7%91%84/id1681464862?i=1000726811092&theme=dark" 
                      width="100%" 
                      height="175" 
                      frameBorder="0" 
                      allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
                      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
                      title="Apple Podcast Interview 3"
                    ></iframe>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>
        } />

        {/* Videos Section */}
        <Route path="/videos" element={
      <section id="videos" className="py-12 md:py-32 bg-dark relative min-h-[calc(100vh-80px)]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6">{t.videos.title}</h2>
            <p className="text-gray-400 mb-8 font-light">{t.videos.description}</p>
            
            {/* Filter Tabs */}
            <div className="flex overflow-x-auto gap-2 md:gap-4 pb-4 mb-8 custom-scrollbar hide-scrollbar-on-mobile w-full justify-start md:justify-center sticky top-20 z-40 bg-dark/95 backdrop-blur-md pt-4 border-b border-white/5">
              {[
                { id: 'all', label: lang === 'zh' ? '全部' : lang === 'ja' ? 'すべて' : 'All' },
                { id: 'p1', label: t.videos.p1 },
                { id: 'p2', label: t.videos.p2 },
                { id: 'p3', label: t.videos.p3 },
                { id: 'p4', label: t.videos.p4 },
                { id: 'p5', label: t.videos.p5 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveVideoTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                    activeVideoTab === tab.id 
                      ? 'bg-gold text-dark shadow-lg shadow-gold/20 scale-105' 
                      : 'bg-dark-lighter border border-white/10 text-gray-300 hover:text-gold hover:border-gold/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className={`grid grid-cols-1 ${activeVideoTab === 'all' ? 'md:grid-cols-2' : ''} gap-8 mb-16`}>
              {(activeVideoTab === 'all' || activeVideoTab === 'p1') && (
                 <YouTubePlaylist title={t.videos.p1} playlistId="PLLwWHVIUlB8lzbav-7ETbHfJhDqZDOkJj" featured={activeVideoTab !== 'all'} />
              )}
              {(activeVideoTab === 'all' || activeVideoTab === 'p2') && (
                 <YouTubePlaylist title={t.videos.p2} playlistId="PLLwWHVIUlB8lbrhitwdm9yq5MhKKn_lNT" featured={activeVideoTab !== 'all'} />
              )}
              {(activeVideoTab === 'all' || activeVideoTab === 'p3') && (
                 <YouTubePlaylist title={t.videos.p3} playlistId="PLLwWHVIUlB8llQJXiVeWR7vSSsg8Ink4e" featured={activeVideoTab !== 'all'} />
              )}
              {(activeVideoTab === 'all' || activeVideoTab === 'p4') && (
                 <YouTubePlaylist title={t.videos.p4} playlistId="PLLwWHVIUlB8ltR-2B1q4ZAFnQm6NOGxJq" featured={activeVideoTab !== 'all'} />
              )}
            </div>

            {/* Fan Cams (Social Media) */}
            {(activeVideoTab === 'all' || activeVideoTab === 'p5') && (
              <div className="mt-8 border-t border-white/10 pt-12 md:pt-16">
                <h3 className="text-2xl font-serif mb-8 text-gold">{t.videos.p5}</h3>
                <div className="flex flex-wrap justify-center gap-8">
                  <div className="flex flex-col items-center">
                    <p className="text-gray-300 mb-4 font-medium tracking-wide">20260204 Music Corner 角落音樂餐廳。</p>
                    <div className="rounded-2xl overflow-hidden shadow-2xl shadow-gold/5 border border-white/10 bg-black inline-block">
                      <iframe 
                        src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1177729904529661&show_text=false&width=316&t=0" 
                        width="316" 
                        height="562" 
                        style={{ border: 'none', overflow: 'hidden' }} 
                        scrolling="no" 
                        frameBorder="0" 
                        allowFullScreen={true} 
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
        } />

        {/* Links Section */}
        <Route path="/links" element={<>
      <section id="links" className="py-12 md:py-32 bg-dark-lighter relative min-h-max">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-16">{t.links.title}</h2>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a 
                href="https://www.ponponchen.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 md:p-10 border border-white/5 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]"
              >
                <Globe className="w-8 h-8 md:w-10 md:h-10 mb-4 text-gray-400 group-hover:text-gold transition-colors" />
                <span className="tracking-widest uppercase text-xs md:text-sm whitespace-nowrap">{t.links.website}</span>
              </a>

              <a 
                href="https://youtube.com/channel/UCXeuyoBvlK5y0Wq173rfzow" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 md:p-10 border border-white/5 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]"
              >
                <Youtube className="w-8 h-8 md:w-10 md:h-10 mb-4 text-gray-400 group-hover:text-[#FF0000] transition-colors" />
                <span className="tracking-widest uppercase text-xs md:text-sm whitespace-nowrap">{t.links.youtube}</span>
              </a>
              
              <a 
                href="https://www.instagram.com/ponponofficial_/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 md:p-10 border border-white/5 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]"
              >
                <Instagram className="w-8 h-8 md:w-10 md:h-10 mb-4 text-gray-400 group-hover:text-[#E1306C] transition-colors" />
                <span className="tracking-widest uppercase text-xs md:text-sm whitespace-nowrap">{t.links.instagram}</span>
              </a>

              <a 
                href="https://www.threads.com/@ponponofficial_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 md:p-10 border border-white/5 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]"
              >
                <AtSign className="w-8 h-8 md:w-10 md:h-10 mb-4 text-gray-400 group-hover:text-white transition-colors" />
                <span className="tracking-widest uppercase text-xs md:text-sm whitespace-nowrap">{t.links.threads}</span>
              </a>
              
              <a 
                href="https://facebook.com/ponpon0405" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 md:p-10 border border-white/5 rounded-2xl bg-dark-lighter hover:border-gold/50 transition-all duration-300 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]"
              >
                <Facebook className="w-8 h-8 md:w-10 md:h-10 mb-4 text-gray-400 group-hover:text-[#1877F2] transition-colors" />
                <span className="tracking-widest uppercase text-xs md:text-sm whitespace-nowrap">{t.links.facebook}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comments Section */}
      <section id="comments" className="py-32 bg-dark relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gold">{t.comments.title}</h2>
            <p className="text-gray-400 font-light italic">
              "{t.comments.description}"
            </p>
          </motion.div>
          
          <div className="bg-dark-lighter p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl shadow-gold/5">
            <CusdisComments lang={lang} />
          </div>
        </div>
      </section>
        </>} />
      </Routes>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/5 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Ponpon Chen Fan Site &middot; Unofficial &bull; Built by Sam Lin</p>
        <p className="mt-2 text-xs text-gray-600">All rights to content belong to their respective owners.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}
