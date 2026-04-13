import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth, isSignInWithEmailLink, signInWithEmailLink } from "../firebase";
import { motion } from "motion/react";
import { Loader2, AlertCircle } from "lucide-react";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const completeSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        
        // If email is missing from localStorage, ask user for it (security measure)
        if (!email) {
          email = window.prompt('Veuillez confirmer votre adresse email pour la connexion');
        }

        if (email) {
          try {
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            navigate("/espace-membre");
          } catch (err: any) {
            console.error("Error signing in with email link:", err);
            setError("Le lien est invalide ou a expiré. Veuillez en demander un nouveau.");
          }
        }
      } else {
        navigate("/login");
      }
    };

    completeSignIn();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ngt-black px-6">
      <div className="max-w-md w-full text-center">
        {!error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <Loader2 className="animate-spin text-ngt-gold" size={48} />
            <h1 className="text-2xl font-serif italic gold-text">Authentification en cours...</h1>
            <p className="text-ngt-white/50">Veuillez patienter pendant que nous sécurisons votre accès.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 p-10"
          >
            <AlertCircle className="text-red-500 mx-auto mb-6" size={48} />
            <h2 className="text-xl font-serif mb-4 text-red-500">Erreur d'authentification</h2>
            <p className="text-ngt-white/60 text-sm mb-8 leading-relaxed">{error}</p>
            <button 
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-ngt-gold text-ngt-black text-[10px] uppercase tracking-widest font-bold gold-gradient"
            >
              Retour à la connexion
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
