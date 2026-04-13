import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BookTeaser() {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-ngt-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-ngt-black to-ngt-gold/10 border border-ngt-gold/20 p-12 md:p-20 relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative flex justify-center"
            >
              {/* Book Mockup */}
              <div className="w-64 h-96 bg-ngt-black border-2 border-ngt-gold shadow-[20px_20px_60px_rgba(0,0,0,0.8)] relative group overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800&h=1000" 
                  alt="Couverture du livre Maman, je suis trader" 
                  className="w-full h-full object-cover transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-ngt-gold/5 group-hover:bg-ngt-gold/10 transition-colors pointer-events-none"></div>
              </div>
              
              {/* Badge */}
              <div className="absolute -top-4 -right-4 md:right-10 w-24 h-24 rounded-full bg-ngt-red flex items-center justify-center text-center p-2 shadow-xl rotate-12 z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{t("book.soon")}</span>
              </div>
            </motion.div>

            <div>
              <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold mb-4 block">{t("book.badge")}</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-8">{t("book.title")}</h2>
              <p className="text-ngt-white/60 mb-8 leading-relaxed">
                {t("book.desc")}
              </p>
              <ul className="space-y-4 mb-10 text-sm text-ngt-white/70">
                <li className="flex items-center gap-3 italic">{t("book.feature1")}</li>
                <li className="flex items-center gap-3 italic">{t("book.feature2")}</li>
                <li className="flex items-center gap-3 italic">{t("book.feature3")}</li>
              </ul>
              <button className="px-10 py-4 border border-ngt-gold text-ngt-gold text-[10px] uppercase tracking-widest font-bold hover:bg-ngt-gold hover:text-ngt-black transition-all">
                {t("book.cta")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
