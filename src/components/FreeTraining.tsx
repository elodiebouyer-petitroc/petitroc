import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, X, Mail, User, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FreeTraining() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <section id="free-training" className="py-24 bg-ngt-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-ngt-gold/[0.03] border border-ngt-gold/20 p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ngt-gold/5 blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold mb-4 block">{t("free.badge")}</span>
              <h2 className="text-3xl md:text-5xl font-serif mb-6">{t("free.title")}</h2>
              <p className="text-ngt-white/60 mb-8 leading-relaxed">
                {t("free.desc")}
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm text-ngt-white/80">
                  <div className="w-1.5 h-1.5 bg-ngt-gold rounded-full"></div>
                  {t("free.feature1")}
                </li>
                <li className="flex items-center gap-3 text-sm text-ngt-white/80">
                  <div className="w-1.5 h-1.5 bg-ngt-gold rounded-full"></div>
                  {t("free.feature2")}
                </li>
                <li className="flex items-center gap-3 text-sm text-ngt-white/80">
                  <div className="w-1.5 h-1.5 bg-ngt-gold rounded-full"></div>
                  {t("free.feature3")}
                </li>
              </ul>
              
              <button 
                onClick={() => setIsSubmitted(true)}
                className="flex items-center gap-4 px-8 py-4 bg-ngt-gold text-ngt-black text-xs uppercase tracking-widest font-bold gold-gradient hover:scale-105 transition-transform"
              >
                <Play size={16} fill="currentColor" />
                {t("free.cta")}
              </button>
            </div>

            <div className="relative aspect-video bg-ngt-black border border-ngt-gold/30 flex items-center justify-center group overflow-hidden">
              {!isSubmitted ? (
                <div 
                  className="w-full h-full cursor-pointer relative"
                  onClick={() => setIsSubmitted(true)}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200&h=800" 
                    alt="Formation Gratuite" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border border-ngt-gold flex items-center justify-center bg-ngt-black/50 backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <Play size={32} className="text-ngt-gold ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              ) : (
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/kyylb1Yo2aM?autoplay=1"
                  title="Formation Gratuite NGT"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
