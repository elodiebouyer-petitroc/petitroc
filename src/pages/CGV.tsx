import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CGV() {
  return (
    <div className="bg-ngt-black min-h-screen text-ngt-white">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif mb-12 italic gold-text">Conditions Générales de Vente</h1>
            
            <section className="space-y-8 text-ngt-white/70 leading-relaxed">
              <div>
                <h2 className="text-xl font-serif text-ngt-gold mb-4 uppercase tracking-widest">1. Objet</h2>
                <p>
                  Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre :<br />
                  <strong>New Generation Traders (NGT)</strong>, dont le siège social est situé à Peynier, France (Email : ngtinfos@gmail.com, Tél : 0782991055), et ses clients pour l'achat de formations numériques, de logiciels (algorithmes) et de services de coaching.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-ngt-gold mb-4 uppercase tracking-widest">2. Produits et Services</h2>
                <p>
                  NGT propose :<br />
                  - Formations vidéo numériques (Psychologie du Trading, Plan Caméléon)<br />
                  - Logiciels et algorithmes de trading (Algorithme Caméléon, Thalamus IA)<br />
                  - Services de coaching personnalisé (Sessions à l'heure)<br />
                  - Conférences en présentiel et en ligne
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-ngt-gold mb-4 uppercase tracking-widest">3. Prix et Paiement</h2>
                <p>
                  Les prix sont indiqués en Euros (€) et sont payables en totalité lors de la commande. Les moyens de paiement acceptés incluent les cartes bancaires, PayPal, ainsi que les solutions de paiement mobile africaines (Orange Money, MTN Money, Wave, Moov Money).
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-ngt-gold mb-4 uppercase tracking-widest">4. Droit de rétractation</h2>
                <p>
                  Conformément à la réglementation sur les contenus numériques, le droit de rétractation ne s'applique pas aux produits numériques (formations vidéo, accès logiciels) dès lors que l'accès au contenu a été fourni au client. Pour les services de coaching, toute annulation doit être effectuée au moins 24 heures à l'avance.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-ngt-gold mb-4 uppercase tracking-widest">5. Responsabilité</h2>
                <p className="text-ngt-red/80 font-medium">
                  Le client reconnaît que le trading sur les marchés financiers comporte des risques élevés. NGT fournit des outils pédagogiques et technologiques, mais ne garantit aucun résultat financier. Le client est seul responsable de ses décisions d'investissement et de la gestion de son capital.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-ngt-gold mb-4 uppercase tracking-widest">6. Accès et Durée</h2>
                <p>
                  L'accès aux formations est généralement illimité (sauf mention contraire). Les abonnements aux logiciels (Algo, Thalamus) sont renouvelables tacitement sauf résiliation par le client avant la date d'échéance.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-ngt-gold mb-4 uppercase tracking-widest">7. Litiges</h2>
                <p>
                  Tout litige relatif à l'interprétation ou à l'exécution des présentes CGV sera soumis aux tribunaux compétents du siège social de l'éditeur, sous réserve de la législation applicable.
                </p>
              </div>
            </section>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
