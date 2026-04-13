import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, ShieldCheck, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Support() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ngt-black pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold mb-4 block">Assistance</span>
          <h1 className="text-4xl md:text-6xl font-serif mb-6 italic gold-text">Contacter le Support</h1>
          <p className="text-ngt-white/60 text-lg max-w-2xl mx-auto">
            Une question sur nos formations ou nos outils ? Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-1 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 md:p-12 border border-ngt-white/10 bg-ngt-white/[0.02] rounded-[2rem]"
          >
            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-ngt-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-ngt-gold" size={40} />
                </div>
                <h2 className="text-2xl font-serif mb-4 italic gold-text">Message Envoyé !</h2>
                <p className="text-ngt-white/60 mb-8">
                  Merci de nous avoir contactés. Notre équipe reviendra vers vous par email très prochainement.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="px-8 py-3 border border-ngt-gold/30 text-ngt-gold text-[10px] uppercase tracking-widest font-bold hover:bg-ngt-gold hover:text-ngt-black transition-all"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-ngt-white/40 ml-4">Nom complet</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-ngt-white/[0.03] border border-ngt-white/10 px-6 py-4 rounded-xl focus:border-ngt-gold/50 outline-none transition-all text-ngt-white"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-ngt-white/40 ml-4">Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-ngt-white/[0.03] border border-ngt-white/10 px-6 py-4 rounded-xl focus:border-ngt-gold/50 outline-none transition-all text-ngt-white"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-ngt-white/40 ml-4">Sujet</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-ngt-white/[0.03] border border-ngt-white/10 px-6 py-4 rounded-xl focus:border-ngt-gold/50 outline-none transition-all text-ngt-white"
                    placeholder="De quoi s'agit-il ?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-ngt-white/40 ml-4">Message</label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-ngt-white/[0.03] border border-ngt-white/10 px-6 py-4 rounded-xl focus:border-ngt-gold/50 outline-none transition-all text-ngt-white resize-none"
                    placeholder="Décrivez votre demande en détail..."
                  ></textarea>
                </div>

                {error && (
                  <p className="text-ngt-red text-xs italic">{error}</p>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-ngt-gold text-ngt-black font-bold uppercase tracking-[0.2em] text-[10px] gold-gradient hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Send size={16} />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-10 border border-ngt-gold/20 bg-ngt-gold/[0.03] rounded-3xl text-center"
        >
          <ShieldCheck className="text-ngt-gold mx-auto mb-6" size={40} />
          <h2 className="text-2xl font-serif mb-4">Besoin d'une assistance prioritaire ?</h2>
          <p className="text-ngt-white/60 mb-0 max-w-xl mx-auto">
            Les membres de l'élite bénéficient d'un canal de support dédié et prioritaire pour toutes leurs questions techniques et stratégiques.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
