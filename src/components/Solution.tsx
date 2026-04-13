import { motion } from "motion/react";
import { Brain, ShieldCheck, Target, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Solution() {
  const { t } = useTranslation();
  const pillars = [
    {
      icon: <Brain className="text-ngt-gold" size={32} />,
      title: t("solution.pillar1.title"),
      desc: t("solution.pillar1.desc")
    },
    {
      icon: <ShieldCheck className="text-ngt-gold" size={32} />,
      title: t("solution.pillar2.title"),
      desc: t("solution.pillar2.desc")
    },
    {
      icon: <Zap className="text-ngt-gold" size={32} />,
      title: t("solution.pillar3.title"),
      desc: t("solution.pillar3.desc")
    },
    {
      icon: <Target className="text-ngt-gold" size={32} />,
      title: t("solution.pillar4.title"),
      desc: t("solution.pillar4.desc")
    }
  ];

  return (
    <section id="training" className="py-24 md:py-32 bg-ngt-black border-y border-ngt-gold/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xs uppercase tracking-[0.4em] text-ngt-gold mb-4 block"
          >
            {t("solution.badge")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif"
          >
            {t("solution.title")}
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 border border-ngt-white/5 bg-ngt-white/[0.02] hover:border-ngt-gold/30 transition-all duration-500 group"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-500">{pillar.icon}</div>
              <h3 className="text-xl font-serif mb-4">{pillar.title}</h3>
              <p className="text-sm text-ngt-white/50 leading-relaxed font-light">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-24 p-12 border border-ngt-gold/20 bg-ngt-gold/[0.03] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-ngt-gold"></div>
          <h3 className="text-2xl md:text-3xl font-serif mb-6 italic">{t("solution.quote.title")}</h3>
          <p className="text-ngt-white/70 max-w-3xl mx-auto leading-relaxed">
            {t("solution.quote.desc")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
