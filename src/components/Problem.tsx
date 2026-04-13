import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export default function Problem() {
  const { t } = useTranslation();
  return (
    <section className="py-24 md:py-32 bg-ngt-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
              {t("problem.title")} <br />
              <span className="text-ngt-red italic">{t("problem.subtitle")}</span>
            </h2>
            <div className="space-y-6 text-ngt-white/60 text-lg font-light leading-relaxed">
              <p>
                {t("problem.desc1")}
              </p>
              <p className="text-ngt-white font-medium">
                {t("problem.desc2")}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square md:aspect-video bg-ngt-white/5 border border-ngt-white/10 flex items-center justify-center group overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974714024-46202e00813a?auto=format&fit=crop&q=80&w=1200&h=800')] bg-cover bg-center opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>
            <div className="relative z-10 text-center p-8">
              <span className="text-6xl md:text-8xl font-serif text-ngt-red/40 mb-4 block">90%</span>
              <p className="text-xs uppercase tracking-[0.3em] text-ngt-white/40">{t("problem.stat")}</p>
            </div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-ngt-red/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-ngt-red/50 to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
