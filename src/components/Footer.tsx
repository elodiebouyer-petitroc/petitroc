import { Instagram, Youtube, Facebook, Send, MessageCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const socialLinks = [
    { icon: <Instagram size={20} />, href: "https://www.instagram.com/ngt.sniper/", label: "Instagram" },
    { icon: <Youtube size={20} />, href: "https://www.youtube.com/@newgenerationtraders7354", label: "YouTube" },
    { icon: <Facebook size={20} />, href: "https://www.facebook.com/trading.ngt", label: "Facebook" },
    { icon: <Send size={20} />, href: "https://t.me/ngtsniper/3", label: "Telegram" },
    { icon: <MessageCircle size={20} />, href: "https://wa.me/33782991055", label: "WhatsApp" },
    { icon: <span className="font-bold text-xs">TikTok</span>, href: "https://www.tiktok.com/@sniperngt", label: "TikTok" },
  ];

  const paymentMethods = [
    "Visa", "Mastercard", "PayPal", "Orange Money", "MTN Money", "Wave", "Moov Money"
  ];

  return (
    <footer className="bg-ngt-black border-t border-ngt-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Risk Warning - MANDATORY */}
        <div className="mb-16 p-6 border border-ngt-red/30 bg-ngt-red/[0.03] flex flex-col md:flex-row items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-ngt-red/20 flex items-center justify-center text-ngt-red shrink-0">
            <AlertTriangle size={24} />
          </div>
          <p className="text-[11px] text-ngt-white/50 leading-relaxed uppercase tracking-wider text-center md:text-left">
            <span className="text-ngt-red font-bold">Avertissement de risque :</span> Le trading sur les marchés financiers comporte un niveau de risque élevé et peut ne pas convenir à tous les investisseurs. L'effet de levier peut agir aussi bien à votre avantage qu'à votre désavantage. Vous pouvez perdre l'intégralité de votre capital investi. New Generation Traders (NGT) ne fournit pas de conseils en investissement.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative h-12 w-12 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-ngt-gold rounded-full"></div>
                <div className="absolute inset-[30%] border border-ngt-gold/50 rounded-full"></div>
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-ngt-gold/30"></div>
                <div className="absolute left-1/2 top-0 w-[1px] h-full bg-ngt-gold/30"></div>
                <div className="w-1.5 h-1.5 bg-ngt-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
              </div>
              <span className="text-2xl font-serif font-bold tracking-tighter gold-text-pro">NGT</span>
            </div>
            <p className="text-ngt-white/40 text-sm max-w-md leading-relaxed mb-8">
              New Generation Traders n’est pas une simple formation de trading. 
              C’est une école de transformation mentale et financière pour ceux qui visent l'excellence.
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target={social.href.startsWith('http') ? "_blank" : undefined}
                  rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 rounded-full border border-ngt-white/10 flex items-center justify-center text-ngt-white/40 hover:text-ngt-gold hover:border-ngt-gold transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-ngt-white mb-6">Navigation</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-ngt-white/40 text-sm hover:text-ngt-gold transition-colors">{t("nav.home")}</Link></li>
              <li><a href="/#free-training" className="text-ngt-white/40 text-sm hover:text-ngt-gold transition-colors">Formation Gratuite</a></li>
              <li><a href="/#products" className="text-ngt-white/40 text-sm hover:text-ngt-gold transition-colors">{t("nav.algorithms")}</a></li>
              <li><Link to="/faq" className="text-ngt-white/40 text-sm hover:text-ngt-gold transition-colors">FAQ</Link></li>
              <li><a href="/#services" className="text-ngt-white/40 text-sm hover:text-ngt-gold transition-colors">Coaching</a></li>
              <li><Link to="/support" className="text-ngt-white/40 text-sm hover:text-ngt-gold transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-ngt-white mb-6">Paiements Sécurisés</h4>
            <p className="text-ngt-white/40 text-[10px] uppercase tracking-widest mb-6">
              Moyens acceptés (International & Afrique)
            </p>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <span key={method} className="px-3 py-1 border border-ngt-white/10 text-[9px] uppercase tracking-widest text-ngt-white/30">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-ngt-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-ngt-white/20">
            © {new Date().getFullYear()} New Generation Traders. Fondé par OUATTARA Abou.
          </p>
          <div className="flex gap-8">
            <Link to="/mentions-legales" className="text-[10px] uppercase tracking-widest text-ngt-white/20 hover:text-ngt-white transition-colors">Mentions Légales</Link>
            <Link to="/cgv" className="text-[10px] uppercase tracking-widest text-ngt-white/20 hover:text-ngt-white transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
