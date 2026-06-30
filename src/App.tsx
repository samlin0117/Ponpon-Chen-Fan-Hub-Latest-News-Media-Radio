import { useState, useEffect } from 'react';
import { Youtube, Instagram, Facebook, Globe, Music, Mic2, AtSign, Menu, X, Trophy, ArrowRight, Star, Disc3, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import FirebaseComments from './components/FirebaseComments';
import { videoList, VideoInfo } from './data/videos';
import VideoCard from './components/VideoCard';
import VideoGroupCard from './components/VideoGroupCard';
import QuizGame from './components/QuizGame';
import Repertoire from './components/Repertoire';
import Mentors from './components/Mentors';
import SignatureTechniques from './components/SignatureTechniques';


import { Language } from './locales';
import { useTranslation } from './hooks/useTranslation';

function MainContent() {
  const { t, lang, setLang } = useTranslation();
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'first' | 'album'>('all');
  const timelineItems = t.timelineItems as any[];
  const filteredTimelineItems = timelineItems.filter(item => {
    if (timelineFilter === 'all') return item.category !== 'first' && item.category !== 'album';
    return item.category === timelineFilter;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeVideoTab, setActiveVideoTab] = useState('p1');
  const [activeYearTab, setActiveYearTab] = useState('all');
  const [activeTimelineVideo, setActiveTimelineVideo] = useState<{type: 'youtube' | 'facebook', url: string, videoId?: string} | null>(null);
  const location = useLocation();

  const handleTimelineClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.target as HTMLElement;
    const aTag = target.closest('a');
    if (aTag && aTag.href) {
      const url = aTag.href;
      if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
        e.preventDefault();
        let videoId = '';
        try {
          if (url.includes('youtube.com/watch')) {
            const urlObj = new URL(url);
            videoId = urlObj.searchParams.get('v') || '';
          } else {
            videoId = url.split('youtu.be/')[1].split('?')[0];
          }
        } catch (err) {}
        if (videoId) {
          setActiveTimelineVideo({ type: 'youtube', url, videoId });
        }
      } else if (url.includes('facebook.com') && url.includes('/videos/')) {
        e.preventDefault();
        setActiveTimelineVideo({ type: 'facebook', url });
      }
    }
  };

  const carouselImages = [
    {
      src: "https://shoutoutla.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/04/c-PonponChen__IMG5020_1712948629197.jpg",
      link: "https://www.facebook.com/photo/?fbid=3842701859081991&set=a.482592819724323"
    },
    {
      src: "/slide1.jpg",
      link: "https://www.facebook.com/photo/?fbid=1777153813601544&set=pb.100039208281828.-2207520000"
    },
    {
      src: "/slide2.jpg",
      link: "https://www.facebook.com/photo/?fbid=1771077854209140&set=pb.100039208281828.-2207520000"
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

                  {/* Changelog Entry Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12"
                  >
                    <Link
                      to="/changelog"
                      className="inline-flex items-center gap-4 px-10 py-5 border-2 border-gold/40 hover:border-gold bg-gold/15 hover:bg-gold/25 rounded-full text-base font-bold tracking-[0.2em] text-gold hover:text-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:shadow-gold/40 group"
                    >
                      <div className="w-12 h-0.5 bg-gold/50 group-hover:bg-gold transition-colors"></div>
                      <span>{t.nav.changelog}</span>
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="order-1 md:order-2 flex justify-center"
                >
                  <div className="relative w-64 h-80 md:w-80 md:h-[450px] rounded-t-full overflow-hidden border border-white/10 p-2 group">
                    <a
                      href={carouselImages[currentImageIndex].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full rounded-t-full overflow-hidden bg-dark-lighter relative cursor-pointer"
                    >
                      {/* Hero Images Carousel */}
                      <AnimatePresence initial={false}>
                        <motion.img
                          key={currentImageIndex}
                          src={carouselImages[currentImageIndex].src}
                          alt="Ponpon Chen"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.8 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute inset-0 w-full h-full object-cover hover:opacity-100 transition-all duration-700"
                          referrerPolicy="no-referrer"
                          loading={currentImageIndex === 0 ? "eager" : "lazy"}
                        />
                      </AnimatePresence>
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent pointer-events-none"></div>
                      {/* Image Source Attribution */}
                      <div
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/50 group-hover:text-white/90 whitespace-nowrap bg-black/50 group-hover:bg-black/80 px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 z-20 flex items-center gap-1.5"
                      >
                        <Facebook className="w-3 h-3" />
                        <span>{t.hero.photoSource as string}</span>
                      </div>
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>
          } />

          <Route path="/about" element={
            <section id="about" className="py-12 md:py-32 bg-dark-lighter relative min-h-[calc(100vh-80px)] flex items-center">
              <div className="max-w-4xl mx-auto px-6 relative">
                {/* Top-left action buttons */}
                <div className="relative md:absolute mb-10 md:mb-0 md:-top-12 left-0 md:-left-20 flex items-center justify-center md:justify-start gap-3 flex-wrap z-30">
                  <Link
                    to="/signature"
                    className="relative flex items-center gap-3 px-6 py-3 bg-gold/10 hover:bg-gold/20 border border-gold/40 rounded-2xl text-gold-light text-sm font-bold tracking-widest transition-all hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-gold/20 group"
                  >
                    <Mic2 className="w-5 h-5 text-gold group-hover:rotate-12 transition-transform" />
                    <span>{(t as any).signature?.title || '特色技巧'}</span>
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 w-64 p-4 bg-dark/95 backdrop-blur-md border border-white/10 rounded-xl text-gray-300 text-xs font-normal leading-relaxed text-center shadow-2xl scale-95 group-hover:scale-100 origin-top">
                      <span dangerouslySetInnerHTML={{ __html: ((t as any).signature?.description || (t as any).signature?.intro || '').split('<br/>')[0] }} />
                    </div>
                  </Link>
                  <Link
                    to="/quiz"
                    className="relative flex items-center gap-3 px-6 py-3 bg-gold/10 hover:bg-gold/20 border border-gold/40 rounded-2xl text-gold-light text-sm font-bold tracking-widest transition-all hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-gold/20 group"
                  >
                    <Trophy className="w-5 h-5 text-gold group-hover:rotate-12 transition-transform" />
                    <span>{t.nav.quiz}</span>
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 w-64 p-4 bg-dark/95 backdrop-blur-md border border-white/10 rounded-xl text-gray-300 text-xs font-normal leading-relaxed text-center shadow-2xl scale-95 group-hover:scale-100 origin-top">
                      <span dangerouslySetInnerHTML={{ __html: ((t as any).quiz?.description || '').split('<br/>')[0] }} />
                    </div>
                  </Link>
                  <Link
                    to="/endorsement"
                    className="relative flex items-center gap-3 px-6 py-3 bg-gold/10 hover:bg-gold/20 border border-gold/40 rounded-2xl text-gold-light text-sm font-bold tracking-widest transition-all hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-gold/20 group"
                  >
                    <Star className="w-5 h-5 text-gold group-hover:rotate-12 transition-transform" />
                    <span>{(t as any).endorsement?.title || 'Notable Mentions'}</span>
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 w-64 p-4 bg-dark/95 backdrop-blur-md border border-white/10 rounded-xl text-gray-300 text-xs font-normal leading-relaxed text-center shadow-2xl scale-95 group-hover:scale-100 origin-top">
                      {(t as any).endorsement?.page_desc}
                    </div>
                  </Link>
                  <Link
                    to="/repertoire"
                    className="relative flex items-center gap-3 px-6 py-3 bg-gold/10 hover:bg-gold/20 border border-gold/40 rounded-2xl text-gold-light text-sm font-bold tracking-widest transition-all hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-gold/20 group"
                  >
                    <Disc3 className="w-5 h-5 text-gold group-hover:animate-spin transition-transform" />
                    <span>{(t as any).repertoire?.title || 'Jazz Repertoire'}</span>
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 w-64 p-4 bg-dark/95 backdrop-blur-md border border-white/10 rounded-xl text-gray-300 text-xs font-normal leading-relaxed text-center shadow-2xl scale-95 group-hover:scale-100 origin-top">
                      {(t as any).repertoire?.description}
                    </div>
                  </Link>
                  <Link
                    to="/mentors"
                    className="relative flex items-center gap-3 px-6 py-3 bg-gold/10 hover:bg-gold/20 border border-gold/40 rounded-2xl text-gold-light text-sm font-bold tracking-widest transition-all hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-gold/20 group"
                  >
                    <Users className="w-5 h-5 text-gold group-hover:-translate-y-1 transition-transform" />
                    <span>{(t as any).mentors?.title || '音樂推手'}</span>
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 w-64 p-4 bg-dark/95 backdrop-blur-md border border-white/10 rounded-xl text-gray-300 text-xs font-normal leading-relaxed text-center shadow-2xl scale-95 group-hover:scale-100 origin-top">
                      <span dangerouslySetInnerHTML={{ __html: ((t as any).mentors?.description || '').split('<br/>')[0] }} />
                    </div>
                  </Link>
                </div>

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
                </motion.div>
              </div>
            </section>
          } />

          <Route path="/quiz" element={
            <div className="pt-10">
              <QuizGame />
            </div>
          } />

          <Route path="/repertoire" element={
            <div className="pt-10">
              <Repertoire />
            </div>
          } />

          <Route path="/mentors" element={
            <div className="pt-20">
              <Mentors />
            </div>
          } />

          <Route path="/signature" element={
            <SignatureTechniques />
          } />

          <Route path="/endorsement" element={
            <section className="py-12 md:py-32 bg-dark-lighter relative min-h-[calc(100vh-80px)]">
              <div className="max-w-4xl mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center mb-16">
                    <Star className="w-8 h-8 text-gold mx-auto mb-6 opacity-80" />
                    <h2 className="text-3xl md:text-4xl font-serif mb-4">{(t as any).endorsement?.title}</h2>
                    <p className="text-gray-400 font-light">{(t as any).endorsement?.page_desc}</p>
                  </div>

                  {/* Paul Krugman Card */}
                  <div className="relative p-8 md:p-10 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 via-dark-lighter to-dark-lighter backdrop-blur-sm overflow-hidden group hover:border-gold/40 transition-all duration-500 mb-8">
                    <div className="absolute top-4 right-6 text-gold/10 text-8xl font-serif select-none leading-none">"</div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-[80px] -ml-12 -mb-12"></div>

                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/30 rounded-full mb-6">
                        <Music className="w-3.5 h-3.5 text-gold" />
                        <span className="text-xs font-mono text-gold-light tracking-[0.2em] uppercase">{(t as any).endorsement?.subtitle}</span>
                      </div>

                      <div className="mb-5">
                        <h3 className="text-2xl md:text-3xl font-serif text-white mb-1">{(t as any).endorsement?.krugman_name}</h3>
                        <p className="text-sm text-gold/80 tracking-widest uppercase">{(t as any).endorsement?.krugman_title}</p>
                      </div>

                      <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light mb-8 text-left">
                        {(t as any).endorsement?.krugman_desc}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href="https://paulkrugman.substack.com/p/a-whiff-of-stagflation"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-gold hover:border-gold/50 transition-all duration-300 group/link"
                        >
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                          <span>{(t as any).endorsement?.article1_date} {(t as any).endorsement?.read_article} #1</span>
                        </a>
                        <a
                          href="https://paulkrugman.substack.com/p/trump-is-losing-a-second-war"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-gold hover:border-gold/50 transition-all duration-300 group/link"
                        >
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                          <span>{(t as any).endorsement?.article2_date} {(t as any).endorsement?.read_article} #2</span>
                        </a>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </div>
            </section>
          } />

          <Route path="/changelog" element={
            <section className="py-12 md:py-32 bg-dark relative min-h-[calc(100vh-80px)]">
              <div className="max-w-3xl mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center mb-20">
                    <span className="text-xs font-mono text-gold tracking-[0.3em] uppercase mb-4 block">{(t as any).changelog?.subtitle}</span>
                    <h2 className="text-3xl md:text-5xl font-serif mb-6">{(t as any).changelog?.title}</h2>
                    <p className="text-gray-400 font-light max-w-lg mx-auto">{(t as any).changelog?.description}</p>
                  </div>

                  <div className="relative space-y-12">
                    {/* Vertical Line */}
                    <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-gold/50 via-gold/10 to-transparent ml-4 md:ml-0 md:left-0"></div>

                    {((t as any).changelog?.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="relative pl-12 md:pl-16 group">
                        {/* Dot */}
                        <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] group-hover:scale-150 transition-transform duration-300 ml-4 md:ml-0 md:left-[-4px]"></div>

                        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-2">
                          <span className="text-xs font-mono text-gold/60 tracking-widest">{item.date}</span>
                          <h3 className="text-xl font-serif text-white group-hover:text-gold transition-colors">{item.title}</h3>
                        </div>
                        <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                          {item.content}
                        </p>
                      </div>
                    ))}
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
                  className="text-center mb-16"
                >
                  <h2 className="text-3xl md:text-4xl font-serif mb-6">{t.timeline.title}</h2>
                  <p className="text-gray-400 font-light max-w-xl mx-auto mb-8">{t.timeline.description}</p>

                  {/* Filter Buttons */}
                  <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-10">
                    <button
                      onClick={() => setTimelineFilter('album')}
                      className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wider transition-all duration-300 flex items-center gap-2 ${timelineFilter === 'album'
                          ? 'bg-gold text-dark shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                          : 'bg-dark-lighter border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                        }`}
                    >
                      <Music className="w-4 h-4" />
                      NEW ALBUM 2026
                    </button>
                    <button
                      onClick={() => setTimelineFilter('all')}
                      className={`px-6 py-2 rounded-full border transition-colors ${timelineFilter === 'all'
                          ? 'bg-gold/20 border-gold text-gold-light'
                          : 'border-white/20 text-gray-400 hover:border-white/50 hover:text-gray-200'
                        }`}
                    >
                      {(t.timeline as any).filterAll || '全部里程碑'}
                    </button>
                    <button
                      onClick={() => setTimelineFilter('first')}
                      className={`px-6 py-2 rounded-full border transition-colors ${timelineFilter === 'first'
                          ? 'bg-gold/20 border-gold text-gold-light'
                          : 'border-white/20 text-gray-400 hover:border-white/50 hover:text-gray-200'
                        }`}
                    >
                      {(t.timeline as any).filterFirst || '解鎖第一次'}
                    </button>
                  </div>
                </motion.div>

                {/* Timeline Container */}
                <div className="relative max-w-3xl mx-auto">
                  {/* The vertical connector line */}
                  <div className="absolute left-[15px] md:left-1/2 md:-ml-[1px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

                  <div className="space-y-16 md:space-y-24">
                    {filteredTimelineItems.map((item, index) => {
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
                          <div className={`pl-12 md:pl-0 w-full md:w-1/2 ${isEven ? 'md:pr-16 text-left' : 'md:pl-16 text-left'} relative z-20`}>
                            <div className="bg-dark-lighter/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl group-hover:border-gold/30 transition-colors duration-500 hover:shadow-2xl hover:shadow-gold/5">
                              <span className="inline-block px-3 py-1 bg-gold/10 text-gold-light rounded-full text-sm font-mono tracking-widest mb-4">
                                {item.year}
                              </span>
                              <h3 className="text-xl md:text-2xl font-serif text-white mb-3 group-hover:text-gold transition-colors">{item.title}</h3>
                              <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base selection:bg-gold/30">
                                <span onClick={handleTimelineClick} dangerouslySetInnerHTML={{ __html: item.desc as string }} className="cursor-pointer" />
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
                  <div className="flex overflow-x-auto gap-2 md:gap-4 pb-4 mb-8 custom-scrollbar hide-scrollbar-on-mobile w-full justify-start sticky top-20 z-30 bg-dark/95 backdrop-blur-md pt-4 border-b border-white/5">
                    {[
                      { id: 'p1', label: t.videos.p1 },
                      { id: 'p6', label: t.videos.p6 },
                      { id: 'p7', label: t.videos.p7 },
                      { id: 'p2', label: t.videos.p2 },
                      { id: 'p3', label: t.videos.p3 },
                      { id: 'p5', label: t.videos.p5 },
                      { id: 'p8', label: (t.videos as any).p8 }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveVideoTab(tab.id)}
                        className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300 ${activeVideoTab === tab.id
                            ? 'bg-gold text-dark shadow-lg shadow-gold/20 scale-105'
                            : 'bg-dark-lighter border border-white/10 text-gray-300 hover:text-gold hover:border-gold/50'
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {activeVideoTab === 'p1' && (
                    <div className="flex overflow-x-auto gap-2 md:gap-4 pb-4 mb-8 custom-scrollbar hide-scrollbar-on-mobile w-full justify-start">
                      {[
                        { id: 'all', label: (t.videos as any).filterAllYears },
                        { id: '2026', label: '2026' },
                        { id: '2025', label: '2025' },
                        { id: '2024', label: '2024' },
                        { id: '2023', label: '2023' },
                        { id: '2022', label: '2022' },
                        { id: '2021', label: '2021' },
                        { id: 'before2020', label: (t.videos as any).before2020 }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveYearTab(tab.id)}
                          className={`px-4 py-2 rounded-full whitespace-nowrap text-xs md:text-sm font-medium transition-all duration-300 ${activeYearTab === tab.id
                              ? 'bg-white/20 text-white shadow-lg'
                              : 'bg-dark-lighter border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                            }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {activeVideoTab === 'p8' && (t.videos as any).p8_desc && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-3xl mx-auto mb-10 text-gray-300 font-light leading-relaxed bg-dark-lighter/50 p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl text-left"
                    >
                      {(t.videos as any).p8_desc}
                    </motion.div>
                  )}

                  <div className="mb-16">
                    {(() => {
                      let filtered = videoList
                        .filter(v => activeVideoTab === 'all' ? v.isFeatured : v.category === activeVideoTab)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                      if (activeVideoTab === 'p1' && activeYearTab !== 'all') {
                        filtered = filtered.filter(v => {
                          const year = v.date ? parseInt(v.date.split('-')[0], 10) : 0;
                          if (activeYearTab === 'before2020') return year <= 2020;
                          return year.toString() === activeYearTab;
                        });
                      }

                      // Only group by year for 'p1' (Live & Music Works)
                      if (activeVideoTab === 'p1') {
                        const yearGroups: { [year: string]: VideoInfo[] } = {};
                        filtered.forEach(v => {
                          const year = v.date ? v.date.split('-')[0] : 'Other';
                          if (!yearGroups[year]) yearGroups[year] = [];
                          yearGroups[year].push(v);
                        });

                        const years = Object.keys(yearGroups).sort((a, b) => b.localeCompare(a));

                        return years.map(year => {
                          const yearVideos = yearGroups[year];
                          const groups: { [key: string]: VideoInfo[] } = {};
                          const singles: VideoInfo[] = [];
                          const order: string[] = [];

                          yearVideos.forEach(video => {
                            if (video.eventGroup) {
                              if (!groups[video.eventGroup]) {
                                groups[video.eventGroup] = [];
                                order.push(video.eventGroup);
                              }
                              groups[video.eventGroup].push(video);
                            } else {
                              singles.push(video);
                              order.push(`single-${video.id}`);
                            }
                          });

                          const uniqueOrder = Array.from(new Set(order));

                          return (
                            <div key={year} className="mb-16 last:mb-0">
                              <div className="flex items-center gap-4 mb-8">
                                <h3 className="text-3xl font-serif text-gold/90">{year}</h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent"></div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {uniqueOrder.map(key => {
                                  if (key.startsWith('single-')) {
                                    const videoId = key.replace('single-', '');
                                    const video = singles.find(v => v.id === videoId);
                                    return video ? <VideoCard key={video.id} video={video} /> : null;
                                  } else {
                                    return <VideoGroupCard key={key} name={key} videos={groups[key]} />;
                                  }
                                })}
                              </div>
                            </div>
                          );
                        });
                      }

                      // Default layout for other categories (Flat grid with event grouping)
                      const groups: { [key: string]: VideoInfo[] } = {};
                      const singles: VideoInfo[] = [];
                      const order: string[] = [];

                      filtered.forEach(video => {
                        if (video.eventGroup) {
                          if (!groups[video.eventGroup]) {
                            groups[video.eventGroup] = [];
                            order.push(video.eventGroup);
                          }
                          groups[video.eventGroup].push(video);
                        } else {
                          singles.push(video);
                          order.push(`single-${video.id}`);
                        }
                      });

                      const uniqueOrder = Array.from(new Set(order));

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {uniqueOrder.map(key => {
                            if (key.startsWith('single-')) {
                              const videoId = key.replace('single-', '');
                              const video = singles.find(v => v.id === videoId);
                              return video ? <VideoCard key={video.id} video={video} /> : null;
                            } else {
                              return <VideoGroupCard key={key} name={key} videos={groups[key]} />;
                            }
                          })}
                        </div>
                      );
                    })()}
                  </div>
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
                  <FirebaseComments lang={lang} t={t.comments} />
                </div>
              </div>
            </section>
          </>} />
        </Routes>
      </div>

      {/* Timeline Video Modal */}
      <AnimatePresence>
        {activeTimelineVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTimelineVideo(null)}
              className="absolute inset-0 bg-dark/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 z-20 p-4">
                <button
                  onClick={() => setActiveTimelineVideo(null)}
                  className="p-2 rounded-full bg-black/60 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative aspect-video w-full bg-black">
                {activeTimelineVideo.type === 'youtube' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeTimelineVideo.videoId}?autoplay=1`}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <iframe
                    src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(activeTimelineVideo.url)}&show_text=false&width=560`}
                    className="absolute inset-0 w-full h-full border-0"
                    scrolling="no"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  ></iframe>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
