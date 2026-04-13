import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export default function SniperIntro() {
  const { t } = useTranslation();
  return (
    <section id="sniper" className="py-24 md:py-32 bg-ngt-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full md:w-[40%] relative"
          >
            <div className="aspect-[4/5] bg-ngt-white/5 border border-ngt-gold/20 relative overflow-hidden">
              {/* Le Sniper Image */}
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&h=1000" 
                alt="Le Sniper - Ouattara Abou" 
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ngt-black via-transparent to-transparent"></div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-ngt-gold/40"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-ngt-gold/40"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-[60%]"
          >
            <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold mb-4 block">{t("sniper.badge")}</span>
            <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
              {t("sniper.title")} <br />
              <span className="text-2xl md:text-3xl text-ngt-white/60 italic">Ouattara Abou</span>
            </h2>
            <div className="space-y-6 text-ngt-white/60 text-lg font-light leading-relaxed">
              <p>
                {t("sniper.desc1")}
              </p>
              <p>
                {t("sniper.desc2")}
              </p>
              <p className="text-ngt-gold italic font-medium">
                {t("sniper.quote")}
              </p>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-8 items-center">
              <div className="flex gap-8">
                <div>
                  <span className="text-2xl font-serif text-ngt-white block">10+</span>
                  <span className="text-[10px] uppercase tracking-widest text-ngt-white/40">{t("sniper.exp")}</span>
                </div>
                <div className="w-[1px] h-10 bg-ngt-white/10"></div>
                <div>
                  <span className="text-2xl font-serif text-ngt-white block">1000+</span>
                  <span className="text-[10px] uppercase tracking-widest text-ngt-white/40">{t("sniper.students")}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.getElementById('products');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 border border-ngt-gold text-ngt-gold text-[10px] uppercase tracking-widest hover:bg-ngt-gold hover:text-ngt-black transition-all duration-500"
              >
                {t("hero.cta")}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
