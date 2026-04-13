import { motion } from "motion/react";
import { Menu, X, Youtube } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Nos formations", href: isHome ? "#products" : "/#products" },
    { name: "Algorithme", href: "/cameleon-algo" },
    { name: "Thalamus IA", href: "/thalamus-ia" },
    { name: "Espace Membre", href: "/espace-membre" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-ngt-black/60 backdrop-blur-xl border-b border-ngt-gold/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative h-12 w-12 flex items-center justify-center transition-transform duration-500 group-hover:rotate-90">
            <div className="absolute inset-0 border-2 border-ngt-gold rounded-full opacity-80 group-hover:opacity-100"></div>
            <div className="absolute inset-[30%] border border-ngt-gold/40 rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-ngt-gold/20"></div>
            <div className="absolute left-1/2 top-0 w-[1px] h-full bg-ngt-gold/20"></div>
            <div className="w-2 h-2 bg-ngt-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,1)]"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold tracking-tighter gold-text-pro leading-none">NGT</span>
            <span className="text-[8px] uppercase tracking-[0.4em] text-ngt-gold/60 font-sans font-bold">New Generation Traders</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            link.href.startsWith("#") || (link.href.startsWith("/") && link.href.includes("#")) ? (
              <a
                key={link.name}
                href={link.href}
                className="text-[10px] uppercase tracking-[0.2em] text-ngt-white/60 hover:text-ngt-gold transition-all duration-300 relative py-2 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-ngt-gold transition-all duration-300 group-hover:w-full"></span>
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className="text-[10px] uppercase tracking-[0.2em] text-ngt-white/60 hover:text-ngt-gold transition-all duration-300 relative py-2 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-ngt-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )
          ))}
          
          <div className="flex items-center gap-6 border-l border-ngt-white/10 pl-10">
            <LanguageSwitcher />
            <a 
              href="https://www.youtube.com/@newgenerationtraders7354" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-500 transition-all duration-300 hover:scale-110"
              title="Notre chaîne YouTube"
            >
              <Youtube size={22} />
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-ngt-gold p-2 hover:bg-ngt-white/5 rounded-full transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-0 w-full bg-ngt-black border-b border-ngt-gold/20 p-6 flex flex-col gap-6 md:hidden"
        >
          {navLinks.map((link) => (
            link.href.startsWith("#") || (link.href.startsWith("/") && link.href.includes("#")) ? (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-widest text-ngt-white/70 hover:text-ngt-gold"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-widest text-ngt-white/70 hover:text-ngt-gold"
              >
                {link.name}
              </Link>
            )
          ))}
          <div className="pt-4 border-t border-ngt-white/10 flex flex-col gap-6">
            <div className="flex justify-between items-center px-2">
              <LanguageSwitcher />
            </div>
            <a 
              href="https://www.youtube.com/@newgenerationtraders7354" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm uppercase tracking-widest text-red-600 hover:text-red-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Youtube size={20} />
              YouTube
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
