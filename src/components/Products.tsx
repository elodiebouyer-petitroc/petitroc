import { motion } from "motion/react";
import { Brain, Target, Cpu, TrendingUp, ArrowUpRight, ShoppingCart, Loader2, FileText } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Newsletter from "./Newsletter";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

export default function Products() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleBuy = async (productId: string) => {
    // Redirect to product page or checkout directly
    if (productId === "psychology") navigate("/formation-psychologie");
    else if (productId === "cameleon") navigate("/formation-cameleon");
    else if (productId === "algo" || productId === "algo_monthly") navigate("/cameleon-algo");
    else navigate("/#products");
  };

  const products = [
    {
      id: "psychology",
      icon: <Brain className="text-ngt-gold" size={32} />,
      title: t("products.psychology.title"),
      price: "70€",
      oldPrice: null,
      desc: t("products.psychology.desc"),
      features: [
        "Maîtrise totale des émotions",
        "Détachement de l'ego face au marché",
        "Gestion du stress en temps réel",
        "Discipline de fer et rigueur",
        "Fondations de la rentabilité durable"
      ],
      type: "Formation Vidéo",
      cta: t("products.psychology.cta"),
      link: "/formation-psychologie",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800&h=500"
    },
    {
      id: "cameleon",
      icon: <Target className="text-ngt-gold" size={32} />,
      title: t("products.cameleon.title"),
      price: "500€",
      oldPrice: "897€",
      desc: t("products.cameleon.desc"),
      features: [
        "16 vidéos détaillées",
        "Accès au groupe WhatsApp des Snipers",
        "Accès aux sessions Zoom avec le Sniper",
        "Missions exclusives avec le Sniper",
        "Attribution d'un numéro de matricule"
      ],
      type: "DEVENIR UN SNIPER",
      cta: t("products.cameleon.cta"),
      link: "/formation-cameleon",
      highlight: true,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800&h=500"
    },
    {
      id: "algo",
      icon: <TrendingUp className="text-ngt-gold" size={32} />,
      title: t("algo.cameleon.title"),
      price: "Abonnement",
      oldPrice: null,
      desc: t("algo.cameleon.desc"),
      features: [
        "Trading 100% autonome",
        "Gestion du risque ultra-stricte",
        "Précision chirurgicale sans faille",
        "Zéro émotion humaine",
        "Exécution parfaite de la stratégie Sniper"
      ],
      type: "Logiciel de Trading",
      cta: t("algo.cameleon.cta"),
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500"
    }
  ];

  return (
    <section id="products" className="py-24 md:py-32 bg-ngt-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold mb-4 block">{t("products.subtitle")}</span>
            <h2 className="text-4xl md:text-6xl font-serif">{t("products.title")}</h2>
          </div>
          <p className="text-ngt-white/40 text-sm max-w-xs font-light italic">
            {t("products.quote")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-10 border ${product.highlight ? 'border-ngt-gold bg-ngt-gold/[0.03]' : 'border-ngt-white/10 bg-ngt-white/[0.02]'} flex flex-col group`}
            >
              <div className="mb-8">{product.icon}</div>
              {product.image && (
                <div className="mb-6 aspect-video overflow-hidden border border-ngt-gold/20">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <span className="text-[10px] uppercase tracking-widest text-ngt-gold/60 mb-2">{product.type}</span>
              <h3 className="text-2xl font-serif mb-4">{product.title}</h3>
              <p className="text-sm text-ngt-white/50 leading-relaxed mb-6">{product.desc}</p>
              
              {product.features && (
                <ul className="space-y-2 mb-8 flex-grow">
                  {product.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-[11px] text-ngt-white/70 uppercase tracking-wider">
                      <div className="w-1 h-1 bg-ngt-gold rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              
              {!product.features && <div className="flex-grow"></div>}
              
              <div className="flex items-end gap-3 mb-8">
                <span className="text-3xl font-serif text-ngt-white">{product.price}</span>
                {product.oldPrice && (
                  <span className="text-ngt-white/30 line-through text-sm mb-1">{product.oldPrice}</span>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {product.link ? (
                  <Link 
                    to={product.link}
                    className={`w-full py-4 text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${
                      product.highlight ? 'bg-ngt-gold text-ngt-black gold-gradient' : 'border border-ngt-white/20 text-ngt-white hover:border-ngt-gold hover:text-ngt-gold'
                    }`}
                  >
                    <ShoppingCart size={14} />
                    {product.cta}
                  </Link>
                ) : (
                  <button 
                    onClick={() => {
                      if (product.id === "algo") {
                        handleBuy("algo_monthly");
                      } else {
                        handleBuy(product.id);
                      }
                    }}
                    disabled={loadingId === product.id || loadingId === "algo_monthly"}
                    className={`w-full py-4 text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${
                    product.highlight ? 'bg-ngt-gold text-ngt-black gold-gradient' : 'border border-ngt-white/20 text-ngt-white hover:border-ngt-gold hover:text-ngt-gold'
                  }`}>
                    {loadingId === product.id || (product.id === "algo" && loadingId === "algo_monthly") ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        <ShoppingCart size={14} />
                        {product.cta}
                      </>
                    )}
                  </button>
                )}

                {product.id === "algo" && (
                  <Link 
                    to="/cameleon-algo"
                    className="w-full py-4 text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 border border-ngt-gold/30 text-ngt-gold hover:bg-ngt-gold/10"
                  >
                    <FileText size={14} />
                    {t('algo.cameleon.btn')}
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mb-24">
          <Newsletter />
        </div>

        {/* Thalamus IA Highlight */}
        <div id="thalamus" className="relative p-12 md:p-20 border border-ngt-gold/30 bg-ngt-black overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ngt-gold via-transparent to-transparent"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-3 mb-6">
                <Cpu className="text-ngt-gold" size={32} />
                <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold font-bold">{t("thalamus.subtitle")}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif mb-6 italic">{t("thalamus.title")}</h2>
              <p className="text-ngt-white/60 mb-8 leading-relaxed">
                {t("thalamus.desc")}
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Analyse neuronale de vos décisions",
                  "Algorithme de trading intégré (ou séparé)",
                  "Journal de trading intelligent",
                  "Abonnement flexible"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-ngt-white/80">
                    <div className="w-1.5 h-1.5 bg-ngt-gold rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/thalamus-ia"
                  className="px-8 py-4 bg-ngt-gold text-ngt-black text-[10px] uppercase tracking-widest font-bold gold-gradient flex items-center gap-2"
                >
                  {t("thalamus.cta")} <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            <div className="order-1 md:order-2 relative">
              <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=600" 
                  alt="Thalamus IA Mockup" 
                  className="w-full h-auto shadow-2xl border border-ngt-gold/20"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -inset-4 bg-ngt-gold/5 blur-2xl rounded-full pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
