import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "motion/react";
import { 
  LogOut, 
  Play, 
  Lock, 
  Brain, 
  Target, 
  Cpu, 
  User as UserIcon,
  Loader2,
  ChevronRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface UserProfile {
  hasAccessPsychology?: boolean;
  hasAccessCameleon?: boolean;
  hasAccessAlgo?: boolean;
  isAlgoUser?: boolean;
  displayName?: string;
  email?: string;
}

export default function MemberArea() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ngt-black">
        <Loader2 className="animate-spin text-ngt-gold" size={48} />
      </div>
    );
  }

  const formations = [
    {
      id: "psychology",
      title: "Psychologie du Trading",
      icon: <Brain size={24} />,
      access: profile?.hasAccessPsychology,
      link: "/formation-psychologie",
      desc: "Maîtrisez votre esprit avant de maîtriser les graphiques."
    },
    {
      id: "cameleon",
      title: "Plan Caméléon",
      icon: <Target size={24} />,
      access: profile?.hasAccessCameleon,
      link: "/formation-cameleon",
      desc: "La stratégie Sniper sans indicateur pour dominer le marché."
    },
    {
      id: "algo",
      title: "Algorithme Caméléon",
      icon: <Cpu size={24} />,
      access: profile?.hasAccessAlgo || profile?.isAlgoUser,
      link: "/cameleon-algo",
      desc: "L'outil de précision institutionnelle pour vos trades."
    }
  ];

  return (
    <div className="min-h-screen bg-ngt-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold mb-2 block">Bienvenue Sniper</span>
            <h1 className="text-4xl md:text-5xl font-serif italic gold-text">
              {user?.displayName || user?.email?.split('@')[0] || "Membre"}
            </h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-ngt-white/40 hover:text-red-500 transition-colors text-xs uppercase tracking-widest"
          >
            <LogOut size={16} /> Se déconnecter
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-serif mb-6 border-b border-ngt-white/10 pb-4">Vos Formations</h2>
            
            <div className="grid gap-6">
              {formations.map((f) => (
                <motion.div 
                  key={f.id}
                  whileHover={f.access ? { x: 10 } : {}}
                  className={`p-8 border transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-8 ${
                    f.access 
                      ? "border-ngt-gold/30 bg-ngt-gold/[0.02] hover:bg-ngt-gold/[0.05]" 
                      : "border-ngt-white/5 bg-ngt-white/[0.01] opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${f.access ? "bg-ngt-gold/10 text-ngt-gold" : "bg-ngt-white/5 text-ngt-white/20"}`}>
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-serif mb-2">{f.title}</h3>
                      <p className="text-sm text-ngt-white/40 max-w-sm">{f.desc}</p>
                    </div>
                  </div>

                  {f.access ? (
                    <Link 
                      to={f.link}
                      className="px-8 py-3 bg-ngt-gold text-ngt-black text-[10px] uppercase tracking-widest font-bold gold-gradient flex items-center gap-2"
                    >
                      <Play size={14} fill="currentColor" /> Reprendre
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 text-ngt-white/20 text-[10px] uppercase tracking-widest font-bold border border-ngt-white/10 px-6 py-3">
                      <Lock size={14} /> Verrouillé
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="p-8 border border-ngt-white/10 bg-ngt-white/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <UserIcon className="text-ngt-gold" size={20} />
                <h2 className="text-lg font-serif">Votre Profil</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-ngt-white/30 block mb-1">Email</span>
                  <span className="text-sm text-ngt-white/70">{user?.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-ngt-white/30 block mb-1">Statut</span>
                  <span className="text-xs text-ngt-gold bg-ngt-gold/10 px-2 py-1 rounded">Membre Actif</span>
                </div>
              </div>
            </div>

            <div className="p-8 border border-ngt-gold/20 bg-ngt-gold/[0.02]">
              <h3 className="text-lg font-serif mb-4">Besoin d'aide ?</h3>
              <p className="text-sm text-ngt-white/50 mb-6">
                Une question sur votre accès ou un problème technique ?
              </p>
              <Link 
                to="/support"
                className="text-ngt-gold text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 group"
              >
                Contacter le support <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
