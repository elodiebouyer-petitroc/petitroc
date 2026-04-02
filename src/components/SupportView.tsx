import React from 'react';
import { motion } from 'motion/react';
import { Heart, Coffee, ShieldCheck, Globe, Users, TrendingUp, CheckCircle2, ChevronLeft } from 'lucide-react';

export const SupportView = React.memo(({ onBack }: { onBack?: () => void }) => {
  const suggestedAmounts = [5, 10, 20];
  const supporters = [
    { name: 'Marie L.', date: 'Il y a 2 jours' },
    { name: 'Thomas D.', date: 'Il y a 5 jours' },
    { name: 'Sophie G.', date: 'Il y a 1 semaine' },
    { name: 'Jean-Pierre', date: 'Il y a 2 semaines' },
    { name: 'Anonyme', date: 'Il y a 3 semaines' },
  ];

  const monthlyGoal = 50; // €
  const currentAmount = 0; // €
  const percentage = Math.min(100, (currentAmount / monthlyGoal) * 100);

  return (
    <div className="min-h-screen bg-orange-50/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-widest mb-8 hover:gap-3 transition-all"
        >
          <ChevronLeft size={16} />
          Retour à l'accueil
        </button>

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
            <Heart className="text-orange-500" size={32} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Soutenir PetiTroc</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            PetiTroc est né d'une envie simple : redonner du sens à nos échanges. 
            Pour que le site reste <span className="text-orange-600 font-bold">100% gratuit</span> et sans publicité, votre soutien est précieux.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Why Support Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-orange-100"
          >
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="text-orange-500" />
              Pourquoi nous soutenir ?
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Globe className="text-orange-500" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Payer l'hébergement</h3>
                  <p className="text-sm text-gray-600">Les serveurs et le nom de domaine ont un coût mensuel que nous finançons pour vous offrir un service fluide.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Users className="text-orange-500" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Rester indépendant</h3>
                  <p className="text-sm text-gray-600">Pas d'investisseurs, pas de publicité. Nous voulons que PetiTroc appartienne à sa communauté.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-orange-500" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Développer de nouvelles fonctions</h3>
                  <p className="text-sm text-gray-600">Améliorer la carte, ajouter des filtres, sécuriser les échanges... Vos dons financent le temps de développement.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <p className="text-sm text-orange-800 font-medium flex items-center gap-2">
                <CheckCircle2 size={16} />
                Le don est totalement volontaire. Le site restera gratuit pour tous, donateurs ou non.
              </p>
            </div>
          </motion.div>

          {/* Goal & Donation Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100 flex flex-col"
          >
            <h2 className="text-xl font-black text-gray-900 mb-6">Objectif du mois</h2>
            
            <div className="mb-8">
              <div className="flex flex-col mb-2">
                <span className="text-2xl font-black text-orange-500">{currentAmount}€ récoltés ce mois-ci</span>
                <span className="text-sm font-bold text-gray-400">Objectif : {monthlyGoal}€</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-orange-500"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">
                {percentage.toFixed(0)}% de l'hébergement financé
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Montants suggérés</p>
              <div className="grid grid-cols-3 gap-2">
                {suggestedAmounts.map(amount => (
                  <button 
                    key={amount}
                    className="py-2 rounded-xl border-2 border-orange-100 text-orange-500 font-black hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all text-sm"
                  >
                    {amount}€
                  </button>
                ))}
              </div>
              <button className="w-full py-2 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-bold hover:border-orange-500 hover:text-orange-500 transition-all text-sm">
                Montant libre
              </button>
            </div>

            <a 
              href="https://paypal.me/petitroc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-center shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2 group"
            >
              <Coffee size={20} className="group-hover:rotate-12 transition-transform" />
              Faire un don
            </a>
          </motion.div>
        </div>

        {/* Supporters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100"
        >
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">Merci à nos soutiens ❤️</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {supporters.map((supporter, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-orange-50/50 border border-orange-100/50">
                <p className="font-black text-gray-900 text-sm mb-1">{supporter.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{supporter.date}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-8 italic">
            Les donateurs apparaissent ici avec leur accord uniquement.
          </p>
        </motion.div>
      </div>
    </div>
  );
});

SupportView.displayName = 'SupportView';
