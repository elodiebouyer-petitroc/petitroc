import { motion } from "motion/react";
import { Calendar, Users, MapPin, Video, Clock, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Services() {
  const { t } = useTranslation();
  const conferences = [
    {
      title: t("services.events.conf1.title"),
      type: t("services.events.conf1.type"),
      date: t("services.events.conf1.date"),
      icon: <Video size={20} />
    },
    {
      title: t("services.events.conf2.title"),
      type: t("services.events.conf2.type"),
      date: t("services.events.conf2.date"),
      icon: <MapPin size={20} />
    }
  ];

  return (
    <section id="services" className="py-24 md:py-32 bg-ngt-black border-t border-ngt-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20">
          {/* Coaching Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold mb-4 block">{t("services.coaching.badge")}</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8">{t("services.coaching.title")}</h2>
            <p className="text-ngt-white/60 mb-10 leading-relaxed max-w-lg">
              {t("services.coaching.desc")}
            </p>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-center justify-between p-6 border border-ngt-white/10 bg-ngt-white/[0.02] group hover:border-ngt-gold/30 transition-colors">
                <div className="flex items-center gap-4">
                  <Clock className="text-ngt-gold" size={24} />
                  <div>
                    <h4 className="text-sm font-semibold">{t("services.coaching.h1")}</h4>
                    <p className="text-xs text-ngt-white/40">{t("services.coaching.d1")}</p>
                  </div>
                </div>
                <span className="text-xl font-serif text-ngt-gold">{t("services.coaching.p1")}</span>
              </div>
              <div className="flex items-center justify-between p-6 border border-ngt-white/10 bg-ngt-white/[0.02] group hover:border-ngt-gold/30 transition-colors">
                <div className="flex items-center gap-4">
                  <Users className="text-ngt-gold" size={24} />
                  <div>
                    <h4 className="text-sm font-semibold">{t("services.coaching.h2")}</h4>
                    <p className="text-xs text-ngt-white/40">{t("services.coaching.d2")}</p>
                  </div>
                </div>
                <span className="text-xl font-serif text-ngt-gold">{t("services.coaching.p2")}</span>
              </div>
            </div>

            <button className="flex items-center gap-3 px-10 py-4 bg-ngt-white text-ngt-black text-xs uppercase tracking-widest font-bold hover:bg-ngt-gold transition-colors">
              {t("services.coaching.cta")} <Calendar size={16} />
            </button>
          </motion.div>

          {/* Conferences Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold mb-4 block">{t("services.events.badge")}</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8">{t("services.events.title")}</h2>
            
            {/* Conference Photo */}
            <div className="mb-10 aspect-video overflow-hidden border border-ngt-gold/20 relative group">
              <img 
                src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800&h=500" 
                alt="NGT Immersion Conférence" 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-ngt-black/40 group-hover:bg-ngt-black/20 transition-all"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-6 py-2 bg-ngt-gold text-ngt-black text-[10px] uppercase tracking-widest font-bold">{t("services.events.immersion")}</span>
              </div>
            </div>

            <p className="text-ngt-white/60 mb-10 leading-relaxed max-w-lg">
              {t("services.events.desc")}
            </p>

            <div className="grid gap-4">
              {conferences.map((conf) => (
                <div key={conf.title} className="p-8 border border-ngt-gold/20 bg-ngt-gold/[0.02] flex items-center justify-between group hover:bg-ngt-gold/[0.05] transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full border border-ngt-gold/30 flex items-center justify-center text-ngt-gold">
                      {conf.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-serif">{conf.title}</h4>
                      <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-ngt-white/40 mt-1">
                        <span>{conf.type}</span>
                        <span className="w-1 h-1 bg-ngt-gold rounded-full"></span>
                        <span className="text-ngt-gold">{conf.date}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="text-ngt-gold opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" size={20} />
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-8 border border-ngt-red/20 bg-ngt-red/[0.02]">
              <p className="text-xs text-ngt-white/60 italic">
                {t("services.events.quote")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
