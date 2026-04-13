import React from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Play, Star, Users, Zap, Lock } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EmailCapture from "../../components/EmailCapture";
import { Helmet } from "react-helmet-async";

export default function LandingPage() {
  const { t } = useTranslation();

  const handleSuccess = () => {
    window.location.href = "/plan-cameleon";
  };

  return (
    <div className="min-h-screen bg-ngt-black text-ngt-white">
      <Helmet>
        <title>Formation Gratuite : Les 5 Erreurs Psychologiques qui tuent vos trades | NGT Academy</title>
        <meta name="description" content="Découvrez pourquoi 90% des traders échouent et comment maîtriser votre psychologie pour enfin devenir rentable." />
      </Helmet>
      <Navbar />
      
      <main className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ngt-gold/10 border border-ngt-gold/20 rounded-full mb-8">
              <Zap size={14} className="text-ngt-gold animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-ngt-gold font-bold">Formation 100% Gratuite</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-serif mb-8 italic gold-text leading-tight">
              Les 5 Erreurs Psychologiques qui tuent vos trades
            </h1>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              Pourquoi 90% des traders échouent alors qu'ils ont la bonne stratégie ? La réponse n'est pas technique, elle est mentale.
            </p>
            
            <div className="space-y-6 mb-12">
              {[
                "Pourquoi votre cerveau est programmé pour perdre",
                "Comment gérer la peur de rater une opportunité (FOMO)",
                "Le secret pour rester discipliné après une perte",
                "Comment transformer votre stress en avantage compétitif",
                "La routine matinale des traders d'élite"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <CheckCircle2 className="text-ngt-gold shrink-0" size={20} />
                  <span className="text-gray-300 text-sm italic">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-ngt-black bg-ngt-dark-gray overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-ngt-white">Rejoignez +15,000 traders</p>
                <p className="text-xs text-gray-500">Ils ont déjà suivi cette formation gratuite.</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Form & Video Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-12 bg-ngt-dark-gray border border-ngt-gold/20 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-ngt-gold"></div>
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-ngt-gold/10 rounded-full flex items-center justify-center text-ngt-gold mx-auto mb-6">
                <Play fill="currentColor" size={32} />
              </div>
              <h2 className="text-2xl font-serif italic gold-text mb-4">Accès Immédiat</h2>
              <p className="text-gray-400 text-sm">Entrez vos informations pour recevoir la vidéo par email.</p>
            </div>

            <EmailCapture onSuccess={handleSuccess} />

            <div className="mt-12 pt-12 border-t border-white/5 flex justify-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <Lock size={14} /> <span className="text-[10px] uppercase tracking-widest">RGPD Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={14} className="text-ngt-gold fill-ngt-gold" /> <span className="text-[10px] uppercase tracking-widest">4.9/5 Avis</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Testimonials Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Marc D.", text: "Cette vidéo a changé ma vision du trading. J'ai enfin compris pourquoi je bloquais." },
              { name: "Sophie L.", text: "Simple, direct et extrêmement puissant. Merci Elodie !" },
              { name: "Thomas B.", text: "Le contenu est de meilleure qualité que certaines formations payantes." }
            ].map((t, idx) => (
              <div key={idx} className="p-8 bg-white/[0.01] border border-white/5 rounded-3xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-ngt-gold fill-ngt-gold" />)}
                </div>
                <p className="text-gray-400 italic mb-6">"{t.text}"</p>
                <p className="text-sm font-bold gold-text">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
