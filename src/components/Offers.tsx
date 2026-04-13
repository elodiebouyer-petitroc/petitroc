import { motion } from "motion/react";
import { CheckCircle2, Loader2, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

export default function Offers() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleBuy = async (productId: string) => {
    // Redirect to product page or checkout directly
    if (productId === "cameleon") navigate("/formation-cameleon");
    else if (productId === "algo_monthly") navigate("/cameleon-algo");
    else if (productId === "coaching") navigate("/support"); // Or wherever coaching info is
    else if (productId === "full_pack") navigate("/plan-cameleon");
    else navigate("/#offers");
  };

  const offers = [
    {
      id: "cameleon",
      title: t("offers.training.title"),
      price: t("offers.training.price"),
      features: [
        t("offers.training.f1"),
        t("offers.training.f2"),
        t("offers.training.f3"),
        t("offers.training.f4"),
        t("offers.training.f5")
      ],
      cta: t("offers.training.cta"),
      link: "/formation-cameleon",
      highlight: true
    },
    {
      id: "algo_monthly",
      title: t("offers.telegram.title"),
      price: t("offers.telegram.price"),
      features: [
        t("offers.telegram.f1"),
        t("offers.telegram.f2"),
        t("offers.telegram.f3"),
        t("offers.telegram.f4"),
        t("offers.telegram.f5")
      ],
      cta: t("offers.telegram.cta"),
      highlight: false
    },
    {
      id: "coaching",
      title: t("offers.coaching.title"),
      price: t("offers.coaching.price"),
      features: [
        t("offers.coaching.f1"),
        t("offers.coaching.f2"),
        t("offers.coaching.f3"),
        t("offers.coaching.f4"),
        t("offers.coaching.f5")
      ],
      cta: t("offers.coaching.cta"),
      highlight: false
    }
  ];

  return (
    <section id="offers" className="py-24 md:py-32 bg-ngt-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold mb-4 block">{t("offers.badge")}</span>
          <h2 className="text-4xl md:text-6xl font-serif">{t("offers.title")}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {offers.map((offer, idx) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`p-10 border ${
                offer.highlight ? "border-ngt-gold bg-ngt-gold/[0.05]" : "border-ngt-white/10 bg-ngt-white/[0.02]"
              } flex flex-col h-full relative group`}
            >
              {offer.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-ngt-gold text-ngt-black text-[10px] font-bold uppercase tracking-widest">
                  {t("offers.popular")}
                </div>
              )}
              
              <h3 className="text-2xl font-serif mb-2">{offer.title}</h3>
              <p className="text-ngt-gold text-sm uppercase tracking-widest mb-8">{offer.price}</p>
              
              <ul className="space-y-4 mb-12 flex-grow">
                {offer.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-ngt-white/60">
                    <CheckCircle2 size={18} className="text-ngt-gold shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {offer.link ? (
                <Link
                  to={offer.link}
                  className={`w-full py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 flex items-center justify-center gap-2 ${
                    offer.highlight 
                      ? "bg-ngt-gold text-ngt-black gold-gradient" 
                      : "border border-ngt-white/20 text-ngt-white hover:border-ngt-gold hover:text-ngt-gold"
                  }`}
                >
                  <ShoppingCart size={14} />
                  {offer.cta}
                </Link>
              ) : (
                <button 
                  onClick={() => handleBuy(offer.id)}
                  disabled={loadingId === offer.id}
                  className={`w-full py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 flex items-center justify-center gap-2 ${
                  offer.highlight 
                    ? "bg-ngt-gold text-ngt-black gold-gradient" 
                    : "border border-ngt-white/20 text-ngt-white hover:border-ngt-gold hover:text-ngt-gold"
                }`}>
                  {loadingId === offer.id ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      {offer.id !== "coaching" && <ShoppingCart size={14} />}
                      {offer.cta}
                    </>
                  )}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <p className="text-ngt-white/40 text-sm italic mb-8">
            {t("offers.quote")}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => handleBuy("full_pack")}
            disabled={loadingId === "full_pack"}
            className="px-12 py-5 bg-ngt-red text-ngt-white text-xs uppercase tracking-[0.3em] font-bold shadow-[0_0_30px_rgba(139,0,0,0.3)] flex items-center justify-center gap-2 mx-auto"
          >
            {loadingId === "full_pack" ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <ShoppingCart size={18} />
                {t("offers.final.cta")}
              </>
            )}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
