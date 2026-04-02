import React from 'react';
import { motion } from 'motion/react';
import { Check, Star, Rocket, Shield, Building2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface BecomeProviderViewProps {
  onSubscribe: (plan: 'bronze' | 'argent' | 'or' | 'banner') => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

const BecomeProviderView: React.FC<BecomeProviderViewProps> = ({ onSubscribe, isLoggedIn, onLogin }) => {
  const plans = [
    {
      id: 'bronze',
      name: 'Bronze',
      price: '10€',
      period: '/mois',
      description: 'Pour commencer à être visible.',
      features: [
        'Logo visible sur la page "Nos partenaires"',
        'Lien vers votre site web',
        'Soutien à une plateforme locale'
      ],
      color: 'bg-orange-100 text-orange-700',
      buttonColor: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 'argent',
      name: 'Argent',
      price: '25€',
      period: '/mois',
      description: 'Boostez votre visibilité locale.',
      features: [
        'Logo visible sur la page "Nos partenaires"',
        'Lien vers votre site web',
        '1 annonce boostée par mois',
        'Soutien à une plateforme locale'
      ],
      color: 'bg-gray-100 text-gray-700',
      buttonColor: 'bg-gray-700 hover:bg-gray-800',
      popular: true
    },
    {
      id: 'or',
      name: 'Or',
      price: '50€',
      period: '/mois',
      description: 'Le choix des professionnels engagés.',
      features: [
        'Logo visible sur la page "Nos partenaires"',
        'Lien vers votre site web',
        '2 annonces boostées par mois',
        'Badge "Partenaire PetiTroc"',
        'Soutien à une plateforme locale'
      ],
      color: 'bg-yellow-100 text-yellow-700',
      buttonColor: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
      id: 'banner',
      name: 'Bannière',
      price: '50€',
      period: '/mois',
      description: 'Visibilité maximale sur tout le site.',
      features: [
        'Bannière publicitaire (Image + Lien)',
        'Affichage en haut de page',
        'Gestion manuelle par l\'équipe',
        'Soutien à une plateforme locale'
      ],
      color: 'bg-blue-100 text-blue-700',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      isOneTime: true
    }
  ];

  const advantages = [
    {
      icon: <Building2 className="text-orange-500" size={32} />,
      title: "Logo visible",
      description: "Votre logo s'affiche fièrement sur notre page 'Nos partenaires', consultée par des milliers d'utilisateurs locaux."
    },
    {
      icon: <Shield className="text-orange-500" size={32} />,
      title: "Badge de confiance",
      description: "Le badge 'Partenaire PetiTroc' rassure les utilisateurs et valorise votre engagement solidaire."
    },
    {
      icon: <Rocket className="text-orange-500" size={32} />,
      title: "Annonces boostées",
      description: "Vos annonces apparaissent en priorité dans les résultats de recherche pour toucher plus de monde."
    },
    {
      icon: <Star className="text-orange-500" size={32} />,
      title: "Soutien local",
      description: "En devenant partenaire, vous soutenez directement une plateforme locale, solidaire et durable."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-gray-900 mb-6"
          >
            Devenez <span className="text-orange-500">Partenaire</span> de PetiTroc
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Valorisez votre entreprise tout en soutenant l'économie locale et solidaire. 
            Choisissez l'offre qui vous correspond.
          </motion.p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {advantages.map((adv, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="mb-6">{adv.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{adv.title}</h3>
              <p className="text-gray-600 leading-relaxed">{adv.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Pricing Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 ${(plan as any).popular ? 'border-orange-500 scale-105 z-10' : 'border-transparent'}`}
            >
              {(plan as any).popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  Plus populaire
                </div>
              )}
              {(plan as any).isOneTime && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  Option ponctuelle
                </div>
              )}
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 ${plan.color}`}>
                {plan.name}
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                <span className="text-gray-500 font-bold">{plan.period}</span>
              </div>
              <p className="text-gray-600 text-sm mb-8">{plan.description}</p>
              
              <div className="space-y-4 mb-10">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <Check className="text-green-500 shrink-0" size={18} />
                    <span className="text-sm text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    toast.error("Veuillez vous connecter pour souscrire.");
                    onLogin();
                    return;
                  }
                  onSubscribe(plan.id as any);
                }}
                className={`w-full py-4 rounded-2xl text-white font-black transition-all flex items-center justify-center gap-2 ${plan.buttonColor}`}
              >
                Souscrire <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Free for individuals note */}
        <div className="bg-orange-50 rounded-3xl p-8 text-center max-w-3xl mx-auto">
          <p className="text-orange-800 font-bold">
            💡 Les particuliers restent 100% gratuits, sans aucun frais. 
            Ces offres sont réservées aux professionnels et prestataires souhaitant booster leur visibilité.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BecomeProviderView;
