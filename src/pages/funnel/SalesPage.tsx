import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Play, Star, Users, ArrowRight, Lock, Zap, ChevronRight, Loader2 } from "lucide-react";
import { trackEvent } from "../../lib/analytics";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Helmet } from "react-helmet-async";
import { STRIPE_PRODUCTS } from "../../lib/stripe";
import { auth } from "../../firebase";

export default function SalesPage() {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(3600 * 2); // 2 hours countdown for urgency
  const [spotsLeft, setSpotsLeft] = useState(7);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    // Urgency Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Spots Left Logic (localStorage)
    const spotsKey = 'ngt_sales_spots_left';
    let savedSpots = localStorage.getItem(spotsKey);
    if (!savedSpots) {
      savedSpots = "7";
      localStorage.setItem(spotsKey, savedSpots);
    }
    setSpotsLeft(parseInt(savedSpots));

    // Randomly decrease spots (simulated)
    const spotsInterval = setInterval(() => {
      setSpotsLeft(prev => {
        if (prev > 2) {
          const newSpots = prev - 1;
          localStorage.setItem(spotsKey, newSpots.toString());
          return newSpots;
        }
        return prev;
      });
    }, 45000); // every 45 seconds

    trackEvent('view_sales_page');
    return () => {
      clearInterval(timer);
      clearInterval(spotsInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleBuy = async (productId: string) => {
    trackEvent('sales_page_cta_click', { productId });
    
    if (!auth.currentUser) {
      const confirmLogin = window.confirm("Veuillez vous connecter pour procéder au paiement. Voulez-vous vous connecter maintenant ?");
      if (confirmLogin) {
        // We can't easily trigger the login from here without a dedicated login page or modal
        // But we can redirect to a login page if it exists, or just show an alert.
        // For now, let's just redirect to the checkout page which will handle login if needed,
        // OR better, just redirect to Stripe if we have the email.
        window.location.href = `/checkout?productId=${productId}`;
      }
      return;
    }

    setLoadingId(productId);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          userId: auth.currentUser.uid,
          email: auth.currentUser.email,
        }),
      });

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const products = [
    { 
      ...STRIPE_PRODUCTS.CAMELEON, 
      desc: "La formation complète pour maîtriser la stratégie Sniper.",
      popular: false 
    },
    { 
      ...STRIPE_PRODUCTS.ALGO_LIFETIME, 
      desc: "L'algorithme Caméléon avec accès illimité à vie.",
      popular: true 
    },
    { 
      ...STRIPE_PRODUCTS.ALGO_MONTHLY, 
      desc: "L'algorithme Caméléon avec abonnement mensuel sans engagement.",
      popular: false 
    },
    { 
      ...STRIPE_PRODUCTS.ALGO_ANNUAL, 
      desc: "L'algorithme Caméléon avec engagement 1 an (124€/mois).",
      popular: true 
    },
    { 
      ...STRIPE_PRODUCTS.FULL_PACK, 
      desc: "Le pack ultime : Formation + Algorithme à vie.",
      popular: true 
    },
    { 
      ...STRIPE_PRODUCTS.PSYCHOLOGY, 
      desc: "Maîtrisez vos émotions pour enfin devenir rentable.",
      popular: false 
    }
  ];

  return (
    <div className="min-h-screen bg-ngt-black text-ngt-white">
      <Helmet>
        <title>Plan Caméléon : La Stratégie Sniper pour Dominer les Marchés | NGT Academy</title>
        <meta name="description" content="Apprenez le Plan Caméléon, une stratégie de trading purement basée sur le prix, sans indicateurs. Rejoignez l'élite de NGT Academy." />
      </Helmet>
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ngt-gold/10 border border-ngt-gold/20 rounded-full mb-8">
            <Zap size={14} className="text-ngt-gold animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-ngt-gold font-bold">Plus que {spotsLeft} places à ce prix • {formatTime(timeLeft)}</span>
          </div>
          <h1 className="text-4xl md:text-8xl font-serif mb-8 italic gold-text leading-tight">
            Dominez les Marchés avec le Plan Caméléon
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Arrêtez de deviner. Commencez à anticiper. La méthode Sniper utilisée par les professionnels pour une rentabilité constante.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <a href="#pricing" className="px-12 py-6 bg-ngt-gold text-ngt-black font-bold uppercase tracking-[0.2em] rounded-xl gold-gradient flex items-center justify-center gap-2 hover:scale-[1.05] transition-all shadow-2xl shadow-ngt-gold/20">
              Voir les offres <ArrowRight size={18} />
            </a>
            <div className="text-left flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-ngt-black" />
                ))}
              </div>
              <div>
                <p className="text-sm text-ngt-gold font-bold">Rejoignez les 1,247 Snipers</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Déjà formés cette année</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-6xl font-serif italic gold-text text-center mb-20">Choisissez votre arsenal</h2>
        <div className="grid lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -10 }}
              className={`p-10 rounded-[2.5rem] border flex flex-col ${
                product.popular 
                ? "bg-ngt-gold/5 border-ngt-gold shadow-2xl shadow-ngt-gold/10 relative" 
                : "bg-ngt-dark-gray border-white/5"
              }`}
            >
              {product.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 bg-ngt-gold text-ngt-black text-[10px] font-bold uppercase tracking-widest rounded-full">
                  ⭐ Plus Populaire
                </div>
              )}
              <h3 className="text-2xl font-serif italic gold-text mb-4">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-8 flex-grow">{product.desc}</p>
              
              <div className="mb-10">
                {product.oldPrice && (
                  <span className="text-gray-500 line-through text-lg block mb-1">{product.oldPrice}€</span>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif italic text-ngt-gold">{product.price}€</span>
                  {product.mode === 'subscription' ? (
                    <span className="text-gray-500 uppercase tracking-widest text-[10px]">/ mois</span>
                  ) : (
                    (product.id.includes('algo') || product.id.includes('pack')) && (
                      <span className="text-gray-500 uppercase tracking-widest text-[10px]">à vie</span>
                    )
                  )}
                </div>
                {product.id === 'full_pack' && (
                  <p className="text-ngt-gold text-[10px] uppercase tracking-widest mt-2 font-bold">Économisez 300€</p>
                )}
              </div>

              <button
                onClick={() => handleBuy(product.id)}
                disabled={loadingId === product.id}
                className={`w-full py-5 rounded-xl font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                  product.popular
                  ? "bg-ngt-gold text-ngt-black gold-gradient hover:scale-[1.02]"
                  : "bg-white/5 text-ngt-white border border-white/10 hover:bg-white/10"
                }`}
              >
                {loadingId === product.id ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>Acheter <ChevronRight size={18} /></>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12 text-gray-500">
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-ngt-gold" />
            <span className="text-xs uppercase tracking-widest font-bold">Paiement Sécurisé SSL</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-ngt-gold" />
            <span className="text-xs uppercase tracking-widest font-bold">Accès Immédiat</span>
          </div>
          <div className="flex items-center gap-3">
            <Users size={20} className="text-ngt-gold" />
            <span className="text-xs uppercase tracking-widest font-bold">Communauté Active</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
