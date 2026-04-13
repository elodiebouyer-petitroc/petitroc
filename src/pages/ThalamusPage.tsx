import React from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { 
  Brain, 
  Zap, 
  CheckCircle2, 
  Play, 
  Star, 
  Users, 
  BarChart3, 
  Activity, 
  ShieldAlert, 
  Target,
  Quote,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThalamusSignup from "../components/ThalamusSignup";
import { Helmet } from "react-helmet-async";

export default function ThalamusPage() {
  const { t } = useTranslation();

  const handleSuccess = () => {
    // Redirect or show success message
    window.location.href = "/merci?source=thalamus";
  };

  const features = [
    {
      icon: <Activity className="text-ngt-gold" size={24} />,
      title: "Analyse émotionnelle",
      desc: "Détecte ton état de stress ou d'euphorie avant même que tu ne le sentes."
    },
    {
      icon: <ShieldAlert className="text-ngt-gold" size={24} />,
      title: "Détection des biais",
      desc: "FOMO, aversion aux pertes, surtrading... Thalamus identifie tes schémas destructeurs."
    },
    {
      icon: <BarChart3 className="text-ngt-gold" size={24} />,
      title: "Analyse MT5",
      desc: "Connexion directe à tes trades pour une analyse objective de ta performance."
    },
    {
      icon: <Brain className="text-ngt-gold" size={24} />,
      title: "Journal Intelligent",
      desc: "Un journal de trading qui apprend de tes erreurs et te conseille en temps réel."
    }
  ];

  const differences = [
    {
      title: "Journal Excel",
      thalamus: false,
      desc: "Statique, chronophage et sans analyse psychologique."
    },
    {
      title: "Outils Classiques",
      thalamus: false,
      desc: "Se concentrent sur les chiffres, ignorent l'humain derrière l'écran."
    },
    {
      title: "Thalamus IA",
      thalamus: true,
      desc: "L'expertise du Sniper codée pour anticiper tes erreurs mentales."
    }
  ];

  return (
    <div className="min-h-screen bg-ngt-black text-ngt-white selection:bg-ngt-gold selection:text-ngt-black">
      <Helmet>
        <title>Thalamus IA - L'expertise du Sniper à portée de clic | NGT Academy</title>
        <meta name="description" content="Thalamus est l'IA qui pense comme Abou Ouattara (Le Sniper). Maîtrisez votre psychologie de trading avec 10 ans d'expérience codée." />
      </Helmet>
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_50%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-4 mb-8"
            >
              <div className="px-4 py-2 bg-ngt-gold/10 border border-ngt-gold/20 rounded-full backdrop-blur-sm flex items-center gap-2">
                <Sparkles size={14} className="text-ngt-gold animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-ngt-gold font-bold">Intelligence Artificielle</span>
              </div>
              <div className="px-4 py-2 bg-ngt-red/10 border border-ngt-red/20 rounded-full backdrop-blur-sm">
                <span className="text-[10px] uppercase tracking-[0.4em] text-ngt-red font-bold animate-pulse">100% GRATUIT</span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-serif mb-8 italic gold-text leading-tight"
            >
              Thalamus IA
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl text-gray-400 mb-6 font-serif italic"
            >
              "10 ans d'expérience du Sniper à portée de clic"
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto uppercase tracking-widest"
            >
              L'IA qui pense comme le fondateur de NGT. <span className="text-ngt-gold font-bold">Gratuite.</span>
            </motion.p>

            {/* Social Counters */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-16 border-y border-white/5 py-8"
            >
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-serif gold-text italic">1,247+</p>
                <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">Traders Actifs</p>
              </div>
              <div className="text-center border-x border-white/5">
                <p className="text-2xl md:text-3xl font-serif gold-text italic">10 ans</p>
                <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">D'expérience</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-serif gold-text italic">500k+</p>
                <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">Trades Analysés</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative p-1 bg-ngt-gold/20 rounded-[3rem] inline-block"
            >
              <div className="bg-ngt-dark-gray p-12 rounded-[2.8rem] border border-ngt-gold/30 shadow-2xl">
                <ThalamusSignup onSuccess={handleSuccess} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who is behind Thalamus? */}
      <section className="py-32 px-6 border-y border-white/5 bg-ngt-dark-gray/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-[3rem] overflow-hidden border border-ngt-gold/20 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
                  alt="Abou Ouattara - Le Sniper" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ngt-black via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10">
                  <p className="text-2xl font-serif italic gold-text">Abou Ouattara</p>
                  <p className="text-xs uppercase tracking-widest text-gray-400">Fondateur NGT Academy</p>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-ngt-gold/10 rounded-full blur-3xl"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif italic gold-text mb-8">Qui est derrière Thalamus ?</h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Thalamus est l'incarnation digitale de 10 ans d'expérience en psychologie de trading d'Abou Ouattara, plus connu sous le nom de **Le Sniper**.
              </p>
              <div className="space-y-6">
                <p className="text-gray-500 italic">
                  "Le Sniper ne peut pas être partout. Thalamus oui. J'ai voulu créer un outil qui permet à chaque trader d'avoir mon expertise à ses côtés, 24h/24, pour éviter les erreurs qui m'ont coûté des années de travail."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-ngt-gold"></div>
                  <span className="text-xs uppercase tracking-widest text-ngt-gold font-bold">La psychologie du trading, codée par celui qui la pratique depuis 10 ans.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-serif italic gold-text mb-6">Ce que Thalamus analyse</h2>
            <p className="text-gray-500 uppercase tracking-widest text-sm">Détecter l'invisible pour maîtriser ton trading</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-ngt-gold/30 transition-all group"
              >
                <div className="mb-8 p-4 bg-ngt-gold/5 rounded-2xl inline-block group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-ngt-white">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Difference Section */}
      <section className="py-32 px-6 bg-ngt-dark-gray/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-serif italic gold-text mb-6">La différence Thalamus</h2>
            <p className="text-gray-500 uppercase tracking-widest text-sm">Pourquoi l'IA change tout</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {differences.map((d, i) => (
              <div 
                key={i} 
                className={`p-10 rounded-[2.5rem] border transition-all ${
                  d.thalamus 
                  ? "bg-ngt-gold/5 border-ngt-gold/30 shadow-2xl shadow-ngt-gold/5" 
                  : "bg-white/[0.01] border-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className={`text-2xl font-serif italic ${d.thalamus ? "gold-text" : "text-gray-400"}`}>{d.title}</h3>
                  {d.thalamus && <Zap className="text-ngt-gold" size={24} />}
                </div>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">{d.desc}</p>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <CheckCircle2 className={d.thalamus ? "text-ngt-gold" : "text-gray-700"} size={16} />
                      <div className={`h-1 flex-1 rounded-full ${d.thalamus ? "bg-ngt-gold/20" : "bg-white/5"}`}></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demonstration Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-ngt-gold/20 group cursor-pointer shadow-2xl shadow-ngt-gold/5">
            <img 
              src="https://images.unsplash.com/photo-1611974714851-eb605161882b?auto=format&fit=crop&q=80&w=1600" 
              alt="Démonstration Thalamus" 
              className="w-full h-full object-cover grayscale group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-ngt-black/40 group-hover:bg-ngt-black/20 transition-all flex items-center justify-center">
              <div className="w-24 h-24 bg-ngt-gold rounded-full flex items-center justify-center gold-gradient shadow-2xl shadow-ngt-gold/50 group-hover:scale-110 transition-all">
                <Play fill="currentColor" size={32} className="text-ngt-black ml-1" />
              </div>
            </div>
            <div className="absolute bottom-10 left-10">
              <p className="text-3xl font-serif italic gold-text">Démonstration Thalamus IA</p>
              <p className="text-xs uppercase tracking-widest text-gray-400">Voir l'IA en action sur les marchés</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-serif italic gold-text mb-6">Ils utilisent Thalamus</h2>
            <p className="text-gray-500 uppercase tracking-widest text-sm">Les retours de nos premiers utilisateurs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Kevin M.", text: "Thalamus a détecté mon biais d'aversion à la perte en 3 trades. J'ai économisé des milliers d'euros ce mois-ci." },
              { name: "Sarah B.", text: "C'est comme avoir Le Sniper qui regarde par-dessus mon épaule. L'analyse émotionnelle est bluffante." },
              { name: "Yassine K.", text: "Le journal intelligent me donne des conseils que je n'aurais jamais trouvés seul. Indispensable." }
            ].map((t, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 bg-white/[0.01] border border-white/5 rounded-[2.5rem] relative"
              >
                <Quote className="absolute top-8 right-8 text-ngt-gold/10" size={40} />
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-ngt-gold fill-ngt-gold" />)}
                </div>
                <p className="text-gray-400 italic mb-8 leading-relaxed">"{t.text}"</p>
                <p className="text-sm font-bold gold-text uppercase tracking-widest">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interface Preview Section */}
      <section className="py-32 px-6 bg-ngt-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-serif italic gold-text mb-6">Aperçu de l'interface</h2>
            <p className="text-gray-500 uppercase tracking-widest text-sm">Une technologie complexe, une expérience simple</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden border border-ngt-gold/20 shadow-2xl shadow-ngt-gold/10"
          >
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1600" 
              alt="Thalamus Dashboard Preview" 
              className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ngt-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="max-w-md">
                <h3 className="text-2xl font-serif italic gold-text mb-2">Dashboard Temps Réel</h3>
                <p className="text-gray-400 text-sm">Visualisez vos biais psychologiques en direct pendant vos sessions de trading.</p>
              </div>
              <div className="flex gap-4">
                <div className="px-6 py-3 bg-ngt-gold text-ngt-black text-[10px] uppercase tracking-widest font-bold rounded-full">Interface Intuitive</div>
                <div className="px-6 py-3 bg-white/10 text-ngt-white text-[10px] uppercase tracking-widest font-bold rounded-full backdrop-blur-md">Mode Sombre</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-serif italic gold-text mb-6">FAQ Thalamus</h2>
            <p className="text-gray-500 uppercase tracking-widest text-sm">Réponses à vos questions sur l'IA</p>
          </div>
          
          <div className="space-y-6">
            {[
              { q: "Pourquoi Thalamus est-il gratuit ?", a: "Nous croyons que la psychologie est le premier obstacle du trader. En offrant Thalamus, nous aidons la communauté NGT à devenir plus disciplinée avant de passer aux outils avancés." },
              { q: "Mes données de trading sont-elles sécurisées ?", a: "Absolument. Thalamus utilise un cryptage de niveau bancaire. Vos données MT5 sont utilisées uniquement pour l'analyse de vos biais et ne sont jamais partagées." },
              { q: "L'IA donne-t-elle des signaux de trading ?", a: "Non. Thalamus n'est pas un robot de trading. C'est un coach psychologique qui analyse VOS décisions pour vous aider à ne plus faire d'erreurs émotionnelles." },
              { q: "Est-ce compatible avec tous les brokers ?", a: "Thalamus se connecte à n'importe quel compte MetaTrader 5 (MT5), quel que soit votre broker." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl"
              >
                <h4 className="text-lg font-bold mb-4 text-ngt-gold flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-ngt-gold/10 flex items-center justify-center text-[10px]">Q</span>
                  {item.q}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed pl-9">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-ngt-gold/5"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-7xl font-serif italic gold-text mb-8 leading-tight">
            Prêt à trader avec l'IA du Sniper ?
          </h2>
          <p className="text-xl text-gray-400 mb-12 uppercase tracking-widest">
            Accès gratuit et instantané.
          </p>
          <div className="bg-ngt-dark-gray p-12 rounded-[3rem] border border-ngt-gold/30 shadow-2xl">
            <ThalamusSignup onSuccess={handleSuccess} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
