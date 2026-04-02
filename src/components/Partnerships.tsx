import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Handshake, 
  Users, 
  Star, 
  Mail, 
  Globe, 
  ArrowRight,
  Heart,
  Briefcase,
  Megaphone
} from 'lucide-react';

interface PartnershipsProps {
  onBack: () => void;
  onContact?: () => void;
}

export const Partnerships: React.FC<PartnershipsProps> = ({ onBack, onContact }) => {
  const partners = [
    {
      name: "EcoTroc France",
      category: "Écologie & Recyclage",
      description: "Notre partenaire principal pour la revalorisation des objets non troqués.",
      logo: "https://picsum.photos/seed/eco/200/200",
      website: "https://example.com/ecotroc"
    },
    {
      name: "Mairie de Paris",
      category: "Institutionnel",
      description: "Soutien local pour le développement de l'économie circulaire dans la capitale.",
      logo: "https://picsum.photos/seed/paris/200/200",
      website: "https://paris.fr"
    },
    {
      name: "BioMarché",
      category: "Alimentation",
      description: "Partenaire pour les échanges de produits locaux et de saison.",
      logo: "https://picsum.photos/seed/bio/200/200",
      website: "https://example.com/biomarche"
    },
    {
      name: "Repair Café",
      category: "Services",
      description: "Ateliers de réparation collaboratifs pour donner une seconde vie à vos objets.",
      logo: "https://picsum.photos/seed/repair/200/200",
      website: "https://example.com/repaircafe"
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-orange-50 py-12 md:py-20 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-widest mb-8 hover:gap-3 transition-all"
          >
            <ChevronLeft size={16} />
            Retour à l'accueil
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                  <Handshake size={24} />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                  Nos <span className="text-orange-500">Partenariats</span>
                </h1>
              </div>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                PetiTroc grandit grâce à un réseau de partenaires engagés pour une consommation plus responsable et solidaire.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
              <Users size={28} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">15+</h3>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Partenaires actifs</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-4">
              <Star size={28} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">50+</h3>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Événements co-organisés</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-4">
              <Heart size={28} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">100%</h3>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Engagement local</p>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="mb-24">
          <h2 className="text-2xl font-black text-gray-900 mb-12 flex items-center gap-3">
            <span className="w-8 h-1 bg-orange-500 rounded-full" />
            Ils nous font confiance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner, index) => (
              <motion.div 
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:border-orange-200 transition-all"
              >
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border border-gray-50 shrink-0">
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 block">
                      {partner.category}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 mb-2">{partner.name}</h3>
                    <p className="text-sm text-gray-600 font-medium mb-4 leading-relaxed">
                      {partner.description}
                    </p>
                    <a 
                      href={partner.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-orange-500 transition-colors uppercase tracking-widest"
                    >
                      <Globe size={14} />
                      Voir le site
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-900 rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Devenez partenaire de <span className="text-orange-500">PetiTroc</span>
            </h2>
            <p className="text-gray-400 font-medium mb-10 leading-relaxed">
              Vous êtes une association, une entreprise locale ou une institution ? Rejoignez l'aventure et participez au développement de l'économie circulaire.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <Briefcase className="text-orange-500 mx-auto mb-2" size={20} />
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Sponsoring</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <Megaphone className="text-blue-500 mx-auto mb-2" size={20} />
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Visibilité</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <Handshake className="text-green-500 mx-auto mb-2" size={20} />
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Collaboration</p>
              </div>
            </div>

            <button 
              onClick={onContact}
              className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full font-black text-sm transition-all shadow-xl shadow-orange-900/20 flex items-center gap-2 mx-auto active:scale-95"
            >
              <Mail size={18} />
              Nous contacter pour un partenariat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
