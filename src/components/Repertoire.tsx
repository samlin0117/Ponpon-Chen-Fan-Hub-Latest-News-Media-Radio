import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Disc3, ExternalLink, Search, X, BookOpen, Calendar, Type } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { repertoireData, RepertoireSong } from '../data/repertoire';

const Repertoire: React.FC = () => {
  const { t } = useTranslation();
  const repoTranslations = (t as any).repertoire || {};
  const localizedSongs = repoTranslations.songs || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'alpha' | 'year'>('alpha');
  const [selectedSong, setSelectedSong] = useState<RepertoireSong | null>(null);

  // Compute available alphabets and decades based on data
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    repertoireData.forEach(song => {
      const title = localizedSongs[song.id]?.title || song.id;
      if (title) letters.add(title.charAt(0).toUpperCase());
    });
    return Array.from(letters).sort();
  }, [localizedSongs]);

  const availableDecades = useMemo(() => {
    const decades = new Set<string>();
    repertoireData.forEach(song => {
      if (song.year) {
        decades.add(song.year.substring(0, 3) + '0s');
      }
    });
    return Array.from(decades).sort();
  }, []);

  const filteredSongs = useMemo(() => {
    let result = [...repertoireData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(song => {
        const title = localizedSongs[song.id]?.title || '';
        return title.toLowerCase().includes(query) ||
          song.year.includes(query) ||
          song.composer.toLowerCase().includes(query);
      });
    } else if (activeFilter) {
      if (filterType === 'alpha') {
        result = result.filter(song => {
          const title = localizedSongs[song.id]?.title || '';
          return title.charAt(0).toUpperCase() === activeFilter;
        });
      } else if (filterType === 'year') {
        result = result.filter(song => {
          const decade = song.year.substring(0, 3) + '0s';
          return decade === activeFilter;
        });
      }
    }

    return result;
  }, [searchQuery, activeFilter, filterType, localizedSongs]);

  // Lock body scroll when modal is open and handle scrollbar jitter
  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (selectedSong) {
      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      if (navbar) navbar.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
      if (navbar) navbar.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
      if (navbar) navbar.style.paddingRight = '0px';
    };
  }, [selectedSong]);

  return (
    <section className="py-12 md:py-32 bg-dark relative min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 bg-gold/10 rounded-full mb-6 relative">
            <Disc3 className="w-10 h-10 text-gold animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-md -z-10"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white tracking-wider">
            {repoTranslations.title || 'Jazz Repertoire'}
          </h2>
          <p className="text-gray-400 font-light max-w-2xl mx-auto leading-relaxed text-lg mb-10">
            {repoTranslations.description}
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-500 group-focus-within:text-gold transition-colors" />
            </div>
            <input
              type="text"
              className="w-full bg-dark-lighter/60 backdrop-blur-md border border-white/10 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all shadow-lg"
              placeholder={repoTranslations.searchPlaceholder || "Search by title, year, or composer..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveFilter(null);
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Quick Navigation / Filters */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10 flex flex-col items-center"
          >
            <div className="flex bg-dark-lighter/50 rounded-full p-1 border border-white/5 mb-4">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'alpha' ? 'bg-gold/20 text-gold-light' : 'text-gray-400 hover:text-white'}`}
                onClick={() => { setFilterType('alpha'); setActiveFilter(null); }}
              >
                <Type className="w-4 h-4" /> A-Z
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'year' ? 'bg-gold/20 text-gold-light' : 'text-gray-400 hover:text-white'}`}
                onClick={() => { setFilterType('year'); setActiveFilter(null); }}
              >
                <Calendar className="w-4 h-4" /> Year
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveFilter(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${!activeFilter ? 'bg-gold text-dark font-bold' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {repoTranslations.filterAll || 'ALL'}
              </button>
              {(filterType === 'alpha' ? availableLetters : availableDecades).map(item => (
                <button
                  key={item}
                  onClick={() => setActiveFilter(item)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${activeFilter === item ? 'bg-gold/80 text-dark font-bold' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Info */}
        <div className="text-gray-400 text-sm mb-6 px-2 flex justify-between items-center border-b border-white/5 pb-2">
          <span>{filteredSongs.length} {repoTranslations.songsFound || 'songs found'}</span>
        </div>

        {/* Song Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSongs.map((song: RepertoireSong, index: number) => {
              const loc = localizedSongs[song.id] || {};
              return (
                <motion.div
                  layout
                  key={song.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-dark-lighter/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-gold/30 hover:bg-dark-lighter/60 transition-all duration-300 group flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-serif text-white group-hover:text-gold-light transition-colors line-clamp-2">
                      {loc.title || song.id}
                    </h3>
                    <Music className="w-5 h-5 text-gold/20 group-hover:text-gold/50 flex-shrink-0 ml-3" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-gray-400 uppercase mb-6">
                    <span className="bg-white/5 px-2 py-1 rounded">{song.year}</span>
                    <span className="truncate" title={song.composer}>{song.composer}</span>
                  </div>

                  <div className="mt-auto pt-4 flex gap-3">
                    <button
                      onClick={() => setSelectedSong(song)}
                      className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-gold/10 hover:bg-gold/20 text-gold-light rounded-xl text-sm font-medium transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      {repoTranslations.detailsBtn || 'Details'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredSongs.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
              <Disc3 className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>{repoTranslations.noSongsFound || 'No songs found matching your criteria.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Progressive Disclosure */}
      <AnimatePresence>
        {selectedSong && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSong(null)}
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-start bg-dark-lighter/50">
                <div>
                  <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">
                    {localizedSongs[selectedSong.id]?.title || selectedSong.id}
                  </h3>
                  <div className="flex items-center gap-3 text-sm font-mono text-gray-400">
                    <span className="text-gold-light bg-gold/10 px-2 py-1 rounded">{selectedSong.year}</span>
                    <span>{selectedSong.composer}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSong(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div
                  className="prose prose-invert prose-gold max-w-none text-gray-300 font-light leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: localizedSongs[selectedSong.id]?.background || '' }}
                />
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-dark-lighter/50 border-t border-white/5 flex flex-wrap gap-4 justify-end">
                {selectedSong.lyricsLink && (
                  <a
                    href={selectedSong.lyricsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{repoTranslations.viewLyrics || 'View Lyrics'}</span>
                  </a>
                )}
                {(selectedSong.youtubeId || selectedSong.videoLink) && (
                  <a
                    href={selectedSong.videoLink || `https://youtube.com/watch?v=${selectedSong.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold/20 hover:bg-gold/30 border border-gold/30 rounded-xl text-sm text-gold-light hover:text-white transition-all"
                  >
                    <Disc3 className="w-4 h-4" />
                    <span>{repoTranslations.watchPerformance || 'Watch Performance'}</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Repertoire;
