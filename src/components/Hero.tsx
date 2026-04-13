import { motion } from "motion/react";
import { Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToMethod = () => {
    const element = document.getElementById('free-training');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-start justify-center overflow-hidden pt-28 md:pt-36 pb-20">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ngt-gold/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="block text-base md:text-xl uppercase tracking-[0.6em] gold-text font-bold mb-2">
            NEW GENERATION TRADERS
          </span>
          <span className="inline-block text-[10px] md:text-xs uppercase tracking-[0.5em] text-ngt-white/40 mb-8 font-sans font-semibold">
            École de transformation mentale
          </span>

          <div className="flex justify-center mt-6 mb-16">
            <a 
              href="https://www.youtube.com/@newgenerationtraders7354" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 border border-red-500/20 bg-red-500/5 rounded-full hover:bg-red-500/10 transition-colors group"
            >
              <Youtube size={14} className="text-red-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold">{t('hero.youtube')}</span>
            </a>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif mb-8 leading-[1.1] tracking-tight">
            <span className="block mb-2">{t('hero.title.1')}</span>
            <span className="block text-5xl md:text-7xl italic gold-text">{t('hero.title.2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-ngt-white/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToProducts}
              className="px-10 py-4 bg-ngt-gold text-ngt-black text-xs uppercase tracking-[0.2em] font-bold gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              {t('hero.cta')}
            </motion.button>
            <button 
              onClick={scrollToMethod}
              className="px-10 py-4 border border-ngt-white/20 text-xs uppercase tracking-[0.2em] hover:bg-ngt-white/5 transition-colors"
            >
              {t('hero.method')}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-widest text-ngt-white/30">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-ngt-gold to-transparent"></div>
      </motion.div>
    </section>
  );
}
