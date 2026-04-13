import { useState } from "react";
import { motion } from "motion/react";
import { Play, Quote, Star, ExternalLink, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";

const videoTestimonials = [
  {
    id: "omJ81OtdNnE",
    title: "Témoignages Élèves NGT",
    thumbnail: "https://img.youtube.com/vi/omJ81OtdNnE/maxresdefault.jpg"
  }
];

const textReviews = [
  {
    name: "ERIC GUY ROMAIN KOUASSI",
    source: "Trustpilot",
    content: "New Generation Traders (NGT), l'école de la vie. Quand j'ai commencé, je voyais l'opportunité de gagner de l'argent. Chez NGT, j'ai découvert la SAGESSE. C'est le pilier de toute élévation.",
    rating: 5
  },
  {
    name: "Bouyer Elodie",
    source: "Trustpilot",
    content: "EXTRAORDINAIRE. Un seul mot : WOUAWW ! MERCI Sniper, tellement efficace et simple. Le plan caméléon me réconforte dans mes prises de position. Je suis sauvée.",
    rating: 5
  },
  {
    name: "Rodolphe konan Kra",
    source: "Google",
    content: "La formation de notre génération, elle est hors du commun. La seule formation qui vous donne envie de regarder et d'apprendre encore plus.",
    rating: 5
  },
  {
    name: "Moussa Adam",
    source: "Trustpilot",
    content: "J’en ai vu beaucoup en Trading, mais le plan caméléon c’est du haut niveau. Dieu seul sait comment le Sniper en chef a pu mettre ce plan si bénéfique.",
    rating: 5
  },
  {
    name: "Mireille Traoré",
    source: "Trustpilot",
    content: "C'est la meilleure formation de trading car en dehors de la stratégie, la psychologie est parfaitement bien enseignée. Le coach est très humble.",
    rating: 5
  },
  {
    name: "Tesla Tesla",
    source: "Trustpilot",
    content: "J'ai fait deux formations de trading mais j'ai jamais vu une formation de cette grandeur. C'est du lourd sniper m22 merci sniper chef.",
    rating: 5
  },
  {
    name: "kinanssoh kombate",
    source: "Trustpilot",
    content: "NGT m'a permis de voir le trading autrement, de trader simplement et être rentable sans se casser la tête. Le concepteur est un génie.",
    rating: 5
  },
  {
    name: "Azamat Tiemtore",
    source: "Trustpilot",
    content: "Formation complète. Surtout la partie psychologie nous explique comment fonctionne le cerveau face à l'argent. Le Coach est accessible H24.",
    rating: 5
  },
  {
    name: "thiate thiate",
    source: "Google",
    content: "La gratitude. Formation taillée sur mesure. Simple, efficace, rentable et un accompagnement hors norme.",
    rating: 5
  },
  {
    name: "Kimou Yves AKA",
    source: "Google",
    content: "Je n'ai pas trouvé une formation aussi complète et simple que la vôtre. C'est super.",
    rating: 5
  },
  {
    name: "IT Soficom",
    source: "Google",
    content: "Meilleure formation de trading.",
    rating: 5
  },
  {
    name: "Yapo Chantale",
    source: "Trustpilot",
    content: "New generation traders est pour moi la plus grande opportunité d’apprentissage du trading sans se prendre la tête. Je conseille vivement.",
    rating: 5
  },
  {
    name: "Armel Kouandj",
    source: "Trustpilot",
    content: "Formation efficace surtout le promoteur est bienveillant envers ses étudiants. Je conseille cette formation à toute personne voulant franchir un autre cap.",
    rating: 5
  },
  {
    name: "Simeon Kouassi",
    source: "Trustpilot",
    content: "Juste génial même après avoir fini ta formation tu as toujours le soutien du coach.",
    rating: 5
  },
  {
    name: "Sekou Aly Kpamou",
    source: "Trustpilot",
    content: "New-génération trader est une entreprise très engagée dans la formation des jeunes traders dans la plus grande simplicité.",
    rating: 5
  },
  {
    name: "jacob marchand",
    source: "Trustpilot",
    content: "Je recommande fortement cette formation à tous. Depuis que je trade avec le plan caméléon, je suis serein.",
    rating: 5
  },
  {
    name: "ELIE DONDASSE",
    source: "Trustpilot",
    content: "La formation est pratique et pragmatique. Quant au formateur il est une chance pour ceux qui le rencontrent.",
    rating: 5
  },
  {
    name: "Hamdane Benatia",
    source: "Trustpilot",
    content: "L'expérience reflète le sérieux et la meilleure assistance que je n'ai jamais connue auparavant. Je mets 50 étoiles.",
    rating: 5
  }
];

export default function Testimonials() {
  const { t } = useTranslation();
  const [showAllReviews, setShowAllReviews] = useState(false);

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-ngt-black border-t border-ngt-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold mb-4 block">{t("testimonials.badge")}</span>
          <h2 className="text-4xl md:text-6xl font-serif">{t("testimonials.title")}</h2>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 bg-ngt-white/5 px-4 py-2 border border-ngt-white/10">
              <div className="flex text-ngt-gold">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-ngt-white/60">4.8/5 Google</span>
            </div>
            <div className="flex items-center gap-2 bg-ngt-white/5 px-4 py-2 border border-ngt-white/10">
              <div className="flex text-[#00b67a]">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-ngt-white/60">Trustpilot Verified</span>
            </div>
          </div>
        </div>

        {/* Featured Video Testimonial */}
        <div className="mb-32 relative">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/5 blur-[120px] -z-10"></div>
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-red-500/20 bg-red-500/5 rounded-full mb-4">
              <Youtube size={14} className="text-red-500" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-bold">{t("testimonials.youtube.badge")}</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-serif mb-4">{t("testimonials.youtube.title")}</h3>
            <p className="text-ngt-white/40 text-sm max-w-xl mx-auto font-light leading-relaxed">
              {t("testimonials.youtube.desc")}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-video group border border-ngt-white/10 bg-ngt-black overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.1)]"
            >
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/omJ81OtdNnE"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </motion.div>
            
            <div className="mt-12 text-center">
              <a 
                href="https://www.youtube.com/@newgenerationtraders7354" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-10 py-5 bg-red-600 text-white text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-red-700 transition-all shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:-translate-y-1"
              >
                <Youtube size={18} />
                {t("testimonials.youtube.btn")}
              </a>
              <p className="mt-6 text-[10px] uppercase tracking-widest text-ngt-white/30 max-w-2xl mx-auto leading-relaxed">
                {t("testimonials.youtube.footer")}
              </p>
            </div>
          </div>
        </div>

        {/* Text Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {textReviews.slice(0, showAllReviews ? textReviews.length : 6).map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="p-8 border border-ngt-white/5 bg-ngt-white/[0.02] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={12} className="text-ngt-gold" fill="currentColor" />
                    ))}
                  </div>
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-1 border ${review.source === 'Google' ? 'border-blue-500/30 text-blue-400' : 'border-[#00b67a]/30 text-[#00b67a]'}`}>
                    {review.source}
                  </span>
                </div>
                <p className="text-ngt-white/60 text-sm leading-relaxed mb-6 font-light">
                  "{review.content}"
                </p>
              </div>
              <div className="pt-6 border-t border-ngt-white/5">
                <h4 className="text-ngt-white text-xs font-medium uppercase tracking-wider">{review.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        {!showAllReviews && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setShowAllReviews(true)}
              className="px-8 py-3 border border-ngt-white/10 text-ngt-white/60 text-[10px] uppercase tracking-widest hover:bg-ngt-white/5 transition-all"
            >
              {t("testimonials.more")}
            </button>
          </div>
        )}

        <div className="mt-20 text-center">
          <a 
            href="https://fr.trustpilot.com/review/new-generation-traders.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-ngt-gold text-[10px] uppercase tracking-[0.2em] hover:text-ngt-white transition-colors"
          >
            {t("testimonials.trustpilot")} <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
