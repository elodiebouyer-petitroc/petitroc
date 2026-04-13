import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useTranslation } from "react-i18next";

export default function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      await addDoc(collection(db, "newsletter"), {
        email,
        timestamp: serverTimestamp(),
        source: "website_footer"
      });
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Error signing up for newsletter:", error);
      setStatus("error");
    }
  };

  return (
    <div className="p-8 md:p-12 border border-ngt-gold/20 bg-ngt-gold/[0.02] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-ngt-gold/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="text-ngt-gold" size={24} />
            <span className="text-xs uppercase tracking-[0.4em] text-ngt-gold font-bold">{t("newsletter.badge")}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif mb-4 italic">{t("newsletter.title")}</h3>
          <p className="text-ngt-white/50 text-sm font-light leading-relaxed">
            {t("newsletter.desc")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              required
              className="w-full bg-ngt-black border border-ngt-white/10 px-6 py-4 text-ngt-white text-sm focus:border-ngt-gold outline-none transition-all placeholder:text-ngt-white/20"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="absolute right-2 top-2 bottom-2 px-6 bg-ngt-gold text-ngt-black text-[10px] uppercase tracking-widest font-bold gold-gradient hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {status === "loading" ? t("newsletter.loading") : status === "success" ? <CheckCircle2 size={16} /> : <><Send size={14} /> {t("newsletter.btn")}</>}
            </button>
          </div>
          {status === "success" && (
            <p className="text-ngt-gold text-[10px] uppercase tracking-widest text-center">{t("newsletter.success")}</p>
          )}
          {status === "error" && (
            <p className="text-ngt-red text-[10px] uppercase tracking-widest text-center">{t("newsletter.error")}</p>
          )}
        </form>
      </div>
    </div>
  );
}
