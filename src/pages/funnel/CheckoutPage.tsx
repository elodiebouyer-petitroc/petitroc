import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Lock, ShieldCheck, CreditCard, ChevronRight, Loader2 } from "lucide-react";
import { trackEvent } from "../../lib/analytics";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { STRIPE_PRODUCTS, ProductId } from "../../lib/stripe";
import { auth } from "../../firebase";

export default function CheckoutPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productIdParam = params.get('productId');
    
    // Find product by id field instead of object key to handle case sensitivity
    const foundProduct = Object.values(STRIPE_PRODUCTS).find(p => p.id === productIdParam);
    
    if (foundProduct) {
      setProduct(foundProduct);
      trackEvent('checkout_start', { productId: foundProduct.id });
    } else {
      window.location.href = "/plan-cameleon";
    }
  }, []);

  const handleCheckout = async () => {
    if (!product) return;
    setLoading(true);
    trackEvent('checkout_submit', { productId: product.id });

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          priceId: product.priceId,
          userId: auth.currentUser?.uid || `anon_${Date.now()}`,
          email: auth.currentUser?.email || "",
          mode: product.mode,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Une erreur est survenue lors de l'initialisation du paiement.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="min-h-screen bg-ngt-black text-ngt-white">
      <Navbar />
      
      <main className="pt-40 pb-24 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl md:text-5xl font-serif italic gold-text mb-12">Récapitulatif de la commande</h1>
            
            <div className="p-8 bg-ngt-dark-gray border border-white/5 rounded-3xl mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-ngt-white">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Accès immédiat après paiement</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-serif italic text-ngt-gold">{product.price}€</p>
                  {product.mode === 'subscription' && <p className="text-[10px] uppercase text-gray-500">/ mois</p>}
                </div>
              </div>
              
              <div className="border-t border-white/5 pt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sous-total</span>
                  <span className="text-ngt-white">{product.price}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">TVA (20%)</span>
                  <span className="text-ngt-white">Incluse</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/5">
                  <span className="gold-text">Total</span>
                  <span className="gold-text">{product.price}€</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-ngt-gold/5 border border-ngt-gold/10 rounded-2xl">
                <ShieldCheck className="text-ngt-gold" size={24} />
                <div>
                  <p className="text-sm font-bold text-ngt-white uppercase tracking-widest">Paiement 100% Sécurisé</p>
                  <p className="text-xs text-gray-500">Cryptage SSL 256-bit de niveau bancaire</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-12 bg-ngt-dark-gray border border-ngt-gold/20 rounded-[3rem] shadow-2xl relative"
          >
            <div className="mb-12">
              <h2 className="text-2xl font-serif italic gold-text mb-4">Finaliser le paiement</h2>
              <p className="text-gray-400 text-sm">Choisis ton mode de paiement sécurisé via Stripe ou Klarna.</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4 justify-center mb-8 opacity-50">
                <CreditCard size={32} />
                <div className="w-px h-8 bg-white/10"></div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Klarna_Logo.svg" alt="Klarna" className="h-6" />
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-6 bg-ngt-gold text-ngt-black font-bold uppercase tracking-[0.3em] rounded-xl gold-gradient flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>Payer {product.price}€ <ChevronRight size={18} /></>
                )}
              </button>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                  <Lock size={14} />
                  <span className="text-[10px] uppercase tracking-widest">Transactions sécurisées par Stripe</span>
                </div>
                <p className="text-[9px] text-gray-600 leading-relaxed">
                  En cliquant sur "Payer", vous acceptez nos conditions générales de vente. Vos accès seront envoyés instantanément par email après validation du paiement.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
