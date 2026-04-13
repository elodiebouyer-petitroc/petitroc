import React, { useState } from "react";
import { motion } from "motion/react";
import { Loader2, ArrowRight } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { trackLeadCapture } from "../lib/analytics";

interface EmailCaptureProps {
  onSuccess?: () => void;
  buttonText?: string;
}

export default function EmailCapture({ onSuccess, buttonText = "Recevoir ma formation gratuite" }: EmailCaptureProps) {
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
        source: "lead_magnet_psychology"
      });

      trackLeadCapture(email, name);
      
      // Send Welcome Email via server
      try {
        await fetch("/api/send-welcome-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, type: "free_training" })
        });
      } catch (emailErr) {
        console.error("Error triggering welcome email:", emailErr);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Lead capture error:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <div>
        <input
          type="text"
          placeholder="Ton Prénom"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-ngt-white outline-none focus:border-ngt-gold/50 transition-all"
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Ton Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-ngt-white outline-none focus:border-ngt-gold/50 transition-all"
        />
      </div>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-ngt-gold text-ngt-black font-bold uppercase tracking-[0.2em] rounded-xl gold-gradient flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <>{buttonText} <ArrowRight size={18} /></>}
      </button>
      <p className="text-[9px] text-gray-500 text-center uppercase tracking-widest">
        🔒 Tes données sont sécurisées. Pas de spam.
      </p>
    </form>
  );
}
