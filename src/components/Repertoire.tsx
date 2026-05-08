import React from 'react';
import { motion } from 'motion/react';
import { Music, Disc3, ExternalLink } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const Repertoire: React.FC = () => {
  const { t } = useTranslation();
  const repertoireData = (t as any).repertoire;

  if (!repertoireData || !repertoireData.songs) {
    return null;
  }

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
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 bg-gold/10 rounded-full mb-6 relative">
            <Disc3 className="w-10 h-10 text-gold animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-md -z-10"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white tracking-wider">{repertoireData.title}</h2>
          <p className="text-gray-400 font-light max-w-2xl mx-auto leading-relaxed text-lg">
            {repertoireData.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {repertoireData.songs.map((song: any, index: number) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-dark-lighter/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:border-gold/40 transition-all duration-500 group relative overflow-hidden flex flex-col h-full"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-2xl"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="text-2xl font-serif text-white group-hover:text-gold transition-colors duration-300 mb-2">
                    {song.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-mono text-gray-400 tracking-widest uppercase">
                    <span className="text-gold-light bg-gold/10 px-2 py-1 rounded">{song.year}</span>
                    <span>{song.composer}</span>
                  </div>
                </div>
                <Music className="w-6 h-6 text-gold/30 group-hover:text-gold/80 transition-colors" />
              </div>

              <p className="text-gray-300 font-light leading-relaxed mb-8 flex-grow">
                {song.background}
              </p>

              <div className="mt-auto relative z-10">
                <a
                  href={song.lyricsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-gold/10 border border-white/10 hover:border-gold/30 rounded-xl text-sm text-gray-300 hover:text-gold transition-all duration-300 group/btn"
                >
                  <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  <span>View Lyrics</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Repertoire;
