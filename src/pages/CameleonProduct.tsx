import { motion } from "motion/react";
import { Target, CheckCircle2, ShoppingCart, ArrowLeft, ShieldCheck, Zap, Play, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { auth } from "../firebase";

export default function CameleonProduct() {
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "cameleon",
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
                <Target size={32} />
              </div>
              <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold font-bold">Formation Stratégique</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif mb-8 italic gold-text leading-tight">
              Plan Caméléon
            </h1>
            
            <p className="text-xl text-ngt-white/60 mb-12 leading-relaxed font-light">
              La méthode Sniper sans indicateur. Apprenez à lire le prix comme une institution et adaptez-vous à n'importe quel marché, n'importe quand.
            </p>

            <div className="space-y-6 mb-12">
              {[
                "16 vidéos ultra-détaillées (cursus complet)",
                "Accès au groupe WhatsApp privé des Snipers",
                "Sessions Zoom hebdomadaires avec le Sniper",
                "Missions exclusives et cas pratiques",
                "Attribution d'un numéro de matricule Sniper unique"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <CheckCircle2 size={20} className="text-ngt-gold shrink-0" />
                  <span className="text-ngt-white/80 tracking-wide">{feature}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="p-6 bg-ngt-gold/5 border border-ngt-gold/20 rounded-3xl">
                <Users size={24} className="text-ngt-gold mb-3" />
                <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Communauté</h4>
                <p className="text-[11px] text-ngt-white/40">Entraide entre Snipers 24/7</p>
              </div>
              <div className="p-6 bg-ngt-gold/5 border border-ngt-gold/20 rounded-3xl">
                <Star size={24} className="text-ngt-gold mb-3" />
                <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Expertise</h4>
                <p className="text-[11px] text-ngt-white/40">10+ ans d'expérience</p>
              </div>
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
                <div className="inline-block px-4 py-1 bg-ngt-gold text-ngt-black text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                  Offre Limitée
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-serif italic text-ngt-gold">500€</span>
                  <span className="text-ngt-white/30 line-through text-xl">897€</span>
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
                  <>Profiter de l'offre <ShoppingCart size={20} /></>
                )}
              </button>

              <p className="mt-6 text-center text-[10px] text-ngt-white/30 uppercase tracking-widest">
                Paiement en plusieurs fois disponible via Klarna
              </p>
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
