import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ArrowRight, Zap, Star, MessageCircle } from "lucide-react";
import { trackEvent } from "../../lib/analytics";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { STRIPE_PRODUCTS } from "../../lib/stripe";

export default function ThankYouPage() {
  const { t } = useTranslation();
  const [showUpsell, setShowUpsell] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Only show upsell if they just bought Plan Caméléon
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');
    const source = params.get('source');
    
    if (productId === 'cameleon') {
      setShowUpsell(true);
      trackEvent('view_thank_you_with_upsell');
    } else if (source === 'thalamus') {
      trackEvent('view_thank_you_thalamus');
    } else {
      trackEvent('view_thank_you_standard');
    }

    // 24h Urgency Timer with localStorage
    const timerKey = 'ngt_upsell_timer_end';
    let endTime = localStorage.getItem(timerKey);
    
    if (!endTime) {
      endTime = (Date.now() + 24 * 3600 * 1000).toString();
      localStorage.setItem(timerKey, endTime);
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((parseInt(endTime!) - now) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleUpsell = (productId: string) => {
    trackEvent('upsell_accept', { productId });
    window.location.href = `/checkout?productId=${productId}`;
  };

  const handleDecline = () => {
    trackEvent('upsell_decline');
    window.location.href = "/espace-membre";
  };

  return (
    <div className="min-h-screen bg-ngt-black text-ngt-white">
      <Navbar />
      
      <main className="pt-40 pb-24 px-6 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-16"
        >
          <div className="w-24 h-24 bg-ngt-gold/10 rounded-full flex items-center justify-center text-ngt-gold mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl md:text-7xl font-serif mb-6 italic gold-text leading-tight">
            Félicitations !
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
            {new URLSearchParams(window.location.search).get('source') === 'thalamus' 
              ? "Ton accès à Thalamus IA est validé. Tu peux maintenant te connecter à ton dashboard."
              : "Ton accès au Plan Caméléon est validé. Un email de confirmation vient de t'être envoyé."}
          </p>
          {!showUpsell && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => {
                  const source = new URLSearchParams(window.location.search).get('source');
                  window.location.href = source === 'thalamus' ? "https://thalamus-station.vercel.app/" : "/espace-membre";
                }}
                className="px-12 py-5 bg-ngt-gold text-ngt-black font-bold uppercase tracking-[0.2em] rounded-xl gold-gradient flex items-center justify-center gap-2 hover:scale-[1.05] transition-all"
              >
                {new URLSearchParams(window.location.search).get('source') === 'thalamus' ? "Accéder à Thalamus" : "Accéder à ma formation"} <ArrowRight size={18} />
              </button>
              <button
                onClick={() => window.open("https://wa.me/33782991055", "_blank")}
                className="px-12 py-5 border border-ngt-gold/30 text-ngt-gold font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:bg-ngt-gold/5 transition-all"
              >
                Rejoindre le Groupe WhatsApp <MessageCircle size={18} />
              </button>
            </div>
          )}
        </motion.div>

        {/* Upsell Section */}
        {showUpsell && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 bg-ngt-gold/5 border border-ngt-gold/20 rounded-[3rem] relative overflow-hidden mb-24"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Star size={150} className="text-ngt-gold" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ngt-gold/10 border border-ngt-gold/20 rounded-full mb-8">
              <Zap size={14} className="text-ngt-gold animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-ngt-gold font-bold">
                Offre Spéciale Nouveaux Membres • {formatTime(timeLeft)}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif italic gold-text mb-6">Passe à la vitesse supérieure !</h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Tu as maintenant la stratégie. Laisse l'Algorithme Caméléon faire le travail de détection pour toi.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Upsell 1: Lifetime */}
              <div className="p-8 bg-ngt-gold/10 border border-ngt-gold/30 rounded-3xl flex flex-col items-center text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-ngt-gold text-ngt-black text-[8px] font-bold uppercase tracking-widest rounded-full">⭐ Plus Populaire</div>
                <h3 className="text-xl font-serif italic gold-text mb-4">Accès à Vie</h3>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-gray-500 line-through text-sm">1997€</span>
                  <span className="text-3xl font-serif italic text-ngt-gold">1497€</span>
                </div>
                <button
                  onClick={() => handleUpsell('algo_lifetime_upsell')}
                  className="w-full py-4 bg-ngt-gold text-ngt-black font-bold uppercase tracking-widest rounded-xl gold-gradient hover:scale-105 transition-all"
                >
                  Ajouter à ma commande
                </button>
              </div>

              {/* Upsell 2: 1 Month Trial */}
              <div className="p-8 bg-ngt-dark-gray border border-white/5 rounded-3xl flex flex-col items-center text-center">
                <h3 className="text-xl font-serif italic gold-text mb-4">1 Mois d'essai</h3>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-gray-500 line-through text-sm">149€</span>
                  <span className="text-3xl font-serif italic text-ngt-gold">99€</span>
                </div>
                <button
                  onClick={() => handleUpsell('algo_monthly_upsell')}
                  className="w-full py-4 bg-white/5 text-ngt-white border border-white/10 font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                >
                  Tester 1 mois
                </button>
              </div>
            </div>

            <button 
              onClick={handleDecline}
              className="text-gray-600 text-[10px] uppercase tracking-[0.2em] hover:text-gray-400 transition-colors"
            >
              Non merci, je préfère commencer avec la formation seule
            </button>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
