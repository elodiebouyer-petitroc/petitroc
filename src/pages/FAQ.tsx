import { motion } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Est-ce que NGT est adapté aux débutants ?",
    answer: "Oui, mais avec une condition : être prêt à désapprendre ce que vous croyez savoir. Notre formation 'Psychologie du Trading' et le 'Plan Caméléon' reprennent les bases, mais avec une approche mentale que vous ne trouverez nulle part ailleurs."
  },
  {
    question: "Combien de temps faut-il pour devenir rentable ?",
    answer: "Le trading n'est pas un sprint, c'est un marathon. Certains élèves voient des résultats en 3 mois, d'autres en 1 an. Cela dépend de votre capacité à respecter strictement le Plan Caméléon et à maîtriser vos émotions."
  },
  {
    question: "Comment fonctionne l'Algorithme Caméléon ?",
    answer: "C'est bien plus qu'un simple outil : c'est le véritable Plan Caméléon entièrement codé. L'algorithme Caméléon : ."
  },
  {
    question: "Le test d'entrée est-il vraiment obligatoire ?",
    answer: "Absolument. NGT n'est pas une usine à formations. Nous voulons des traders engagés et disciplinés. Le test nous permet de vérifier que vous avez la mentalité nécessaire pour intégrer l'élite."
  },
  {
    question: "Qu'est-ce que Thalamus IA ?",
    answer: "Thalamus est notre innovation majeure. C'est une plateforme neuronale qui analyse vos décisions passées pour identifier vos biais psychologiques. Elle vous dit pourquoi vous avez échoué sur un trade et comment corriger le tir."
  },
  {
    question: "Puis-je payer en plusieurs fois ?",
    answer: "Nous proposons des facilités de paiement pour nos programmes Masterclass. Contactez-nous après avoir réussi votre test d'entrée pour discuter des modalités."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="pt-32 pb-24 bg-ngt-black min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold mb-4 block">Assistance</span>
          <h1 className="text-4xl md:text-6xl font-serif mb-6">Questions <span className="italic">Fréquentes.</span></h1>
          <p className="text-ngt-white/50 font-light">Tout ce que vous devez savoir avant de rejoindre l'élite.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-ngt-white/10 bg-ngt-white/[0.02] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-ngt-white/[0.05] transition-colors"
              >
                <span className="text-lg font-serif">{faq.question}</span>
                {openIndex === idx ? (
                  <Minus className="text-ngt-gold" size={20} />
                ) : (
                  <Plus className="text-ngt-gold" size={20} />
                )}
              </button>
              
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-6 pb-6 text-ngt-white/60 font-light leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 border border-ngt-gold/20 bg-ngt-gold/[0.02] text-center">
          <h3 className="text-2xl font-serif mb-4">D'autres questions ?</h3>
          <p className="text-ngt-white/50 mb-8">Notre équipe est disponible par email pour vous répondre.</p>
          <a 
            href="mailto:ngtinfos@gmail.com" 
            className="inline-block px-10 py-4 bg-ngt-gold text-ngt-black text-[10px] uppercase tracking-widest font-bold gold-gradient"
          >
            Envoyer un email à NGT
          </a>
        </div>
      </div>
    </div>
  );
}
