import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { CreditCard, History, Package, Settings, ExternalLink, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProSpaceViewProps {
  userProfile: UserProfile | null;
  onManageSubscription: () => void;
  onCancelSubscription: () => void;
  onUpgradeSubscription: () => void;
}

const ProSpaceView: React.FC<ProSpaceViewProps> = ({ 
  userProfile, 
  onManageSubscription, 
  onCancelSubscription, 
  onUpgradeSubscription 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'settings'>('overview');

  if (!userProfile?.subscription) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="text-orange-500" size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Espace Pro non actif</h1>
          <p className="text-gray-600 mb-8 font-bold">
            Vous n'avez pas encore d'abonnement professionnel actif. 
            Devenez partenaire pour accéder à cet espace.
          </p>
          <button 
            onClick={() => window.location.href = '/devenir-prestataire'}
            className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-orange-600 transition-all"
          >
            Voir les offres
          </button>
        </div>
      </div>
    );
  }

  const planNames = {
    bronze: 'Pack Bronze',
    argent: 'Pack Argent',
    or: 'Pack Or',
    premium: 'Pack Premium'
  };

  const planColors = {
    bronze: 'bg-orange-100 text-orange-700',
    argent: 'bg-gray-100 text-gray-700',
    or: 'bg-yellow-100 text-yellow-700',
    premium: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Mon Espace Pro</h1>
            <p className="text-gray-500 font-bold flex items-center gap-2">
              Gérez votre visibilité et votre abonnement partenaire
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-2 ${planColors[userProfile.subscription.plan]}`}>
            <CheckCircle2 size={16} /> {planNames[userProfile.subscription.plan]}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === 'overview' ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              <Package size={20} /> Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === 'billing' ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              <CreditCard size={20} /> Facturation
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === 'settings' ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              <Settings size={20} /> Paramètres
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Subscription Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-6">Votre Offre Actuelle</h3>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <div className="text-2xl font-black text-gray-900 mb-1">{planNames[userProfile.subscription.plan]}</div>
                      <div className="text-gray-500 font-bold">
                        Statut : 
                        <span className={`ml-2 ${userProfile.subscription.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                          {userProfile.subscription.status === 'active' ? 'Actif' : 'Problème de paiement'}
                        </span>
                      </div>
                      {userProfile.subscription.currentPeriodEnd && (
                        <div className="text-gray-400 text-sm mt-1">
                          Prochain renouvellement : {new Date(userProfile.subscription.currentPeriodEnd).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={onUpgradeSubscription}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-black hover:bg-black transition-all text-sm"
                      >
                        Changer d'offre
                      </button>
                      <button 
                        onClick={onManageSubscription}
                        className="bg-white border-2 border-gray-100 text-gray-900 px-6 py-3 rounded-xl font-black hover:bg-gray-50 transition-all text-sm flex items-center gap-2"
                      >
                        Gérer <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats/Advantages Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-black text-gray-900 mb-4">Avantages actifs</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <CheckCircle2 size={18} className="text-green-500" /> Logo sur la page partenaires
                      </li>
                      <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <CheckCircle2 size={18} className="text-green-500" /> Lien vers votre site web
                      </li>
                      {(userProfile.subscription.plan === 'argent' || userProfile.subscription.plan === 'or' || userProfile.subscription.plan === 'premium') && (
                        <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                          <CheckCircle2 size={18} className="text-green-500" /> Annonces boostées
                        </li>
                      )}
                      {(userProfile.subscription.plan === 'or' || userProfile.subscription.plan === 'premium') && (
                        <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                          <CheckCircle2 size={18} className="text-green-500" /> Badge "Partenaire"
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-black text-gray-900 mb-4">Support Pro</h3>
                    <p className="text-gray-500 text-sm mb-6 font-bold">
                      Besoin d'aide pour votre visibilité ou votre abonnement ?
                    </p>
                    <button className="w-full bg-orange-50 text-orange-600 py-3 rounded-xl font-black hover:bg-orange-100 transition-all">
                      Contacter le support pro
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-gray-900">Historique de facturation</h3>
                    <button 
                      onClick={onManageSubscription}
                      className="text-orange-500 font-black flex items-center gap-2 hover:underline"
                    >
                      Télécharger mes factures <ExternalLink size={18} />
                    </button>
                  </div>
                  
                  <div className="bg-orange-50 rounded-2xl p-6 flex items-start gap-4">
                    <Download className="text-orange-500 mt-1" size={24} />
                    <div>
                      <p className="text-orange-900 font-bold mb-1">Gestion centralisée via Stripe</p>
                      <p className="text-orange-700 text-sm">
                        Pour des raisons de sécurité et de conformité, toutes vos factures et vos moyens de paiement sont gérés via le portail sécurisé de Stripe.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-6">Paramètres de l'abonnement</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-black text-gray-900">Renouvellement automatique</p>
                        <p className="text-sm text-gray-500 font-bold">
                          {userProfile.subscription.cancelAtPeriodEnd ? 'Désactivé' : 'Activé'}
                        </p>
                      </div>
                      <button 
                        onClick={onManageSubscription}
                        className="text-orange-500 font-black text-sm"
                      >
                        Modifier
                      </button>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100">
                      <h4 className="text-red-600 font-black mb-4">Zone de danger</h4>
                      <p className="text-gray-500 text-sm mb-6 font-bold">
                        La résiliation de votre abonnement entraînera la perte immédiate de vos avantages partenaires à la fin de la période en cours.
                      </p>
                      <button 
                        onClick={onCancelSubscription}
                        className="text-red-500 border-2 border-red-50 px-6 py-3 rounded-xl font-black hover:bg-red-50 transition-all text-sm"
                      >
                        Résilier mon abonnement
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProSpaceView;
