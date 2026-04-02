import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Scale, FileText, ShieldCheck } from 'lucide-react';

interface LegalNoticeProps {
  onBack: () => void;
  initialTab?: 'mentions' | 'conditions' | 'privacy';
}

export const LegalNotice: React.FC<LegalNoticeProps> = React.memo(({ onBack, initialTab = 'mentions' }) => {
  const [activeTab, setActiveTab] = useState<'mentions' | 'conditions' | 'privacy'>(initialTab);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-8 font-bold transition-colors"
      >
        <ChevronLeft size={20} /> Retour
      </button>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500">
              <Scale size={24} />
            </div>
            <h1 className="text-3xl font-black text-gray-900">Cadre Légal</h1>
          </div>

          <div className="flex flex-wrap gap-2 bg-gray-50 p-1.5 rounded-2xl">
            <button 
              onClick={() => setActiveTab('mentions')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'mentions' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Mentions
            </button>
            <button 
              onClick={() => setActiveTab('conditions')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'conditions' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Conditions
            </button>
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'privacy' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Confidentialité
            </button>
          </div>
        </div>

        <div className="prose prose-orange max-w-none space-y-8 text-gray-600 leading-relaxed">
          {activeTab === 'mentions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <section>
                <p className="font-bold text-gray-900 mb-4">Mentions Légales – PetiTroc.fr</p>
                <p>
                  L’accès et l’utilisation du site www.petitroc.fr (ci-après désigné « le Site ») sont soumis aux présentes Mentions Légales ainsi qu’aux lois et règlements applicables en France. En naviguant sur ce Site, l’utilisateur accepte sans réserve ces conditions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-wider">1. Édition du Site</h2>
                <p>
                  En vertu de l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique, il est précisé aux utilisateurs du site PetiTroc l’identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 font-bold">
                  <li>Propriétaire et Responsable de la publication : Elodie Bouyer</li>
                  <li>Adresse : 10 Avenue de la Vierge, 13790 Peynier (Région d’Aix-en-Provence)</li>
                  <li>Contact e-mail : elodie.bouyer@laposte.net</li>
                  <li>Statut : Particulier / Auto-entrepreneur</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-wider">2. Hébergement du Site</h2>
                <p>
                  Le site PetiTroc est hébergé par une infrastructure professionnelle garantissant la sécurité des données :
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 font-bold">
                  <li>Hébergeur : Google Cloud Platform</li>
                  <li>Siège social : 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-wider">3. Propriété Intellectuelle</h2>
                <p>
                  Elodie Bouyer est propriétaire des droits de propriété intellectuelle ou détient les droits d’usage sur tous les éléments accessibles sur le site, notamment : les textes, les images, le logo PetiTroc, les graphismes et les icônes.
                </p>
              </section>
            </motion.div>
          )}

          {activeTab === 'conditions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <section>
                <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-wider">Conditions Générales d'Utilisation</h2>
                <p className="font-bold">Bienvenue sur PetiTroc. En utilisant notre plateforme, vous acceptez les présentes conditions.</p>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-2">1. Objet du Service</h3>
                <p>
                  PetiTroc est une plateforme de mise en relation gratuite entre particuliers pour le troc et le don d'objets ou de services. Notre mission est de favoriser l'économie circulaire et la solidarité, sans aucune commission ni frais cachés.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-2">2. Règles de Publication</h3>
                <p>Pour garantir la qualité de la plateforme, chaque utilisateur s'engage à :</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Ne pas publier d'annonces en <span className="text-orange-600 font-bold">doublon</span> (même objet, même photo).</li>
                  <li>Utiliser des photos réelles et fidèles à l'état de l'objet.</li>
                  <li>Décrire honnêtement les éventuels défauts.</li>
                  <li>Ne pas proposer de produits illégaux, dangereux ou interdits par la loi française.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-2">3. Gratuité Totale</h3>
                <p>
                  L'utilisation de PetiTroc est entièrement gratuite. Nous ne demandons jamais de coordonnées bancaires sur le site. Les échanges se font de gré à gré entre les utilisateurs.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-2">4. Responsabilité</h3>
                <p>
                  PetiTroc n'est qu'un intermédiaire technique. Nous ne sommes pas responsables du contenu des annonces, de la qualité des objets échangés, ni du comportement des utilisateurs lors des rencontres physiques. Nous recommandons de privilégier les lieux publics pour vos échanges.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-2">5. Modération</h3>
                <p>
                  Nous nous réservons le droit de supprimer sans préavis toute annonce ne respectant pas nos valeurs ou les présentes conditions, notamment les tentatives de fraude ou les comportements irrespectueux.
                </p>
              </section>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <section>
                <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-wider">Politique de Confidentialité</h2>
                <p>Vos données sont précieuses. Voici comment nous les protégeons.</p>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-2">1. Données Collectées</h3>
                <p>
                  Nous collectons uniquement les données nécessaires au service : votre nom (ou pseudo), votre adresse email (via Google Auth) et votre localisation approximative pour les annonces.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-2">2. Utilisation des Données</h3>
                <p>
                  Vos données ne sont jamais vendues à des tiers. Elles servent uniquement à vous permettre de communiquer avec les autres troqueurs et à gérer vos annonces.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-2">3. Vos Droits</h3>
                <p>
                  Conformément au RGPD, vous pouvez à tout moment demander la suppression de votre compte et de toutes vos données associées en nous contactant par email.
                </p>
              </section>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

LegalNotice.displayName = 'LegalNotice';
