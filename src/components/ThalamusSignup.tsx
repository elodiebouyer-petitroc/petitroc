import React, { useState } from "react";
import { motion } from "motion/react";
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { trackEvent } from "../lib/analytics";

interface ThalamusSignupProps {
  onSuccess?: () => void;
  buttonText?: string;
}

export default function ThalamusSignup({ onSuccess, buttonText = "Accéder gratuitement" }: ThalamusSignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Save to Firestore
      await addDoc(collection(db, "leads"), {
        name,
        email,
        createdAt: serverTimestamp(),
        source: "thalamus_ia",
        type: "ia_access"
      });

      trackEvent('thalamus_signup', { email, name });
      
      // Send Welcome Email via server
      try {
        await fetch("/api/send-welcome-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, type: "thalamus" })
        });
      } catch (emailErr) {
        console.error("Error triggering welcome email:", emailErr);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Thalamus signup error:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto relative z-10">
      <div className="space-y-4">
        <div className="relative group">
          <input
            type="text"
            placeholder="Ton Prénom"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-6 py-4 bg-ngt-black/40 border border-white/10 rounded-2xl text-ngt-white outline-none focus:border-ngt-gold/50 transition-all backdrop-blur-md"
          />
        </div>
        <div className="relative group">
          <input
            type="email"
            placeholder="Ton Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-ngt-black/40 border border-white/10 rounded-2xl text-ngt-white outline-none focus:border-ngt-gold/50 transition-all backdrop-blur-md"
          />
        </div>
      </div>
      
      {error && <p className="text-red-500 text-xs italic text-center">{error}</p>}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-ngt-gold text-ngt-black font-bold uppercase tracking-[0.2em] rounded-2xl gold-gradient flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-ngt-gold/20"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <>{buttonText} <ArrowRight size={18} /></>}
      </button>
      
      <div className="flex items-center justify-center gap-2 text-[9px] text-gray-500 uppercase tracking-widest">
        <ShieldCheck size={12} className="text-ngt-gold" />
        <span>Accès sécurisé & données protégées</span>
      </div>
    </form>
  );
}
