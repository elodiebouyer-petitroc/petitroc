import { motion } from "motion/react";
import { Brain, CheckCircle2, ShoppingCart, ArrowLeft, ShieldCheck, Zap, Play, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { auth } from "../firebase";

export default function PsychologyProduct() {
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "psychology",
          userId: auth.currentUser.uid,
          email: auth.currentUser.email,
        }),
      });

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ngt-black text-ngt-white">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-ngt-white/40 hover:text-ngt-gold mb-12 transition-colors text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Retour
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-ngt-gold/10 border border-ngt-gold/20 rounded-2xl text-ngt-gold">
                <Brain size={32} />
              </div>
              <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold font-bold">Formation Vidéo</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif mb-8 italic gold-text leading-tight">
              Psychologie du Trading
            </h1>
            
            <p className="text-xl text-ngt-white/60 mb-12 leading-relaxed font-light">
              Le trading est 90% de psychologie. Cette formation est conçue pour reprogrammer votre esprit et détacher votre ego des résultats du marché.
            </p>

            <div className="space-y-6 mb-12">
              {[
                "Maîtrise totale des émotions (peur & cupidité)",
                "Détachement de l'ego face aux pertes",
                "Gestion du stress en temps réel",
                "Discipline de fer et rigueur institutionnelle",
                "Les fondations de la rentabilité durable"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <CheckCircle2 size={20} className="text-ngt-gold shrink-0" />
                  <span className="text-ngt-white/80 tracking-wide">{feature}</span>
                </div>
              ))}
            </div>

            <div className="p-8 bg-ngt-gold/5 border border-ngt-gold/20 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                <Play size={20} className="text-ngt-gold" />
                <h3 className="text-lg font-serif italic gold-text">13 Modules Vidéo Inclus</h3>
              </div>
              <p className="text-sm text-ngt-white/50 leading-relaxed">
                Accès immédiat à vie à l'intégralité du cursus psychologique Sniper.
              </p>
            </div>
          </motion.div>

          {/* Right: Checkout Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-32"
          >
            <div className="p-10 bg-ngt-dark-gray border border-ngt-gold/30 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-ngt-gold/5 blur-3xl -mr-16 -mt-16"></div>
              
              <div className="mb-10">
                <span className="text-[10px] uppercase tracking-widest text-ngt-white/40 block mb-2">Prix de lancement</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-serif italic text-ngt-gold">70€</span>
                  <span className="text-ngt-white/30 line-through text-xl">149€</span>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-3 p-4 bg-ngt-black/40 rounded-2xl border border-white/5">
                  <ShieldCheck className="text-ngt-gold" size={24} />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-ngt-white/60 font-bold">Paiement Sécurisé</p>
                    <p className="text-[11px] text-ngt-white/40">SSL 256-bit & Stripe</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-ngt-black/40 rounded-2xl border border-white/5">
                  <Zap className="text-ngt-gold" size={24} />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-ngt-white/60 font-bold">Accès Instantané</p>
                    <p className="text-[11px] text-ngt-white/40">Dès la validation du paiement</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBuy}
                disabled={loading}
                className="w-full py-6 bg-ngt-gold text-ngt-black font-bold uppercase tracking-[0.3em] rounded-2xl gold-gradient flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-ngt-gold/20"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-ngt-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Acheter la formation <ShoppingCart size={20} /></>
                )}
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 opacity-40 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Klarna_Logo.svg" alt="Klarna" className="h-6" />
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
