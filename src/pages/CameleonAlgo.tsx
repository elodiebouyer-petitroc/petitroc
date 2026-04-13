import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Zap, 
  Lock, 
  BarChart3, 
  History, 
  UserCheck, 
  Star,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Layers,
  Activity,
  Target,
  CreditCard,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../firebase';

const CameleonAlgo: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCheckout = async (productId: string = "algo_lifetime") => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          userId: auth.currentUser.uid,
          email: auth.currentUser.email,
        }),
      });

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Erreur lors de la création de la session de paiement:", error);
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={16} className={i < count ? "text-ngt-gold fill-ngt-gold" : "text-gray-600"} />
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <Helmet>
        <title>{t('cameleon.page.title')} | Snipers</title>
        <meta name="description" content={t('cameleon.page.subtitle')} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div {...fadeIn} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ngt-gold/10 border border-ngt-gold/20 mb-6">
            <ShieldCheck size={18} className="text-ngt-gold" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-ngt-gold">{t('cameleon.page.badge')}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif italic gold-text mb-6">{t('algo.cameleon.title')}</h1>
          <p className="text-base text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('cameleon.page.subtitle')}
          </p>
        </motion.div>

        {/* Identity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-ngt-dark-gray/30 p-8 rounded-2xl border border-white/5"
          >
            <h2 className="text-lg font-serif italic gold-text mb-8 flex items-center gap-3">
              <UserCheck className="text-ngt-gold" size={18} />
              {t('cameleon.page.identity')}
            </h2>
            <div className="space-y-5">
              {[
                { label: "Nom", value: t('algo.cameleon.title'), stars: 5 },
                { label: "Nature", value: "EA MQL5 + Stratégie + Psychologie", stars: 5 },
                { label: "Créateur", value: "Trader actif +10 ans, expert en psychologie", stars: 5 },
                { label: "Statut", value: "Utilisé en réel depuis 2015 (10 ans de résultats)", stars: 5 },
                { label: "Valeur", value: "Actif financier vivant (pas une théorie)", stars: 5 },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                  <div className="flex gap-1">{renderStars(item.stars)}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-ngt-gold/10 to-transparent border border-ngt-gold/20">
              <h3 className="text-xl font-serif italic gold-text mb-4">Positionnement Marché</h3>
              <p className="text-gray-400 mb-8 leading-relaxed text-xs">
                L'{t('algo.cameleon.title')} n'est pas un EA amateur vendu à bas prix. C'est un outil de précision 
                conçu pour les traders sérieux et les institutions exigeant une robustesse absolue et une 
                gestion des risques sans faille.
              </p>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-serif italic text-ngt-gold">4.6<span className="text-lg">/5</span></div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="text-[9px] uppercase tracking-widest text-gray-500">Note Globale<br/>Avancé / Institutionnel</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Global Evaluation Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-ngt-dark-gray/30 rounded-3xl border border-white/5 overflow-hidden">
            <div className="p-8 md:p-10 border-b border-white/5 text-center">
              <h2 className="text-2xl md:text-3xl font-serif italic gold-text mb-2">{t('cameleon.page.eval.title')}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">{t('cameleon.page.eval.col1')}</th>
                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">{t('cameleon.page.eval.col2')}</th>
                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-500 font-bold text-right">{t('cameleon.page.eval.col3')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { crit: t('cameleon.page.eval.c1'), desc: t('cameleon.page.eval.d1'), level: t('cameleon.page.eval.l1'), stars: 4 },
                    { crit: t('cameleon.page.eval.c2'), desc: t('cameleon.page.eval.d2'), level: t('cameleon.page.eval.l2'), stars: 5 },
                    { crit: t('cameleon.page.eval.c3'), desc: t('cameleon.page.eval.d3'), level: t('cameleon.page.eval.l3'), stars: 4 },
                    { crit: t('cameleon.page.eval.c4'), desc: t('cameleon.page.eval.d4'), level: t('cameleon.page.eval.l4'), stars: 5 },
                    { crit: t('cameleon.page.eval.c5'), desc: t('cameleon.page.eval.d5'), level: t('cameleon.page.eval.l5'), stars: 5 },
                    { crit: t('cameleon.page.eval.c6'), desc: t('cameleon.page.eval.d6'), level: t('cameleon.page.eval.l6'), stars: 5 },
                    { crit: t('cameleon.page.eval.c7'), desc: t('cameleon.page.eval.d7'), level: t('cameleon.page.eval.l7'), stars: 5 },
                  ].map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6">
                        <p className="text-base font-medium mb-1.5">{item.crit}</p>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-md">{item.desc}</p>
                      </td>
                      <td className="px-8 py-6 text-sm text-ngt-gold italic">{item.level}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-1">{renderStars(item.stars)}</div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-ngt-gold/5">
                    <td className="px-8 py-6 font-serif italic text-xl gold-text">{t('cameleon.page.eval.final')}</td>
                    <td className="px-8 py-6 font-serif italic text-lg text-white">{t('cameleon.page.eval.final_level')}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-ngt-gold text-black font-bold text-sm">
                        <Star size={14} fill="currentColor" />
                        <span>4.6 / 5</span>
                        <Star size={14} fill="currentColor" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Why choose Section */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-ngt-gold/5 border border-ngt-gold/10 max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-serif italic gold-text mb-8 flex items-center justify-center gap-3">
              <CheckCircle2 size={24} />
              {t('cameleon.page.why')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { label: "Fiabilité Institutionnelle", reason: "Conçu pour durer et survivre aux conditions de marché extrêmes." },
                { label: "Gestion du Risque Native", reason: "La protection du capital est la priorité absolue du code." },
                { label: "Transparence Totale", reason: "Basé sur une stratégie réelle, pas sur du marketing." },
                { label: "Support d'Expert", reason: "Accès direct au créateur et à son expertise de 10 ans." },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 text-ngt-gold"><CheckCircle2 size={18} /></div>
                  <div>
                    <p className="font-bold text-gray-200 text-base mb-1">{item.label}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Pricing & CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
          id="pricing"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-serif italic gold-text mb-4">Choisissez votre licence</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Trois options pour intégrer l'algorithme Caméléon à votre arsenal de trading.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Monthly Subscription */}
            <div className="p-8 rounded-3xl bg-ngt-dark-gray/20 border border-white/5 flex flex-col">
              <h3 className="text-xl font-serif italic gold-text mb-2">Abonnement Mensuel</h3>
              <p className="text-gray-500 text-xs mb-6">Idéal pour tester la puissance de l'algorithme.</p>
              <div className="mb-8">
                <span className="text-4xl font-serif italic text-white">149€</span>
                <span className="text-gray-500 text-[10px] uppercase tracking-widest ml-2">/ mois</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {["Algorithme complet", "Support standard", "Sans engagement", "Mises à jour incluses"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-[10px] text-gray-400">
                    <Check size={12} className="text-ngt-gold" /> {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleCheckout("algo_monthly")}
                disabled={loading}
                className="w-full py-4 border border-ngt-gold/30 text-ngt-gold text-[10px] uppercase tracking-widest font-bold hover:bg-ngt-gold hover:text-ngt-black transition-all"
              >
                S'abonner
              </button>
            </div>

            {/* Annual Subscription */}
            <div className="p-8 rounded-3xl bg-ngt-gold/5 border border-ngt-gold/30 flex flex-col relative scale-105 shadow-2xl shadow-ngt-gold/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-ngt-gold text-black text-[9px] font-bold uppercase tracking-widest rounded-full">Meilleure Valeur</div>
              <h3 className="text-xl font-serif italic gold-text mb-2">Abonnement Annuel</h3>
              <p className="text-gray-500 text-xs mb-6">Engagement 1 an (12 mois).</p>
              <div className="mb-8">
                <span className="text-4xl font-serif italic text-white">124€</span>
                <span className="text-gray-500 text-[10px] uppercase tracking-widest ml-2">/ mois</span>
                <span className="text-ngt-gold text-[10px] font-bold block mt-1">Économisez 300€ / an</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {["Accès complet illimité", "Support prioritaire", "Engagement 12 mois", "Mises à jour incluses"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-[10px] text-gray-400">
                    <Check size={12} className="text-ngt-gold" /> {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleCheckout("algo_annual")}
                disabled={loading}
                className="w-full py-4 bg-ngt-gold text-black text-[10px] uppercase tracking-widest font-bold gold-gradient hover:scale-[1.02] transition-all"
              >
                S'abonner (Engagement 1 an)
              </button>
            </div>

            {/* Lifetime License */}
            <div className="p-8 rounded-3xl bg-ngt-dark-gray/20 border border-white/5 flex flex-col">
              <h3 className="text-xl font-serif italic gold-text mb-2">Licence à Vie</h3>
              <p className="text-gray-500 text-xs mb-6">L'investissement définitif pour votre carrière.</p>
              <div className="mb-8">
                <span className="text-4xl font-serif italic text-white">1 997€</span>
                <span className="text-gray-500 text-[10px] uppercase tracking-widest ml-2">Une seule fois</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {["Accès illimité à vie", "Support prioritaire", "Groupe privé Snipers", "Installation assistée"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-[10px] text-gray-400">
                    <Check size={12} className="text-ngt-gold" /> {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleCheckout("algo_lifetime")}
                disabled={loading}
                className="w-full py-4 border border-ngt-gold/30 text-ngt-gold text-[10px] uppercase tracking-widest font-bold hover:bg-ngt-gold hover:text-ngt-black transition-all"
              >
                Acquérir la licence
              </button>
            </div>

            {/* Full Pack */}
            <div className="p-8 rounded-3xl bg-ngt-dark-gray/20 border border-white/5 flex flex-col">
              <h3 className="text-xl font-serif italic gold-text mb-2">Pack Complet</h3>
              <p className="text-gray-500 text-xs mb-6">Formation + Algorithme à vie.</p>
              <div className="mb-8">
                <span className="text-4xl font-serif italic text-white">2 197€</span>
                <span className="text-ngt-gold text-[10px] font-bold block mt-1">Pack Ultime</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {["Formation Plan Caméléon", "Algorithme à vie", "Coaching de groupe", "Accès VIP"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-[10px] text-gray-400">
                    <Check size={12} className="text-ngt-gold" /> {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleCheckout("full_pack")}
                disabled={loading}
                className="w-full py-4 border border-ngt-gold/30 text-ngt-gold text-[10px] uppercase tracking-widest font-bold hover:bg-ngt-gold hover:text-ngt-black transition-all"
              >
                Prendre le Pack
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CameleonAlgo;
