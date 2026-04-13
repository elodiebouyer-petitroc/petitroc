import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setSent(true);
        // Save email for callback
        window.localStorage.setItem('emailForSignIn', email);
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Impossible d'envoyer le lien. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-ngt-black relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ngt-gold/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-ngt-white/[0.02] border border-ngt-white/10 p-10 backdrop-blur-xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif mb-4 italic gold-text">Espace Membre</h1>
            <p className="text-ngt-white/50 text-sm">
              Connectez-vous instantanément sans mot de passe.
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSendLink} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ngt-gold/50" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com" 
                  required
                  className="w-full bg-ngt-white/5 border border-ngt-white/10 py-4 pl-12 pr-4 text-sm focus:border-ngt-gold outline-none transition-colors text-ngt-white"
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs text-center">{error}</p>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-ngt-gold text-ngt-black text-xs uppercase tracking-widest font-bold gold-gradient flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    Recevoir mon lien magique <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-ngt-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-ngt-gold" size={32} />
              </div>
              <h2 className="text-xl font-serif mb-4">Lien envoyé !</h2>
              <p className="text-ngt-white/60 text-sm mb-8 leading-relaxed">
                Un lien de connexion a été envoyé à <strong>{email}</strong>.<br />
                Vérifiez votre boîte de réception (et vos spams).
              </p>
              <button 
                onClick={() => setSent(false)}
                className="text-ngt-gold text-[10px] uppercase tracking-widest hover:underline"
              >
                Utiliser une autre adresse
              </button>
            </motion.div>
          )}

          <div className="mt-10 pt-10 border-t border-ngt-white/10 text-center">
            <p className="text-[10px] uppercase tracking-widest text-ngt-white/30">
              Pas encore membre ? <br />
              <a href="/#products" className="text-ngt-gold hover:underline mt-2 inline-block">Découvrir nos formations</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
