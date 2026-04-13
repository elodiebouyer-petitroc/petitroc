import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Legal() {
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
            <h1 className="text-4xl md:text-6xl font-serif mb-12 italic gold-text">Mentions Légales</h1>
            
            <section className="space-y-8 text-ngt-white/70 leading-relaxed">
              <div>
                <h2 className="text-xl font-serif text-ngt-gold mb-4 uppercase tracking-widest">1. Éditeur du site</h2>
                <p>
                  Le site <strong>www.new-generation-traders.com</strong> est édité par :<br />
                  <strong>New Generation Traders (NGT)</strong><br />
                  Représentée par : OUATTARA Abou (Le Sniper)<br />
                  Siège social : Peynier, France<br />
                  Email : ngtinfos@gmail.com<br />
                  Téléphone : 0782991055
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-ngt-gold mb-4 uppercase tracking-widest">2. Hébergement</h2>
                <p>
                  Le site est hébergé par :<br />
                  Google Cloud Platform (GCP)<br />
                  Google Ireland Limited<br />
                  Gordon House, Barrow Street, Dublin 4, Irlande
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-ngt-gold mb-4 uppercase tracking-widest">3. Propriété intellectuelle</h2>
                <p>
                  L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                  <br /><br />
                  La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse de l'éditeur.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-ngt-gold mb-4 uppercase tracking-widest">4. Protection des données personnelles</h2>
                <p>
                  Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit, vous pouvez nous contacter par email à l'adresse indiquée ci-dessus.
                  <br /><br />
                  Les données collectées via le formulaire de formation gratuite sont utilisées exclusivement pour l'envoi de contenus pédagogiques et d'offres commerciales liées à NGT.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif text-ngt-gold mb-4 uppercase tracking-widest">5. Avertissement sur les risques</h2>
                <p className="text-ngt-red/80 font-medium">
                  Le trading comporte des risques financiers importants. Les performances passées ne préjugent pas des performances futures. NGT et OUATTARA Abou ne sauraient être tenus pour responsables des pertes financières subies par les utilisateurs suite à l'application des méthodes enseignées.
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
