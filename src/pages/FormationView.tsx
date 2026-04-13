import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "motion/react";
import { Lock, ArrowLeft, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Lesson {
  title: string;
  videoId: string;
}

interface TokenData {
  formationName: string;
  youtubeVideoId: string;
  lessons?: Lesson[];
  userId: string;
  expiresAt: { _seconds: number };
}

export default function FormationView() {
  const { token } = useParams<{ token: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formation, setFormation] = useState<TokenData | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string>("");
  const [currentLessonTitle, setCurrentLessonTitle] = useState<string>("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate(`/login?redirect=/formation/${token}`);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/verify-token/${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors de la vérification du token");
        }

        // Security check: token must belong to the logged-in user
        if (data.userId !== user.uid) {
          throw new Error("Cet accès ne vous appartient pas.");
        }

        setFormation(data);
        setCurrentVideoId(data.youtubeVideoId);
        setCurrentLessonTitle(data.lessons?.[0]?.title || data.formationName);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-ngt-black flex items-center justify-center">
        <Loader2 className="text-ngt-gold animate-spin" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ngt-black text-ngt-white flex flex-col items-center justify-center p-6">
        <AlertTriangle className="text-red-500 mb-6" size={64} />
        <h1 className="text-3xl font-serif mb-4 text-center">Accès Refusé</h1>
        <p className="text-ngt-white/60 mb-8 text-center max-w-md">{error}</p>
        <Link 
          to="/espace-membre" 
          className="px-8 py-3 bg-ngt-gold text-ngt-black font-bold uppercase tracking-widest text-xs"
        >
          Retour à l'espace membre
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ngt-black text-ngt-white">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link 
            to="/espace-membre" 
            className="inline-flex items-center gap-2 text-ngt-white/40 hover:text-ngt-gold mb-8 transition-colors text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            Retour à l'espace membre
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold mb-4 block">Formation Sniper</span>
              <h1 className="text-4xl md:text-5xl font-serif italic gold-text">
                {formation?.formationName}
                {currentLessonTitle !== formation?.formationName && (
                  <span className="block text-2xl mt-2 text-white/60 not-italic font-sans uppercase tracking-widest">
                    {currentLessonTitle}
                  </span>
                )}
              </h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="text-[10px] uppercase tracking-widest text-green-500 font-bold">Accès Sécurisé</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="relative">
                <VideoPlayer 
                  videoId={currentVideoId} 
                  title={currentLessonTitle} 
                />
                
                {/* Watermark to discourage screen recording */}
                <div className="absolute top-4 right-4 pointer-events-none opacity-20 select-none z-20">
                  <span className="text-[10px] text-white font-mono tracking-tighter">
                    NGT ACADEMY - {user?.email} - {new Date().toLocaleDateString()}
                  </span>
                </div>
                
                {/* Floating Watermark */}
                <motion.div 
                  animate={{ 
                    x: [0, 100, 0, -100, 0],
                    y: [0, 50, 100, 50, 0]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none z-20"
                >
                  <span className="text-4xl font-bold whitespace-nowrap">
                    {user?.email}
                  </span>
                </motion.div>
              </div>

              <div className="mt-8 p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                <h3 className="text-xl font-serif mb-4 gold-text italic">Instructions de visionnage</h3>
                <p className="text-ngt-white/60 leading-relaxed mb-6">
                  Cette vidéo est réservée exclusivement aux membres de la NGT Academy. Elle est hébergée de manière sécurisée et ne peut être visionnée que via cet espace membre.
                </p>
                <div className="flex items-start gap-4 p-4 bg-ngt-gold/5 border border-ngt-gold/10 rounded-xl">
                  <AlertTriangle className="text-ngt-gold shrink-0" size={20} />
                  <p className="text-xs text-ngt-gold/80 leading-relaxed">
                    Si la vidéo ne s'affiche pas, vérifiez votre connexion internet ou rafraîchissez la page. En cas de problème persistant, contactez le support.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {formation?.lessons && formation.lessons.length > 0 && (
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                    <h4 className="font-serif italic text-ngt-gold text-lg">Programme</h4>
                  </div>
                  <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    {formation.lessons.map((lesson, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentVideoId(lesson.videoId);
                          setCurrentLessonTitle(lesson.title);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full text-left p-4 flex gap-4 transition-colors border-b border-white/5 last:border-0 ${
                          currentVideoId === lesson.videoId 
                            ? "bg-ngt-gold/10 text-ngt-gold" 
                            : "hover:bg-white/[0.03] text-ngt-white/60"
                        }`}
                      >
                        <span className="text-[10px] font-mono opacity-40 mt-1">{(index + 1).toString().padStart(2, '0')}</span>
                        <span className="text-sm font-medium leading-tight">{lesson.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 bg-ngt-gold text-ngt-black rounded-2xl gold-gradient">
                <h4 className="font-bold uppercase tracking-widest text-xs mb-4">Statut de progression</h4>
                <button className="w-full py-3 bg-ngt-black text-ngt-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-ngt-white/10 transition-colors">
                  Marquer comme terminé
                </button>
              </div>
              
              <div className="p-6 border border-white/5 rounded-2xl">
                <h4 className="text-ngt-white/40 uppercase tracking-widest text-[10px] mb-4">Support</h4>
                <p className="text-xs text-ngt-white/60 mb-4">Un problème avec cette vidéo ?</p>
                <a href="mailto:support@ngt-academy.com" className="text-xs text-ngt-gold hover:underline">support@ngt-academy.com</a>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
